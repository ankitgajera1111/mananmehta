"""Import the site's current content into MongoDB and create the admin login.

    python seed.py                 # add anything missing, leave existing edits alone
    python seed.py --reset         # wipe content collections first
    python seed.py --admin-only    # only create/update the admin account

Idempotent: content is upserted on stable ids, so re-running never duplicates
rows, and without --reset it never overwrites the client's edits.
"""
from __future__ import annotations

import argparse
import asyncio
import getpass
import logging
import sys

from app.config import get_settings
from app.db import ensure_indexes, ping
from app.seeder import seed_admin, seed_content

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("seed")


def _resolve_password() -> str:
    """Prefer ADMIN_PASSWORD; otherwise prompt so it never enters shell history."""
    settings = get_settings()
    if settings.admin_password:
        return settings.admin_password
    if not sys.stdin.isatty():
        logger.error("Set ADMIN_PASSWORD in backend/.env, or run this interactively.")
        raise SystemExit(1)

    first = getpass.getpass("New admin password (min 8 chars): ")
    if len(first) < 8:
        logger.error("Password must be at least 8 characters.")
        raise SystemExit(1)
    if first != getpass.getpass("Confirm password: "):
        logger.error("Passwords do not match.")
        raise SystemExit(1)
    return first


async def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--reset", action="store_true", help="wipe content first")
    parser.add_argument("--admin-only", action="store_true", help="skip content")
    parser.add_argument("--skip-admin", action="store_true", help="skip the admin user")
    args = parser.parse_args()

    settings = get_settings()
    if settings.use_memory_db:
        logger.error(
            "USE_MEMORY_DB is on, so this script would seed a throwaway database. "
            "Unset it and point MONGO_URL at a real MongoDB."
        )
        raise SystemExit(1)

    if not await ping():
        logger.error(
            "Cannot reach MongoDB at %s. Start it, or point MONGO_URL at Atlas.",
            settings.mongo_url,
        )
        raise SystemExit(1)

    await ensure_indexes()

    if not args.admin_only:
        await seed_content(reset=args.reset)
    if not args.skip_admin:
        created = await seed_admin(settings.admin_email, _resolve_password())
        logger.info(
            "admin %s %s", settings.admin_email, "created" if created else "password updated"
        )

    logger.info("Done.")


if __name__ == "__main__":
    asyncio.run(main())
