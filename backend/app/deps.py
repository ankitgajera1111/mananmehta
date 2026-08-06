"""Shared FastAPI dependencies."""
from __future__ import annotations

from fastapi import Cookie, Depends, HTTPException, status

from .config import get_settings
from .db import ADMIN_USERS, get_db
from .security import decode_access_token

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Not authenticated",
)


async def current_admin(mm_admin: str = Cookie(default=None)) -> dict:
    """Guard for every /api/admin route.

    The token arrives in an httpOnly cookie, so page JavaScript can never read
    it - that is the whole reason for choosing a cookie over localStorage.
    """
    if not mm_admin:
        raise _UNAUTHORIZED

    email = decode_access_token(mm_admin)
    if not email:
        raise _UNAUTHORIZED

    user = await get_db()[ADMIN_USERS].find_one({"email": email}, {"_id": 0})
    if not user:
        # Token is validly signed but the account is gone - reject it.
        raise _UNAUTHORIZED
    return user


AdminDep = Depends(current_admin)
