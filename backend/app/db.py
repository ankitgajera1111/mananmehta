"""MongoDB access.

The client is created lazily and cached at module scope. On Vercel that means a
warm invocation reuses the existing connection pool instead of opening a new one
per request, which matters because Atlas M0 caps concurrent connections.
"""
import logging
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from .config import get_settings

logger = logging.getLogger(__name__)

_client: Optional[AsyncIOMotorClient] = None

# Singleton page documents live in one collection keyed by a known _id.
PAGE_CONTENT = "page_content"
SITE_SETTINGS = "site_settings"
HOME_PAGE = "home_page"
ABOUT_PAGE = "about_page"
CONTACT_PAGE = "contact_page"
FILMS_PAGE = "films_page"
ADS_PAGE = "ads_page"
CREDITS_PAGE = "credits_page"

SINGLETON_KEYS = [
    SITE_SETTINGS,
    HOME_PAGE,
    ABOUT_PAGE,
    CONTACT_PAGE,
    FILMS_PAGE,
    ADS_PAGE,
    CREDITS_PAGE,
]

# Ordered, repeatable collections.
FILM_PROJECTS = "film_projects"
AD_PROJECTS = "ad_projects"
CREDITS = "credits"
CONTACT_MESSAGES = "contact_messages"
ADMIN_USERS = "admin_users"


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        settings = get_settings()
        if settings.use_memory_db:
            from mongomock_motor import AsyncMongoMockClient

            logger.warning(
                "USE_MEMORY_DB is on: using an in-process database. "
                "Data is lost on restart. Development only."
            )
            _client = AsyncMongoMockClient()
        else:
            # serverSelectionTimeoutMS keeps a dead DB from hanging until
            # Vercel's 10s function ceiling; we'd rather return a clean 503.
            _client = AsyncIOMotorClient(
                settings.mongo_url,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                maxPoolSize=10,
            )
            logger.info("Created MongoDB client for %s", settings.db_name)
    return _client


def get_db() -> AsyncIOMotorDatabase:
    return get_client()[get_settings().db_name]


async def ping() -> bool:
    if get_settings().use_memory_db:
        return True
    try:
        await get_client().admin.command("ping")
        return True
    except Exception:  # noqa: BLE001 - health check must never raise
        logger.exception("MongoDB ping failed")
        return False


async def ensure_indexes() -> None:
    """Idempotent. Safe to call on every cold start."""
    db = get_db()
    await db[ADMIN_USERS].create_index("email", unique=True)
    for name in (FILM_PROJECTS, AD_PROJECTS, CREDITS):
        await db[name].create_index("id", unique=True)
        await db[name].create_index("order")
    await db[CONTACT_MESSAGES].create_index("createdAt")
