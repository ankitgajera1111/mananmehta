"""Environment-driven configuration.

Every deployment target (local, Vercel, anything later) differs only by env vars,
never by code. Nothing here reads a file at import time except the local .env,
which is absent in serverless and simply skipped.
"""
import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

# backend/app/config.py -> backend/
BACKEND_DIR: Path = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / ".env")


def _bool(name: str, default: bool = False) -> bool:
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


class Settings:
    """Read once, reuse for the life of the process (and of a warm Lambda)."""

    def __init__(self) -> None:
        # --- Database -----------------------------------------------------
        self.mongo_url: str = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
        self.db_name: str = os.environ.get("DB_NAME", "manan_portfolio")
        # Local-development escape hatch: run against an in-process fake instead
        # of a real mongod. Handy on a machine with no MongoDB installed, but it
        # is RAM-only - every restart starts empty and is re-seeded. Refused
        # outside development so it can never be switched on in production.
        self.use_memory_db: bool = _bool("USE_MEMORY_DB") and self.is_dev

        # --- Auth ---------------------------------------------------------
        # Must be overridden in production; we fail loudly below if it isn't.
        self.jwt_secret: str = os.environ.get("JWT_SECRET", "dev-only-insecure-secret")
        self.jwt_algorithm: str = "HS256"
        self.jwt_expire_hours: int = int(os.environ.get("JWT_EXPIRE_HOURS", "12"))
        self.cookie_name: str = "mm_admin"
        # Local dev is plain http, so the cookie can't be Secure there.
        self.cookie_secure: bool = _bool("COOKIE_SECURE", not self.is_dev)
        self.cookie_samesite: str = os.environ.get("COOKIE_SAMESITE", "lax")

        # --- Seed / bootstrap admin ---------------------------------------
        self.admin_email: str = os.environ.get("ADMIN_EMAIL", "admin@manankmehta.com")
        self.admin_password: str = os.environ.get("ADMIN_PASSWORD", "")

        # --- Cloudinary ---------------------------------------------------
        self.cloudinary_cloud_name: str = os.environ.get("CLOUDINARY_CLOUD_NAME", "")
        self.cloudinary_api_key: str = os.environ.get("CLOUDINARY_API_KEY", "")
        self.cloudinary_api_secret: str = os.environ.get("CLOUDINARY_API_SECRET", "")
        self.cloudinary_folder: str = os.environ.get("CLOUDINARY_FOLDER", "manan-portfolio")

        # --- Email --------------------------------------------------------
        # Two delivery routes. SMTP wins when configured because it is the one
        # a user explicitly opted into; Resend is the HTTP fallback.
        self.resend_api_key: str = os.environ.get("RESEND_API_KEY", "")
        self.mail_from: str = os.environ.get("MAIL_FROM", "onboarding@resend.dev")
        self.contact_notify_email: str = os.environ.get("CONTACT_NOTIFY_EMAIL", "")

        self.smtp_host: str = os.environ.get("SMTP_HOST", "")
        self.smtp_port: int = int(os.environ.get("SMTP_PORT", "587"))
        self.smtp_user: str = os.environ.get("SMTP_USER", "")
        self.smtp_password: str = os.environ.get("SMTP_PASSWORD", "")
        # Kept well under Vercel's 10s function ceiling so a stalled SMTP
        # connection still leaves time to return a response to the visitor.
        self.smtp_timeout: int = int(os.environ.get("SMTP_TIMEOUT", "7"))

        # --- HTTP ---------------------------------------------------------
        self.cors_origins: list[str] = [
            o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o.strip()
        ]

        # Absolute base for the URLs in sitemap.xml. Taken from configuration
        # rather than the request's Host header on purpose: every Vercel preview
        # deployment has its own hostname, and deriving it would publish those
        # throwaway URLs to search engines. Keep in sync with the canonical link
        # in frontend/public/index.html.
        self.site_url: str = os.environ.get(
            "SITE_URL", "https://manankmehta.com"
        ).rstrip("/")

    @property
    def is_dev(self) -> bool:
        """Development is opted into, never assumed.

        This deliberately defaults to production. Two earlier attempts inferred
        the environment from platform variables (VERCEL, VERCEL_ENV, ...) and
        both failed: none of them reach Vercel's Python runtime, so the
        deployed API believed it was in development. That silently disabled the
        guard against booting with the default JWT_SECRET.

        A security control that fails open when it cannot tell where it is
        running is worse than no control, because it reads as protection. So
        the default is the safe one, and backend/.env opts local development
        back in.
        """
        return os.environ.get("APP_ENV", "production").strip().lower() in {
            "dev",
            "development",
            "local",
        }

    @property
    def docs_enabled(self) -> bool:
        """Interactive API docs. Off unless explicitly switched on."""
        return _bool("ENABLE_API_DOCS") and self.is_dev

    @property
    def cloudinary_configured(self) -> bool:
        return bool(
            self.cloudinary_cloud_name
            and self.cloudinary_api_key
            and self.cloudinary_api_secret
        )

    @property
    def smtp_configured(self) -> bool:
        return bool(self.smtp_host and self.smtp_user and self.smtp_password)

    @property
    def email_configured(self) -> bool:
        if not self.contact_notify_email:
            return False
        return self.smtp_configured or bool(self.resend_api_key)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    settings = Settings()
    if not settings.is_dev and settings.jwt_secret == "dev-only-insecure-secret":
        raise RuntimeError(
            "JWT_SECRET must be set to a strong random value outside local development."
        )
    return settings
