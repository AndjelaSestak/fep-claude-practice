from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    MAIL_FROM_NAME="SecureBank",
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER="app/templates/email",
)

fastmail = FastMail(conf)

async def send_email(subject: str, recipient: str, body: dict, template_name: str):
    message = MessageSchema(
        subject=subject,
        recipients=[recipient],
        template_body=body,
        subtype=MessageType.html,
    )
    await fastmail.send_message(message, template_name=template_name)