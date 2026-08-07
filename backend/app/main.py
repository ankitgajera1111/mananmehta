"""FastAPI application factory."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError
from starlette.middleware.cors import CORSMiddleware

from .config import get_settings
from .db import ping
from .routers import admin, auth, public

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Bootstrap the throwaway in-memory database used for local development.

    Against a real MongoDB this does nothing: seeding there is an explicit,
    auditable step (`python seed.py`), never a side effect of booting the API.
    """
    settings = get_settings()
    if settings.use_memory_db:
        from .seeder import seed_admin, seed_content

        await seed_content(quiet=True)
        password = settings.admin_password or "changeme123"
        await seed_admin(settings.admin_email, password)
        logger.warning(
            "In-memory dev database seeded. Admin login: %s / %s",
            settings.admin_email,
            password,
        )
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    # Interactive docs enumerate every admin route, its parameters and schemas.
    # Useful while building, pure reconnaissance once deployed, so they are
    # served only in development.
    docs_enabled = settings.is_dev
    app = FastAPI(
        title="Manan Mehta Portfolio API",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs" if docs_enabled else None,
        redoc_url="/redoc" if docs_enabled else None,
        openapi_url="/openapi.json" if docs_enabled else None,
    )

    # auth is included before admin so /api/admin/login and /api/admin/me
    # resolve against their own concrete routes.
    app.include_router(auth.router)
    app.include_router(admin.router)
    app.include_router(public.router)

    # Same-origin on Vercel makes CORS a no-op there; it matters only for local
    # dev, where CRA serves the frontend on :3000 and the API runs on :8001.
    #
    # Credentials are never combined with a wildcard origin. Browsers reject
    # that pairing anyway, but shipping it invites a real hole the day someone
    # relaxes the cookie's SameSite setting. An unset CORS_ORIGINS in
    # production therefore means "same-origin only", not "anyone".
    origins = [o for o in settings.cors_origins if o != "*"]
    if origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    elif settings.cors_origins:
        # Wildcard was explicitly requested: allow it, but without credentials.
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=False,
            allow_methods=["GET", "POST", "OPTIONS"],
            allow_headers=["*"],
        )

    @app.exception_handler(PyMongoError)
    async def _db_error(_: Request, exc: PyMongoError) -> JSONResponse:
        """Turn a database outage into a clean 503 instead of a stack trace."""
        logger.error("Database error: %s", exc)
        return JSONResponse(
            status_code=503,
            content={"detail": "The database is unavailable. Please try again."},
        )

    @app.get("/health")
    @app.get("/api/health")
    async def health() -> dict:
        return {"status": "healthy", "database": "up" if await ping() else "down"}

    return app


app = create_app()
