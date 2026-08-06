"""Seeding logic, shared by the seed.py CLI and the in-memory dev bootstrap."""
from __future__ import annotations

import logging

from . import seed_data
from .db import (
    AD_PROJECTS,
    ADMIN_USERS,
    CREDITS,
    FILM_PROJECTS,
    PAGE_CONTENT,
    get_db,
)
from .models import AdProject, Credit, FilmProject
from .security import hash_password

logger = logging.getLogger(__name__)

_COLLECTIONS = [
    (FILM_PROJECTS, FilmProject, seed_data.FILM_PROJECTS),
    (AD_PROJECTS, AdProject, seed_data.AD_PROJECTS),
    (CREDITS, Credit, seed_data.CREDITS),
]


async def seed_content(reset: bool = False, quiet: bool = False) -> None:
    """Upsert the starting content.

    Without `reset`, documents that already exist are left alone, so re-running
    can never clobber the client's edits.
    """
    db = get_db()

    if reset:
        logger.warning("reset: dropping existing content")
        await db[PAGE_CONTENT].delete_many({})
        for name, _, _ in _COLLECTIONS:
            await db[name].delete_many({})

    for key, payload in seed_data.SINGLETONS.items():
        if await db[PAGE_CONTENT].find_one({"_id": key}) and not reset:
            if not quiet:
                logger.info("page %-14s already present, left untouched", key)
            continue
        await db[PAGE_CONTENT].update_one({"_id": key}, {"$set": payload}, upsert=True)
        if not quiet:
            logger.info("page %-14s seeded", key)

    for name, model, rows in _COLLECTIONS:
        created = skipped = 0
        for row in rows:
            # Validating through the model means seed data cannot drift from the
            # schema without this failing loudly.
            document = model.model_validate(row).model_dump(mode="json")
            if await db[name].find_one({"id": document["id"]}) and not reset:
                skipped += 1
                continue
            await db[name].update_one(
                {"id": document["id"]}, {"$set": document}, upsert=True
            )
            created += 1
        if not quiet:
            logger.info("%-14s %d seeded, %d already present", name, created, skipped)


async def seed_admin(email: str, password: str) -> bool:
    """Create or update the admin account. Returns True if newly created."""
    db = get_db()
    email = email.lower().strip()
    existed = await db[ADMIN_USERS].find_one({"email": email}) is not None
    await db[ADMIN_USERS].update_one(
        {"email": email},
        {"$set": {"email": email, "passwordHash": hash_password(password)}},
        upsert=True,
    )
    return not existed
