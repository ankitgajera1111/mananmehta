"""Pydantic schemas for content, auth and messages.

Design notes
------------
* Every image is an ``ImageRef``. ``publicId`` is set only when the file was
  uploaded to Cloudinary; a pasted URL leaves it ``None``. That is what lets the
  admin panel offer upload *and* URL in the same field, and keeps the existing
  YouTube/IMDb thumbnail URLs working untouched.
* Decorative two-tone headings are stored as ``heading`` + ``accentWord`` (the
  word rendered in amber), or as two stacked lines where the second is amber.
  The client edits plain text; the styling stays in the JSX where it belongs.
* Every field carries a default so a partially-filled document still renders.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Dict, List, Literal, Optional, Type

from pydantic import BaseModel, ConfigDict, EmailStr, Field


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Base(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)


# --------------------------------------------------------------------------
# Shared value objects
# --------------------------------------------------------------------------
class ImageRef(Base):
    url: str = ""
    publicId: Optional[str] = None


class Track(Base):
    title: str = ""
    # Films use either a SoundCloud iframe embed URL or a plain track URL.
    embedUrl: Optional[str] = None
    url: Optional[str] = None


class OriginalSong(Base):
    title: str = ""
    youtubeId: str = ""


class NamedBlurb(Base):
    """Skills and the home-page service cards share this shape."""

    title: str = ""
    description: str = ""


class ProcessStep(Base):
    step: str = ""
    title: str = ""
    description: str = ""


class FaqItem(Base):
    q: str = ""
    a: str = ""


class SelectOption(Base):
    value: str = ""
    label: str = ""


class FeaturedItem(Base):
    """One slide in the home hero rotation."""

    kind: Literal["film", "ad"] = "film"
    projectId: str = ""


# --------------------------------------------------------------------------
# Content lists
# --------------------------------------------------------------------------
class FilmProject(Base):
    id: str = Field(default_factory=_uuid)
    title: str = ""
    type: str = ""          # Feature Film / Documentary / Short Film ...
    year: Optional[int] = None
    director: str = ""
    genre: str = ""
    role: str = ""
    description: str = ""
    coverImage: ImageRef = Field(default_factory=ImageRef)
    soundcloudPlaylist: Optional[str] = None
    soundcloudEmbed: Optional[str] = None
    originalSong: Optional[OriginalSong] = None
    tracks: List[Track] = Field(default_factory=list)
    order: int = 0
    published: bool = True


class AdProject(Base):
    id: str = Field(default_factory=_uuid)
    title: str = ""
    brand: str = ""
    type: str = ""          # TVC / Brand Film / Product Film ...
    year: Optional[int] = None
    description: str = ""
    coverImage: ImageRef = Field(default_factory=ImageRef)
    youtubeId: str = ""
    duration: str = ""
    audioUrl: Optional[str] = None
    order: int = 0
    published: bool = True


class Credit(Base):
    id: str = Field(default_factory=_uuid)
    year: Optional[int] = None
    title: str = ""
    role: str = ""
    type: str = ""
    director: str = ""
    order: int = 0
    published: bool = True


# --------------------------------------------------------------------------
# Singleton page documents
# --------------------------------------------------------------------------
class SiteSettings(Base):
    name: str = "Manan Mehta"
    title: str = "Film & TV Composer"
    tagline: str = ""
    shortBio: str = ""
    email: str = ""
    instagram: str = ""
    instagramUrl: str = ""
    spotify: str = ""
    imdb: str = ""
    location: str = ""
    # Used for <title>/<meta description>; see index.html.
    seoTitle: str = ""
    seoDescription: str = ""


class HomePage(Base):
    heroKicker: str = "Film & Television Composer"
    heroTagline: str = ""
    heroPrimaryCta: str = "Explore Work"
    heroSecondaryCta: str = "Get in Touch"
    # Hero rotation, admin-selected. Empty list falls back to published films.
    featuredWork: List[FeaturedItem] = Field(default_factory=list)
    rotationMs: int = 5000

    introHeadingLine1: str = "CRAFTING SONIC"
    introHeadingLine2: str = "LANDSCAPES"
    introBody: str = ""
    introCtaLabel: str = "Learn More About Me"
    services: List[NamedBlurb] = Field(default_factory=list)

    filmsKicker: str = "Featured Work"
    filmsHeading: str = "FILM SCORES"
    adsKicker: str = "Commercial Work"
    adsHeading: str = "ADVERTISING"

    ctaKicker: str = "Let's Create Together"
    ctaHeadingLine1: str = "HAVE A PROJECT"
    ctaHeadingLine2: str = "IN MIND?"
    ctaBody: str = ""
    ctaButtonLabel: str = "Start a Conversation"


class AboutPage(Base):
    kicker: str = "About the Composer"
    fullBio: str = ""
    achievements: List[str] = Field(default_factory=list)
    skillsKicker: str = "Expertise"
    skillsHeading: str = "SKILLS & SERVICES"
    skills: List[NamedBlurb] = Field(default_factory=list)
    processKicker: str = "How I Work"
    processHeading: str = "THE PROCESS"
    process: List[ProcessStep] = Field(default_factory=list)
    ctaHeadingLine1: str = "LET'S CREATE"
    ctaHeadingLine2: str = "SOMETHING AMAZING"
    ctaBody: str = ""
    ctaButtonLabel: str = "Start a Conversation"


class ContactPage(Base):
    kicker: str = "Get in Touch"
    heading: str = "LET'S TALK"
    accentWord: str = "TALK"
    intro: str = ""
    projectTypeOptions: List[SelectOption] = Field(default_factory=list)
    successHeading: str = "Message Sent!"
    successBody: str = ""
    faqKicker: str = "Common Questions"
    faqHeading: str = "FAQ"
    faqs: List[FaqItem] = Field(default_factory=list)


class ListingPage(Base):
    """Header copy for the Films, Ads and Credits index pages."""

    kicker: str = ""
    heading: str = ""
    accentWord: str = ""
    intro: str = ""


class PageVisibility(Base):
    """Which public pages the client has switched on.

    Every field defaults to True, and ``get_singleton`` falls back to these
    defaults when the document is missing, so an existing database keeps showing
    the whole site until someone deliberately hides a page.

    Home is absent on purpose: it is the root route and the fallback a hidden
    page redirects to, so hiding it would leave the site with nowhere to land.
    """

    films: bool = True
    ads: bool = True
    about: bool = True
    credits: bool = True
    contact: bool = True


# --------------------------------------------------------------------------
# Messages
# --------------------------------------------------------------------------
class ContactMessageCreate(Base):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    projectType: str = Field(default="", max_length=100)
    message: str = Field(min_length=1, max_length=5000)


class ContactMessage(Base):
    id: str = Field(default_factory=_uuid)
    name: str
    email: str
    projectType: str = ""
    message: str
    createdAt: datetime = Field(default_factory=_now)
    read: bool = False


# --------------------------------------------------------------------------
# Auth
# --------------------------------------------------------------------------
class LoginRequest(Base):
    email: EmailStr
    password: str = Field(min_length=1)


class AdminUser(Base):
    id: str = Field(default_factory=_uuid)
    email: str
    createdAt: datetime = Field(default_factory=_now)


class ChangePasswordRequest(Base):
    currentPassword: str = Field(min_length=1)
    newPassword: str = Field(min_length=8, max_length=200)


# --------------------------------------------------------------------------
# Aggregate public payload
# --------------------------------------------------------------------------
class PublicContent(Base):
    settings: SiteSettings
    home: HomePage
    about: AboutPage
    contact: ContactPage
    filmsPage: ListingPage
    adsPage: ListingPage
    creditsPage: ListingPage
    films: List[FilmProject]
    ads: List[AdProject]
    credits: List[Credit]
    # Defaulted so a payload built without it still validates to "show everything".
    pageVisibility: PageVisibility = Field(default_factory=PageVisibility)


# Maps a singleton document key to its model, so the admin router stays generic
# instead of repeating a near-identical GET/PUT pair seven times.
SINGLETON_MODELS: Dict[str, Type[Base]] = {
    "site_settings": SiteSettings,
    "home_page": HomePage,
    "about_page": AboutPage,
    "contact_page": ContactPage,
    "films_page": ListingPage,
    "ads_page": ListingPage,
    "credits_page": ListingPage,
    "page_visibility": PageVisibility,
}
