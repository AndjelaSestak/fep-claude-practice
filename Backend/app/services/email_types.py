from app.services.email_service import email_service


async def send_verification_email(recipient: str, name: str, otp: str) -> None:
    await email_service.send_email(
        subject="Verify your SecureBank account",
        recipient=recipient,
        body={"name": name, "otp": otp},
        template_name="verification_email.html",
    )


async def send_reset_password_email(recipient: str, name: str, reset_link: str) -> None:
    await email_service.send_email(
        subject="Reset your SecureBank password",
        recipient=recipient,
        body={"name": name, "reset_link": reset_link},
        template_name="reset_password_email.html",
    )


async def send_welcome_email(recipient: str, name: str) -> None:
    await email_service.send_email(
        subject="Welcome to SecureBank",
        recipient=recipient,
        body={"name": name},
        template_name="welcome_email.html",
    )


async def send_card_verification_email(
    recipient: str, name: str, card_last_four: str, otp: str
) -> None:
    await email_service.send_email(
        subject="Verify your new card - SecureBank",
        recipient=recipient,
        body={"name": name, "card_last_four": card_last_four, "otp": otp},
        template_name="card_verification_email.html",
    )


async def send_card_details_email(
    recipient: str,
    name: str,
    card_number: str,
    card_pin: str,
    expiry_month: int,
    expiry_year: int,
    account_number: str,
) -> None:
    await email_service.send_email(
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
    recipient: str, name: str, card_last_four: str, reason: str
) -> None:
    # Mapiramo ReportType na lepše poruke za korisnika
    reason_messages = {
        "lost": "reported as lost",
        "stolen": "reported as stolen",
        "manual_block": "manually blocked by you",
        "admin_block": "blocked by our administration for security reasons",
    }

    friendly_reason = reason_messages.get(reason, "blocked due to security policy")

    await email_service.send_email(
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
    sender: str, subject: str, sender_email: str, message: str
) -> None:
    await email_service.send_email(
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
