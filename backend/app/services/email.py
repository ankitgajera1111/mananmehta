"""Contact-form notification email.

Two delivery routes:

* **SMTP** (e.g. Gmail) - used when SMTP_HOST/USER/PASSWORD are set.
* **Resend** - an HTTP API, used otherwise.

SMTP is the riskier of the two on Vercel. Vercel blocks outbound port 25 and
advises against SMTP generally; community reports describe connections hanging
until the function times out. Hence the short, explicit timeout and the thread
offload below - a stalled mail server must never hold up the visitor's response.

Every failure path is swallowed and logged. The message is already stored in
MongoDB before this runs, so a mail outage must never surface as an error on the
public contact form.
"""
from __future__ import annotations

import asyncio
import html
import logging
import smtplib
import ssl
from email.message import EmailMessage

import httpx

from ..config import get_settings

logger = logging.getLogger(__name__)

_RESEND_ENDPOINT = "https://api.resend.com/emails"


def _render_html(name: str, email: str, project_type: str, message: str) -> str:
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


def _render_text(name: str, email: str, project_type: str, message: str) -> str:
    return (
        f"New enquiry from your website\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Project type: {project_type or '-'}\n\n"
        f"Message:\n{message}\n"
    )


def _send_smtp_blocking(subject: str, reply_to: str, text: str, body_html: str) -> None:
    """Synchronous SMTP send. Always called via a worker thread."""
    settings = get_settings()

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.mail_from or settings.smtp_user
    msg["To"] = settings.contact_notify_email
    # Lets the recipient hit Reply and reach the visitor directly.
    msg["Reply-To"] = reply_to
    msg.set_content(text)
    msg.add_alternative(body_html, subtype="html")

    context = ssl.create_default_context()
    if settings.smtp_port == 465:
        with smtplib.SMTP_SSL(
            settings.smtp_host,
            settings.smtp_port,
            timeout=settings.smtp_timeout,
            context=context,
        ) as server:
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(
            settings.smtp_host, settings.smtp_port, timeout=settings.smtp_timeout
        ) as server:
            server.starttls(context=context)
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)


async def _send_via_smtp(subject: str, reply_to: str, text: str, body_html: str) -> bool:
    settings = get_settings()
    try:
        # smtplib is blocking, so it runs off the event loop. The outer
        # wait_for is a hard stop: socket timeouts alone do not always fire
        # when a sandbox silently drops the connection.
        await asyncio.wait_for(
            asyncio.to_thread(_send_smtp_blocking, subject, reply_to, text, body_html),
            timeout=settings.smtp_timeout + 1,
        )
        return True
    except asyncio.TimeoutError:
        logger.error(
            "SMTP to %s:%s timed out after %ss. Serverless platforms often "
            "block outbound SMTP - consider an HTTP email API instead.",
            settings.smtp_host,
            settings.smtp_port,
            settings.smtp_timeout,
        )
        return False
    except smtplib.SMTPAuthenticationError:
        logger.error(
            "SMTP authentication failed for %s. For Gmail this must be a "
            "16-character App Password, not the account password.",
            settings.smtp_user,
        )
        return False
    except Exception:  # noqa: BLE001 - notification must never break the form
        logger.exception("SMTP send failed")
        return False


async def _send_via_resend(
    subject: str, reply_to: str, body_html: str
) -> bool:
    settings = get_settings()
    payload = {
        "from": settings.mail_from,
        "to": [settings.contact_notify_email],
        "reply_to": reply_to,
        "subject": subject,
        "html": body_html,
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
    except Exception:  # noqa: BLE001
        logger.exception("Failed to send contact notification via Resend")
        return False


async def send_contact_notification(
    name: str, email: str, project_type: str, message: str
) -> bool:
    settings = get_settings()
    if not settings.email_configured:
        logger.info("Email not configured; skipping notification for %s", email)
        return False

    subject = f"New enquiry from {name}"
    body_html = _render_html(name, email, project_type, message)
    text = _render_text(name, email, project_type, message)

    if settings.smtp_configured:
        if await _send_via_smtp(subject, email, text, body_html):
            return True
        # Fall through: if both are configured, a blocked SMTP port should not
        # cost the client the notification.
        if settings.resend_api_key:
            logger.info("SMTP failed; retrying via Resend")
            return await _send_via_resend(subject, email, body_html)
        return False

    return await _send_via_resend(subject, email, body_html)
