"""Public, unauthenticated API consumed by the website."""
from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import Response

from ..config import get_settings
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
    PAGE_VISIBILITY,
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
    PageVisibility,
    PublicContent,
    SiteSettings,
)
from ..repository import get_singleton, list_documents
from ..services.email import send_contact_notification
from ..services.ratelimit import check_rate_limit, client_ip

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["public"])

# Served at the site root rather than under /api, because that is where
# crawlers and robots.txt look for it. vercel.json rewrites /sitemap.xml to
# this function; the original path reaches FastAPI unchanged, which is the same
# mechanism the /api/* rewrite relies on.
seo_router = APIRouter(tags=["seo"])


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
        pageVisibility=await get_singleton(PAGE_VISIBILITY, PageVisibility),
    )


# Home is always listed; the rest appear only while switched on. Keys match
# PageVisibility's fields, and each page's path is "/" + its key.
_SITEMAP_PRIORITIES = {
    "films": "0.9",
    "ads": "0.9",
    "about": "0.8",
    "credits": "0.8",
    "contact": "0.7",
}


@seo_router.get("/sitemap.xml", include_in_schema=False)
async def sitemap() -> Response:
    """List the pages that are actually reachable right now.

    Generated rather than shipped as a static file so hiding a page under Page
    Visibility stops advertising it to search engines. A stale sitemap is not
    merely untidy: it keeps sending crawlers, and then visitors, to a URL that
    now redirects to the home page.

    Iterating PageVisibility's own fields means a page added to that model
    cannot be silently left out of here.
    """
    base = get_settings().site_url
    visibility = await get_singleton(PAGE_VISIBILITY, PageVisibility)

    entries = [(base + "/", "1.0")]
    for key in PageVisibility.model_fields:
        if getattr(visibility, key, False):
            entries.append((f"{base}/{key}", _SITEMAP_PRIORITIES.get(key, "0.5")))

    urls = "\n".join(
        f"  <url>\n    <loc>{loc}</loc>\n    <priority>{priority}</priority>\n  </url>"
        for loc, priority in entries
    )
    body = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{urls}\n"
        "</urlset>\n"
    )
    return Response(
        content=body,
        media_type="application/xml",
        # Crawlers revisit a sitemap on their own schedule, measured in days, so
        # an hour of caching costs nothing and keeps bots off the database.
        headers={"Cache-Control": "public, max-age=3600"},
    )


# Five enquiries an hour per address. A real person sends one, maybe two if
# they mistype an email. Without this, a bot can flood the inbox and burn the
# daily email quota - which would mean genuine enquiries silently stop being
# delivered.
CONTACT_MAX_PER_HOUR = 5
CONTACT_WINDOW_SECONDS = 60 * 60


@router.post("/contact", status_code=201)
async def submit_contact(payload: ContactMessageCreate, request: Request) -> dict:
    """Store the enquiry, then notify by email.

    The database write happens first: once it succeeds the message is safe, so
    the visitor sees success even if mail delivery fails.

    The email is awaited rather than handed to BackgroundTasks because Vercel
    can freeze the function the instant the response is flushed, which would
    silently drop a queued task. Resend responds in a few hundred ms, far inside
    the 10s function budget, and send_contact_notification never raises.
    """
    ip = client_ip(request)
    allowed, retry_after = await check_rate_limit(
        f"contact:{ip}", CONTACT_MAX_PER_HOUR, CONTACT_WINDOW_SECONDS
    )
    if not allowed:
        logger.warning("Rate-limited contact submissions from %s", ip)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="You have sent several messages already. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )

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
