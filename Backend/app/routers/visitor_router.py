from fastapi import APIRouter, Depends, Response
from app.services.email_types import send_message_from_contact_us
from app.schemas.visitor import ContactMessageRequest


router = APIRouter(prefix="/visitors", tags=["Visitors"])

@router.post("/send-message")
async def send_message_from_contact_us_page(
    message_data: ContactMessageRequest
):
    await send_message_from_contact_us(
        message_data.sender,
        message_data.subject,
        message_data.sender_email,
        message_data.message
    )
    return {"detail": "Message sent successfully."}