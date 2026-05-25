import secrets
import string
from datetime import datetime, timedelta, timezone

from fastapi import BackgroundTasks
from sqlalchemy.orm import Session

from app.models.card import Card, CardStatus
from app.models.email_verification import EmailVerification, VerificationPurpose
from app.models.user import User
from app.models.wallet import Wallet
from app.repositories.card_repository import CardRepository
from app.repositories.wallet_repository import WalletRepository
from app.schemas.card import CardCreate, CardPinVerify, CardVerify
from app.services.email_types import (
    send_card_details_email,
    send_card_verification_email,
)
from app.utils.datetime import ensure_utc
from app.utils.errors import (
    InvalidOTPError,
    InvalidPinError,
    OTPExpiredError,
    WalletNotFoundError,
)
from app.utils.security import get_password_hash, verify_password

# Plain card values keyed by card_id, kept only until OTP verification succeeds.
# Avoids storing plain text in the DB; values are deleted immediately after the
# details email is dispatched.
_pending_card_details: dict = {}


def generate_account_number(db: Session) -> str:
    while True:
        account_number = "".join(secrets.choice(string.digits) for _ in range(16))
        if not db.query(Wallet).filter(Wallet.account_number == account_number).first():
            return account_number


class CardService:
    def __init__(
        self,
        card_repository: CardRepository,
        wallet_repository: WalletRepository,
    ) -> None:
        self.card_repository = card_repository
        self.wallet_repository = wallet_repository

    async def create_card(
        self,
        current_user: User,
        card_data: CardCreate,
        background_tasks: BackgroundTasks,
    ) -> Card:
        await self.card_repository.get_card_type_by_id(card_data.card_type_id)

        wallet = await self.wallet_repository.get_wallet_by_user_id(current_user.id)
        if wallet is None:
            raise WalletNotFoundError("Active wallet not found for the user.")

        raw_number = "".join(secrets.choice(string.digits) for _ in range(16))
        card_number_masked = f"**** **** **** {raw_number[-4:]}"

        now = datetime.now(timezone.utc)
        plain_pin = "".join(secrets.choice(string.digits) for _ in range(4))

        new_card = Card(
            user_id=current_user.id,
            card_type_id=card_data.card_type_id,
            wallet_id=wallet.id,
            card_number_masked=card_number_masked,
            cardholder_name=card_data.cardholder_name,
            expiry_month=now.month,
            expiry_year=now.year + 4,
            status=CardStatus.blocked,
            is_email_verified=False,
            is_deleted=False,
            card_pin=get_password_hash(plain_pin),
        )

        otp_code = "".join(secrets.choice(string.digits) for _ in range(6))

        self.card_repository.add(new_card)
        await self.card_repository.flush()

        new_verification = EmailVerification(
            user_id=current_user.id,
            card_id=new_card.id,
            token=otp_code,
            purpose=VerificationPurpose.card_verification,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            is_used=False,
        )
        self.card_repository.add(new_verification)

        _pending_card_details[new_card.id] = {
            "card_number": raw_number,
            "card_pin": plain_pin,
            "expiry_month": now.month,
            "expiry_year": now.year + 4,
            "account_number": wallet.account_number,
        }

        background_tasks.add_task(
            send_card_verification_email,
            recipient=current_user.email,
            name=current_user.name,
            card_last_four=raw_number[-4:],
            otp=otp_code,
        )

        return await self.card_repository.get_by_id_and_user(
            new_card.id, current_user.id
        )

    async def verify_card(
        self,
        data: CardVerify,
        background_tasks: BackgroundTasks,
        current_user: User,
    ) -> dict:
        card = await self.card_repository.get_by_id_and_user(
            data.card_id, current_user.id
        )

        verification = await self.card_repository.get_card_verification(
            data.card_id, data.otp_code
        )
        if not verification:
            raise InvalidOTPError("Invalid OTP code provided")

        if ensure_utc(verification.expires_at) < datetime.now(timezone.utc):
            raise OTPExpiredError("OTP code has expired")

        card.is_email_verified = True
        verification.is_used = True

        details = _pending_card_details.pop(card.id, None)
        if details:
            background_tasks.add_task(
                send_card_details_email,
                recipient=current_user.email,
                name=current_user.name,
                card_number=details["card_number"],
                card_pin=details["card_pin"],
                expiry_month=details["expiry_month"],
                expiry_year=details["expiry_year"],
                account_number=details["account_number"],
            )

        return {"message": "Card successfully verified!"}

    async def verify_card_pin(self, data: CardPinVerify, current_user: User) -> dict:
        card = await self.card_repository.get_by_id_and_user(
            data.card_id, current_user.id
        )

        if not verify_password(data.pin, card.card_pin):
            raise InvalidPinError("Incorrect PIN")

        return {"message": "PIN verified"}

    async def get_user_cards(self, current_user: User) -> list[Card]:
        return await self.card_repository.get_all_by_user(current_user.id)

    async def get_card_by_id(self, current_user: User, card_id: int) -> Card:
        return await self.card_repository.get_by_id_and_user(card_id, current_user.id)

    async def soft_delete_card(self, current_user: User, card_id: int) -> dict:
        card = await self.card_repository.get_by_id_and_user(card_id, current_user.id)
        await self.card_repository.delete(card)
        return {"message": "Card deleted successfully"}
