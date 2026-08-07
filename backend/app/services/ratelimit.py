"""Rate limiting backed by MongoDB.

Counters live in the database rather than in process memory because each
serverless invocation may run in a different instance - an in-memory counter
would reset constantly and enforce nothing.

Fixed-window counting: a key gets `limit` requests per `window_seconds`, then
the window resets. Less precise than a sliding window, but it costs one
round-trip and the precision does not matter for "stop bots hammering a login".

Fails **open**: if the database is unreachable the request is allowed. A
portfolio's contact form going down because a counter could not be written
would be a worse outcome than the abuse this prevents.
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Tuple

from fastapi import Request

from ..db import get_db

logger = logging.getLogger(__name__)

RATE_LIMITS = "rate_limits"


def client_ip(request: Request) -> str:
    """Best-effort client address.

    Vercel terminates TLS at its edge, so the socket address is always an
    internal one; the real client is the first entry of x-forwarded-for.
    """
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"


async def check_rate_limit(
    key: str, limit: int, window_seconds: int
) -> Tuple[bool, int]:
    """Record a hit against `key`.

    Returns (allowed, retry_after_seconds).
    """
    now = datetime.now(timezone.utc)
    collection = get_db()[RATE_LIMITS]

    try:
        doc = await collection.find_one({"_id": key})

        if not doc or doc.get("windowStart") is None:
            await collection.update_one(
                {"_id": key},
                {
                    "$set": {
                        "count": 1,
                        "windowStart": now,
                        "expiresAt": now + timedelta(seconds=window_seconds),
                    }
                },
                upsert=True,
            )
            return True, 0

        window_start = doc["windowStart"]
        if window_start.tzinfo is None:  # Mongo returns naive UTC datetimes
            window_start = window_start.replace(tzinfo=timezone.utc)

        elapsed = (now - window_start).total_seconds()
        if elapsed >= window_seconds:
            # Window expired - start a fresh one.
            await collection.update_one(
                {"_id": key},
                {
                    "$set": {
                        "count": 1,
                        "windowStart": now,
                        "expiresAt": now + timedelta(seconds=window_seconds),
                    }
                },
            )
            return True, 0

        count = int(doc.get("count", 0)) + 1
        if count > limit:
            return False, int(window_seconds - elapsed) + 1

        await collection.update_one({"_id": key}, {"$inc": {"count": 1}})
        return True, 0

    except Exception:  # noqa: BLE001 - never block traffic on a counter failure
        logger.exception("Rate limit check failed for %s; allowing the request", key)
        return True, 0


async def ensure_rate_limit_index() -> None:
    """TTL index so expired counters clean themselves up."""
    await get_db()[RATE_LIMITS].create_index("expiresAt", expireAfterSeconds=0)
