"""Cloudinary signed uploads.

The browser uploads straight to Cloudinary; this API only mints the signature.
That keeps large cover art away from Vercel's 4.5 MB request-body cap and 10 s
function timeout, and means image bytes never transit our function at all.

Deleting is the one operation we do server-side, because it needs the secret.
"""
from __future__ import annotations

import hashlib
import logging
import time
from typing import Dict, Optional

import httpx

from ..config import get_settings

logger = logging.getLogger(__name__)

_API_BASE = "https://api.cloudinary.com/v1_1"


def _sign(params: Dict[str, str], api_secret: str) -> str:
    """Cloudinary signature: sorted `k=v` pairs joined by `&`, then SHA-1."""
    canonical = "&".join(f"{k}={params[k]}" for k in sorted(params))
    return hashlib.sha1(f"{canonical}{api_secret}".encode("utf-8")).hexdigest()


def build_upload_signature() -> Dict[str, object]:
    """Params the browser must post to Cloudinary alongside the file."""
    settings = get_settings()
    timestamp = int(time.time())
    signed = {"folder": settings.cloudinary_folder, "timestamp": str(timestamp)}
    return {
        "signature": _sign(signed, settings.cloudinary_api_secret),
        "timestamp": timestamp,
        "apiKey": settings.cloudinary_api_key,
        "cloudName": settings.cloudinary_cloud_name,
        "folder": settings.cloudinary_folder,
        "uploadUrl": f"{_API_BASE}/{settings.cloudinary_cloud_name}/image/upload",
    }


async def delete_asset(public_id: str) -> bool:
    """Best-effort cleanup. A failure here must never block a content save."""
    settings = get_settings()
    if not settings.cloudinary_configured or not public_id:
        return False

    timestamp = int(time.time())
    signed = {"public_id": public_id, "timestamp": str(timestamp)}
    payload = {
        "public_id": public_id,
        "timestamp": timestamp,
        "api_key": settings.cloudinary_api_key,
        "signature": _sign(signed, settings.cloudinary_api_secret),
    }
    url = f"{_API_BASE}/{settings.cloudinary_cloud_name}/image/destroy"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, data=payload)
        return resp.status_code == 200 and resp.json().get("result") == "ok"
    except Exception:  # noqa: BLE001
        logger.exception("Cloudinary delete failed for %s", public_id)
        return False


def normalise_image(value: Optional[object]) -> Dict[str, Optional[str]]:
    """Accept either a bare URL string or an {url, publicId} object.

    Seed data and hand-edited documents use plain strings; the admin panel sends
    objects. Both must land in the database in the same shape.
    """
    if not value:
        return {"url": "", "publicId": None}
    if isinstance(value, str):
        return {"url": value, "publicId": None}
    if isinstance(value, dict):
        return {
            "url": str(value.get("url") or ""),
            "publicId": value.get("publicId") or None,
        }
    return {"url": "", "publicId": None}
