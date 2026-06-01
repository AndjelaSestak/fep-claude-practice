from fastapi import APIRouter

from app.schemas.visitor import ContactMessageRequest
from app.services.email_service import email_service

router = APIRouter(prefix="/visitors", tags=["Visitors"])


@router.post("/send_message")
async def send_message_from_contact_us_page(message_data: ContactMessageRequest):
    await email_service.send_message_from_contact_us(
        message_data.sender,
        message_data.subject,
        message_data.sender_email,
        message_data.message,
    )
    return {"detail": "Message sent successfully."}
