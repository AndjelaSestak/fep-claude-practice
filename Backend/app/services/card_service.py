import secrets
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.card import Card, CardStatus
from app.models.card_type import CardType
from app.models.email_verification import EmailVerification, VerificationPurpose
from app.models.user import User
from app.models.wallet import Wallet
from app.schemas.card import CardCreate, CardVerify, CardPinVerify
from app.services.email_types import send_card_verification_email, send_card_details_email
from app.utils.security import get_password_hash, verify_password
from app.utils.errors import CardNotFoundError, CardTypeNotFoundError, DatabaseTransactionError, InvalidOTPError, InvalidPinError, OTPExpiredError, WalletNotFoundError

# Plain card values keyed by card_id, kept only until OTP verification succeeds.
# Avoids storing plain text in the DB; values are deleted immediately after the
# details email is dispatched.
_pending_card_details: dict = {}

def generate_iban(db: Session) -> str:
    """
    Structure:
        RS35  – Country code (Serbia) + fixed check digits
        908   – Internal bank/service code for Commit-Pray
        XXXXX – 13 random digits, uniqueness guaranteed against the wallets table
    """
    while True:
        sequence = "".join(secrets.choice(string.digits) for _ in range(13))
        iban = f"RS35908{sequence}"
        if not db.query(Wallet).filter(Wallet.account_number == iban).first():
            return iban


def validate_card_details(card_data: CardCreate, db: Session):
    # Checking if card_type exists 
    card_type = db.query(CardType).filter(CardType.id == card_data.card_type_id).first()
    if not card_type:
        raise CardTypeNotFoundError("Invalid card type")

    return True

async def create_card(db: Session, current_user: User, card_data: CardCreate, background_tasks) -> Card:
    validate_card_details(card_data, db)

    wallet = current_user.wallet
    if not wallet:
        raise WalletNotFoundError("User has no wallet")

    # Auto-generate a 16-digit card number; only the last 4 are stored in plain text
    raw_number = "".join(secrets.choice(string.digits) for _ in range(16))
    card_number_masked = f"**** **** **** {raw_number[-4:]}"

    # Cards are valid for 4 years from the issue month
    now = datetime.now(timezone.utc)
    expiry_month = now.month
    expiry_year = now.year + 4

    plain_pin = "".join(secrets.choice(string.digits) for _ in range(4))

    new_card = Card(
        user_id=current_user.id,
        card_type_id=card_data.card_type_id,
        wallet_id=wallet.id,
        card_number_masked=card_number_masked,
        cardholder_name=card_data.cardholder_name,
        expiry_month=expiry_month,
        expiry_year=expiry_year,
        status=CardStatus.blocked,
        is_email_verified=False,
        is_deleted=False,
        card_pin=get_password_hash(plain_pin)
    )

    otp_code = "".join(secrets.choice(string.digits) for _ in range(6))

    try:
        
        db.add(new_card)
        db.flush() 

        new_verification = EmailVerification(
            user_id=current_user.id,
            card_id=new_card.id,
            token=otp_code,
            purpose=VerificationPurpose.card_verification,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            is_used=False
        )   
        db.add(new_verification)
        db.commit()
        db.refresh(new_card)

    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while creating the card. Please try again.")

            # Keep plain values in memory until OTP verification succeeds.
            # After verification the entry is consumed and the email is dispatched.
    _pending_card_details[new_card.id] = {
                "card_number": raw_number,
                "card_pin": plain_pin,
                "expiry_month": expiry_month,
                "expiry_year": expiry_year,
                "account_number": wallet.account_number,
            }

    background_tasks.add_task(
                send_card_verification_email,
                recipient=current_user.email,
                name=current_user.name,
                card_last_four=raw_number[-4:],
                otp=otp_code
            )

    return new_card
   

def verify_card(db: Session, data: CardVerify, background_tasks, current_user: User):
    card = db.query(Card).filter(
        Card.id == data.card_id,
        #Card.user_id == current_user.id,
        Card.is_deleted == False
    ).first()
    if not card:
        raise CardNotFoundError("Card not found")

    verification = db.query(EmailVerification).filter(
        EmailVerification.card_id == data.card_id,
        EmailVerification.token == data.otp_code,
        EmailVerification.purpose == VerificationPurpose.card_verification,
        EmailVerification.is_used == False
    ).order_by(EmailVerification.expires_at.desc()).first()

    if not verification:
        raise InvalidOTPError("Invalid OTP code provided")

    if ensure_utc(verification.expires_at) < datetime.now(timezone.utc):
        raise OTPExpiredError("OTP code has expired")

    card.is_email_verified = True
    verification.is_used = True
    try:
        db.commit()
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while verifying the card. Please try again.")

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

def verify_card_pin(db: Session, data: CardPinVerify, current_user: User) -> dict:
    card = db.query(Card).filter(
        Card.id == data.card_id,
        Card.user_id == current_user.id,
        Card.is_deleted == False
    ).first()
    if not card:
        raise CardNotFoundError("Card not found")

    if not verify_password(data.pin, card.card_pin):
        raise InvalidPinError("Incorrect PIN")

    return {"message": "PIN verified"}

def get_user_cards(db: Session, current_user: User) -> list[Card]:
    return db.query(Card).filter(
        Card.user_id == current_user.id,
        Card.is_deleted == False
    ).all()

def get_card_by_id(db: Session, current_user: User, card_id: int) -> Card:
    card = db.query(Card).filter(
        Card.id == card_id,
        Card.user_id == current_user.id,
        Card.is_deleted == False
    ).first()
    if not card:
        raise CardNotFoundError("Card not found")
    return card

def soft_delete_card(db: Session, current_user: User, card_id: int):
    card = db.query(Card).filter(
        Card.id == card_id,
        Card.user_id == current_user.id,
        Card.is_deleted == False
    ).first()
    if not card:
        raise CardNotFoundError("Card not found")
    card.is_deleted = True

    try:
        db.commit()
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while deleting the card. Please try again.")
    
    return {"message": "Card deleted successfully"}
