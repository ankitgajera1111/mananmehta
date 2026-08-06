"""Vercel serverless entrypoint.

Vercel auto-detects files under `api/` as functions. Exposing the ASGI `app`
here means the whole FastAPI application is served by a *single* function, which
matters on the Hobby plan: it allows at most 12 functions per deployment, and a
per-route layout would burn through that.

`vercel.json` rewrites every `/api/*` request to this module, so FastAPI's own
routing (which already includes the `/api` prefix) handles dispatch.
"""
import sys
from pathlib import Path

# The application package lives in backend/, which is not on sys.path when
# Vercel imports this module from the repository root.
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app  # noqa: E402

__all__ = ["app"]
