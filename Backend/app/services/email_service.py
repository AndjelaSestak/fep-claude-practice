from pathlib import Path

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import NameEmail, SecretStr

from app.config import settings

_TEST_EMAIL = "securebank.team@gmail.com"

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
        message = MessageSchema(
            subject=subject,
            recipients=[NameEmail("SecureBank", _TEST_EMAIL)],
            template_body=body,
            subtype=MessageType.html,
        )
        await self.mailer.send_message(message, template_name=template_name)

    async def send_verification_email(
        self, recipient: str, name: str, otp: str
    ) -> None:
        await self.send_email(
            subject="Verify your SecureBank account",
            recipient=recipient,
            body={"name": name, "otp": otp},
            template_name="verification_email.html",
        )

    async def send_reset_password_email(
        self, recipient: str, name: str, reset_link: str
    ) -> None:
        await self.send_email(
            subject="Reset your SecureBank password",
            recipient=recipient,
            body={"name": name, "reset_link": reset_link},
            template_name="reset_password_email.html",
        )

    async def send_welcome_email(self, recipient: str, name: str) -> None:
        await self.send_email(
            subject="Welcome to SecureBank",
            recipient=recipient,
            body={"name": name},
            template_name="welcome_email.html",
        )

    async def send_card_verification_email(
        self, recipient: str, name: str, card_last_four: str, otp: str
    ) -> None:
        await self.send_email(
            subject="Verify your new card - SecureBank",
            recipient=recipient,
            body={"name": name, "card_last_four": card_last_four, "otp": otp},
            template_name="card_verification_email.html",
        )

    async def send_card_details_email(
        self,
        recipient: str,
        name: str,
        card_number: str,
        card_pin: str,
        expiry_month: int,
        expiry_year: int,
        account_number: str,
    ) -> None:
        await self.send_email(
            subject="Your new SecureBank card details",
            recipient=recipient,
            body={
                "name": name,
                "card_number": card_number,
                "card_pin": card_pin,
                "expiry": f"{expiry_month:02d}/{expiry_year}",
                "account_number": account_number,
            },
            template_name="card_details_email.html",
        )

    async def send_card_block_notification(
        self, recipient: str, name: str, card_last_four: str, reason: str
    ) -> None:
        reason_messages = {
            "lost": "reported as lost",
            "stolen": "reported as stolen",
            "manual_block": "manually blocked by you",
            "admin_block": "blocked by our administration for security reasons",
        }
        friendly_reason = reason_messages.get(reason, "blocked due to security policy")

        await self.send_email(
            subject="IMPORTANT: Your card has been blocked - SecureBank",
            recipient=recipient,
            body={
                "name": name,
                "card_last_four": card_last_four,
                "reason": friendly_reason,
            },
            template_name="card_block_email.html",
        )

    async def send_message_from_contact_us(
        self, sender: str, subject: str, sender_email: str, message: str
    ) -> None:
        await self.send_email(
            subject="Message from visitor on Contact Us page",
            recipient="support@securebank.com",
            body={
                "sender": sender,
                "subject": subject,
                "sender_email": sender_email,
                "message": message,
            },
            template_name="message_from_visitor.html",
        )


email_service = EmailService(FastMail(conf))
