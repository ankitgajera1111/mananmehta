"""Local development entrypoint.

Run with:  uvicorn server:app --reload --port 8001   (from the backend/ folder)

The application itself lives in app/main.py so that the same object can be
imported by api/index.py, which is what Vercel serves.
"""
from app.main import app  # noqa: F401
