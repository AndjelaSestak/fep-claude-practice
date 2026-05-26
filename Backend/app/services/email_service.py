from pathlib import Path

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import NameEmail, SecretStr

from app.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=SecretStr(settings.MAIL_PASSWORD),
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    MAIL_FROM_NAME="SecureBank",
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=Path("app/templates/email"),
)


class EmailService:
    def __init__(self, mailer: FastMail) -> None:
        self.mailer = mailer

    async def send_email(
        self,
        subject: str,
        recipient: str,
        body: dict,
        template_name: str,
    ) -> None:
        test_email = "securebank.team@gmail.com"
        message = MessageSchema(
            subject=subject,
            recipients=[NameEmail("SecureBank", test_email)],
            template_body=body,
            subtype=MessageType.html,
        )
        await self.mailer.send_message(message, template_name=template_name)


email_service = EmailService(FastMail(conf))
