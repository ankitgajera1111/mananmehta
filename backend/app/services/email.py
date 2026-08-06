"""Contact-form notification email via Resend.

Every failure path here is swallowed and logged. The visitor's message is
already stored in MongoDB by the time this runs, so a mail outage must never
turn into an error on the public contact form.
"""
from __future__ import annotations

import html
import logging

import httpx

from ..config import get_settings

logger = logging.getLogger(__name__)

_RESEND_ENDPOINT = "https://api.resend.com/emails"


def _render(name: str, email: str, project_type: str, message: str) -> str:
    e = html.escape
    return f"""
      <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 16px">New enquiry from your website</h2>
        <p><strong>Name:</strong> {e(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:{e(email)}">{e(email)}</a></p>
        <p><strong>Project type:</strong> {e(project_type) or '&mdash;'}</p>
        <p style="margin-top:20px"><strong>Message</strong></p>
        <p style="white-space:pre-wrap;background:#f6f6f6;padding:14px;
                  border-radius:8px">{e(message)}</p>
      </div>
    """.strip()


async def send_contact_notification(
    name: str, email: str, project_type: str, message: str
) -> bool:
    settings = get_settings()
    if not settings.email_configured:
        logger.info("Email not configured; skipping notification for %s", email)
        return False

    payload = {
        "from": settings.mail_from,
        "to": [settings.contact_notify_email],
        # Lets the client hit Reply and reach the visitor directly.
        "reply_to": email,
        "subject": f"New enquiry from {name}",
        "html": _render(name, email, project_type, message),
    }
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                _RESEND_ENDPOINT,
                json=payload,
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            )
        if resp.status_code >= 400:
            logger.error("Resend rejected the email: %s %s", resp.status_code, resp.text)
            return False
        return True
    except Exception:  # noqa: BLE001 - notification must never break the form
        logger.exception("Failed to send contact notification")
        return False
