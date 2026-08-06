"""Public, unauthenticated API consumed by the website."""
from __future__ import annotations

import logging

from fastapi import APIRouter

from ..db import (
    ABOUT_PAGE,
    AD_PROJECTS,
    ADS_PAGE,
    CONTACT_MESSAGES,
    CONTACT_PAGE,
    CREDITS,
    CREDITS_PAGE,
    FILM_PROJECTS,
    FILMS_PAGE,
    HOME_PAGE,
    SITE_SETTINGS,
    get_db,
)
from ..models import (
    AboutPage,
    AdProject,
    ContactMessage,
    ContactMessageCreate,
    ContactPage,
    Credit,
    FilmProject,
    HomePage,
    ListingPage,
    PublicContent,
    SiteSettings,
)
from ..repository import get_singleton, list_documents
from ..services.email import send_contact_notification

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["public"])


@router.get("/content", response_model=PublicContent)
async def get_content() -> PublicContent:
    """The entire public payload in one request.

    A portfolio's content is a few KB, so one round trip beats seven - and on
    Vercel it means a visitor pays for at most one Python cold start.
    """
    return PublicContent(
        settings=await get_singleton(SITE_SETTINGS, SiteSettings),
        home=await get_singleton(HOME_PAGE, HomePage),
        about=await get_singleton(ABOUT_PAGE, AboutPage),
        contact=await get_singleton(CONTACT_PAGE, ContactPage),
        filmsPage=await get_singleton(FILMS_PAGE, ListingPage),
        adsPage=await get_singleton(ADS_PAGE, ListingPage),
        creditsPage=await get_singleton(CREDITS_PAGE, ListingPage),
        films=await list_documents(FILM_PROJECTS, FilmProject, published_only=True),
        ads=await list_documents(AD_PROJECTS, AdProject, published_only=True),
        credits=await list_documents(CREDITS, Credit, published_only=True),
    )


@router.post("/contact", status_code=201)
async def submit_contact(payload: ContactMessageCreate) -> dict:
    """Store the enquiry, then notify by email.

    The database write happens first: once it succeeds the message is safe, so
    the visitor sees success even if mail delivery fails.

    The email is awaited rather than handed to BackgroundTasks because Vercel
    can freeze the function the instant the response is flushed, which would
    silently drop a queued task. Resend responds in a few hundred ms, far inside
    the 10s function budget, and send_contact_notification never raises.
    """
    message = ContactMessage(
        name=payload.name.strip(),
        email=str(payload.email).lower().strip(),
        projectType=payload.projectType.strip(),
        message=payload.message.strip(),
    )
    await get_db()[CONTACT_MESSAGES].insert_one(message.model_dump(mode="json"))

    emailed = await send_contact_notification(
        message.name, message.email, message.projectType, message.message
    )
    if not emailed:
        logger.warning("Stored message %s but no notification was sent", message.id)
    return {"ok": True, "id": message.id}
