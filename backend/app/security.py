"""Password hashing and JWT issue/verify.

bcrypt is used directly rather than through passlib: passlib 1.7.x reads
``bcrypt.__about__.__version__``, which bcrypt 4.1+ removed, and the resulting
warning/breakage is a well-known trap. bcrypt's own API is small enough that the
abstraction buys nothing here.
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt

from .config import get_settings

logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        # Malformed hash in the DB - treat as a failed login, never a 500.
        logger.warning("Password verification failed against a malformed hash")
        return False


def create_access_token(subject: str) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + timedelta(hours=settings.jwt_expire_hours),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> Optional[str]:
    """Return the subject (admin email) or None if the token is unusable."""
    settings = get_settings()
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        logger.warning("Rejected an invalid admin token")
        return None
    subject = payload.get("sub")
    return subject if isinstance(subject, str) else None
