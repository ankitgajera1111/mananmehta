"""Thin data-access helpers shared by the public and admin routers."""
from __future__ import annotations

from typing import Any, Dict, List, Optional, Type

from .db import PAGE_CONTENT, get_db
from .models import Base


async def get_singleton(key: str, model: Type[Base]) -> Base:
    """Load a page document, falling back to the model's defaults.

    A missing document is normal (fresh database, or a page the client has never
    opened), so it must render rather than 404. Validating through the model
    also back-fills fields added by a later schema change.
    """
    doc = await get_db()[PAGE_CONTENT].find_one({"_id": key})
    if not doc:
        return model()
    doc.pop("_id", None)
    return model.model_validate(doc)


async def save_singleton(key: str, model: Type[Base], payload: Dict[str, Any]) -> Base:
    """Merge `payload` over the stored document.

    Merging rather than replacing means a partial PUT cannot silently blank out
    fields it did not mention. Clearing a value still works - send it explicitly
    as "" - but forgetting a field is no longer destructive. The admin panel
    submits whole forms, so in practice this only ever guards against mistakes.
    """
    existing = await get_db()[PAGE_CONTENT].find_one({"_id": key}) or {}
    existing.pop("_id", None)
    validated = model.model_validate({**existing, **payload})
    await get_db()[PAGE_CONTENT].update_one(
        {"_id": key},
        {"$set": validated.model_dump(mode="json")},
        upsert=True,
    )
    return validated


async def list_documents(
    collection: str,
    model: Type[Base],
    *,
    published_only: bool = False,
) -> List[Base]:
    query: Dict[str, Any] = {"published": True} if published_only else {}
    cursor = get_db()[collection].find(query, {"_id": 0}).sort("order", 1)
    return [model.model_validate(doc) async for doc in cursor]


async def get_document(
    collection: str, model: Type[Base], doc_id: str
) -> Optional[Base]:
    doc = await get_db()[collection].find_one({"id": doc_id}, {"_id": 0})
    return model.model_validate(doc) if doc else None


async def create_document(
    collection: str, model: Type[Base], payload: Dict[str, Any]
) -> Base:
    validated = model.model_validate(payload)
    data = validated.model_dump(mode="json")
    # New items go to the end of the list unless the caller set an order.
    if not payload.get("order"):
        last = await get_db()[collection].find_one({}, sort=[("order", -1)])
        data["order"] = (last.get("order", 0) + 1) if last else 0
        validated = model.model_validate(data)
    await get_db()[collection].insert_one(dict(data))
    return validated


async def update_document(
    collection: str, model: Type[Base], doc_id: str, payload: Dict[str, Any]
) -> Optional[Base]:
    existing = await get_db()[collection].find_one({"id": doc_id}, {"_id": 0})
    if not existing:
        return None
    # Merge so a partial payload cannot silently blank out untouched fields.
    merged = {**existing, **payload, "id": doc_id}
    validated = model.model_validate(merged)
    await get_db()[collection].update_one(
        {"id": doc_id}, {"$set": validated.model_dump(mode="json")}
    )
    return validated


async def delete_document(collection: str, doc_id: str) -> bool:
    result = await get_db()[collection].delete_one({"id": doc_id})
    return result.deleted_count > 0


async def reorder_documents(collection: str, ordered_ids: List[str]) -> None:
    db = get_db()
    for index, doc_id in enumerate(ordered_ids):
        await db[collection].update_one({"id": doc_id}, {"$set": {"order": index}})
