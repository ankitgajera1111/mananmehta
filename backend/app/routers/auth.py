"""Admin authentication: login, logout, session probe, password change."""
from __future__ import annotations

import logging
from functools import lru_cache

from fastapi import APIRouter, Depends, HTTPException, Response, status

from ..config import get_settings
from ..db import ADMIN_USERS, get_db
from ..deps import current_admin
from ..models import ChangePasswordRequest, LoginRequest
from ..security import create_access_token, hash_password, verify_password

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["auth"])

_BAD_CREDENTIALS = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect email or password",
)


def _set_session_cookie(response: Response, token: str) -> None:
    settings = get_settings()
    response.set_cookie(
        key=settings.cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.jwt_expire_hours * 3600,
        path="/",
    )


@lru_cache(maxsize=1)
def _dummy_hash() -> str:
    """A real hash to compare against when the account does not exist.

    Built lazily (a bcrypt round is ~100ms, too costly for every cold start) and
    cached thereafter.
    """
    return hash_password("not-a-real-password")


@router.post("/login")
async def login(payload: LoginRequest, response: Response) -> dict:
    email = payload.email.lower().strip()
    user = await get_db()[ADMIN_USERS].find_one({"email": email})

    # Always run a full bcrypt comparison so an unknown email and a wrong
    # password take the same time, leaking nothing about which accounts exist.
    stored_hash = user["passwordHash"] if user else _dummy_hash()
    password_ok = verify_password(payload.password, stored_hash)
    if not user or not password_ok:
        logger.warning("Failed admin login for %s", email)
        raise _BAD_CREDENTIALS

    _set_session_cookie(response, create_access_token(email))
    return {"email": email}


@router.post("/logout")
async def logout(response: Response) -> dict:
    response.delete_cookie(key=get_settings().cookie_name, path="/")
    return {"ok": True}


@router.get("/me")
async def me(user: dict = Depends(current_admin)) -> dict:
    return {"email": user["email"]}


@router.post("/change-password")
async def change_password(
    payload: ChangePasswordRequest, user: dict = Depends(current_admin)
) -> dict:
    record = await get_db()[ADMIN_USERS].find_one({"email": user["email"]})
    if not record or not verify_password(
        payload.currentPassword, record["passwordHash"]
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    await get_db()[ADMIN_USERS].update_one(
        {"email": user["email"]},
        {"$set": {"passwordHash": hash_password(payload.newPassword)}},
    )
    return {"ok": True}
