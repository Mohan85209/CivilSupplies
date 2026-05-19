import smtplib
import logging
from email.message import EmailMessage
from typing import Optional

from app.config import settings
from app.models import Enquiry

logger = logging.getLogger(__name__)


def _build_enquiry_email(enquiry: Enquiry) -> EmailMessage:
    materials_str = ", ".join(enquiry.materials) if enquiry.materials else "—"
    body = f"""New enquiry received on the website.

Name        : {enquiry.name}
Phone       : {enquiry.phone}
Email       : {enquiry.email}
City        : {enquiry.city or '—'}
Project Type: {enquiry.project_type or '—'}
Materials   : {materials_str}
Quantity    : {enquiry.quantity or '—'}

Message:
{enquiry.message or '—'}

Submitted at: {enquiry.created_at.isoformat()}
Enquiry ID  : {enquiry.id}
"""
    msg = EmailMessage()
    msg["Subject"] = f"[New Enquiry #{enquiry.id}] {enquiry.name} - {enquiry.project_type or 'General'}"
    msg["From"] = settings.SMTP_FROM
    msg["To"] = settings.SMTP_TO
    msg["Reply-To"] = enquiry.email
    msg.set_content(body)
    return msg


def send_enquiry_notification(enquiry: Enquiry) -> Optional[str]:
    """Send an email to the business owner. Returns error string or None on success.

    Designed to be called from a FastAPI BackgroundTask so failures don't block the
    HTTP response. We log instead of raising.
    """
    if not all([settings.SMTP_HOST, settings.SMTP_USER, settings.SMTP_PASSWORD, settings.SMTP_FROM, settings.SMTP_TO]):
        logger.warning("SMTP not fully configured; skipping email for enquiry #%s", enquiry.id)
        return "smtp_not_configured"

    try:
        msg = _build_enquiry_email(enquiry)
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as smtp:
            smtp.starttls()
            smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            smtp.send_message(msg)
        logger.info("Sent enquiry notification email for enquiry #%s", enquiry.id)
        return None
    except Exception as e:
        logger.exception("Failed to send enquiry email for #%s: %s", enquiry.id, e)
        return str(e)
