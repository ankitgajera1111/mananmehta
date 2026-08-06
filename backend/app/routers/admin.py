"""Authenticated CMS API.

Every route depends on `current_admin`, applied once at router level rather than
per-endpoint so a new route cannot accidentally ship unprotected.

Path layout deliberately gives each concern its own prefix
(`/pages`, `/content`, `/messages`, `/media`). An earlier draft mounted the
generic `/{resource}` handlers at the root, where `POST /upload-signature` and
`DELETE /messages/{id}` were captured by the wildcards depending on declaration
order. Distinct prefixes make that class of bug impossible.
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Tuple, Type

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from ..config import get_settings
from ..db import AD_PROJECTS, CONTACT_MESSAGES, CREDITS, FILM_PROJECTS, get_db
from ..deps import current_admin
from ..models import (
    SINGLETON_MODELS,
    AdProject,
    Base,
    ContactMessage,
    Credit,
    FilmProject,
)
from ..repository import (
    create_document,
    delete_document,
    get_singleton,
    list_documents,
    reorder_documents,
    save_singleton,
    update_document,
)
from ..services.media import build_upload_signature, delete_asset, normalise_image

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
    dependencies=[Depends(current_admin)],
)

# Route segment -> (collection, model). Collapses three near-identical CRUD
# blocks into one generic set of handlers.
_RESOURCES: Dict[str, Tuple[str, Type[Base]]] = {
    "films": (FILM_PROJECTS, FilmProject),
    "ads": (AD_PROJECTS, AdProject),
    "credits": (CREDITS, Credit),
}


def _resource(name: str) -> Tuple[str, Type[Base]]:
    if name not in _RESOURCES:
        raise HTTPException(status_code=404, detail=f"Unknown resource '{name}'")
    return _RESOURCES[name]


def _singleton_model(key: str) -> Type[Base]:
    model = SINGLETON_MODELS.get(key)
    if model is None:
        raise HTTPException(status_code=404, detail=f"Unknown page '{key}'")
    return model


def _clean_images(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Coerce coverImage into {url, publicId} whichever form the client sent."""
    if "coverImage" in payload:
        payload["coverImage"] = normalise_image(payload["coverImage"])
    return payload


class ReorderRequest(BaseModel):
    ids: List[str]


class MessageFlagRequest(BaseModel):
    read: bool = True


# --------------------------------------------------------------------------
# Singleton pages  (/api/admin/pages/...)
# --------------------------------------------------------------------------
@router.get("/pages/{key}")
async def read_page(key: str) -> Any:
    return await get_singleton(key, _singleton_model(key))


@router.put("/pages/{key}")
async def write_page(key: str, payload: Dict[str, Any]) -> Any:
    return await save_singleton(key, _singleton_model(key), payload)


# --------------------------------------------------------------------------
# Ordered content lists  (/api/admin/content/...)
# --------------------------------------------------------------------------
@router.get("/content/{resource}")
async def read_all(resource: str) -> Any:
    collection, model = _resource(resource)
    # The admin sees drafts too, so no published filter here.
    return await list_documents(collection, model)


@router.post("/content/{resource}", status_code=status.HTTP_201_CREATED)
async def create(resource: str, payload: Dict[str, Any]) -> Any:
    collection, model = _resource(resource)
    return await create_document(collection, model, _clean_images(payload))


@router.put("/content/{resource}/reorder")
async def reorder(resource: str, payload: ReorderRequest) -> Dict[str, bool]:
    collection, _ = _resource(resource)
    await reorder_documents(collection, payload.ids)
    return {"ok": True}


@router.put("/content/{resource}/{doc_id}")
async def update(resource: str, doc_id: str, payload: Dict[str, Any]) -> Any:
    collection, model = _resource(resource)
    updated = await update_document(collection, model, doc_id, _clean_images(payload))
    if not updated:
        raise HTTPException(status_code=404, detail="Not found")
    return updated


@router.delete("/content/{resource}/{doc_id}")
async def remove(resource: str, doc_id: str) -> Dict[str, bool]:
    collection, _ = _resource(resource)
    existing = await get_db()[collection].find_one({"id": doc_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")

    deleted = await delete_document(collection, doc_id)
    # Free the Cloudinary asset, but only if we own it: a pasted URL has no
    # publicId and may well be someone else's image.
    public_id = (existing.get("coverImage") or {}).get("publicId")
    if deleted and public_id:
        await delete_asset(public_id)
    return {"ok": deleted}


# --------------------------------------------------------------------------
# Messages  (/api/admin/messages/...)
# --------------------------------------------------------------------------
@router.get("/messages")
async def list_messages(unread_only: bool = Query(default=False)) -> Dict[str, Any]:
    query: Dict[str, Any] = {"read": False} if unread_only else {}
    cursor = (
        get_db()[CONTACT_MESSAGES]
        .find(query, {"_id": 0})
        .sort("createdAt", -1)
        .limit(500)
    )
    items = [ContactMessage.model_validate(doc) async for doc in cursor]
    unread = await get_db()[CONTACT_MESSAGES].count_documents({"read": False})
    return {"items": items, "unread": unread}


@router.patch("/messages/{message_id}")
async def mark_message(
    message_id: str, payload: MessageFlagRequest
) -> Dict[str, bool]:
    result = await get_db()[CONTACT_MESSAGES].update_one(
        {"id": message_id}, {"$set": {"read": payload.read}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


@router.delete("/messages/{message_id}")
async def delete_message(message_id: str) -> Dict[str, bool]:
    result = await get_db()[CONTACT_MESSAGES].delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# --------------------------------------------------------------------------
# Media  (/api/admin/media/...)
# --------------------------------------------------------------------------
@router.post("/media/upload-signature")
async def upload_signature() -> Dict[str, object]:
    if not get_settings().cloudinary_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, "
                "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, or paste an "
                "image URL instead."
            ),
        )
    return build_upload_signature()
