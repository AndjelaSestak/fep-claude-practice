from pydantic import BaseModel


class ContactMessageRequest(BaseModel):
    sender: str
    subject: str
    sender_email: str
    message: str
