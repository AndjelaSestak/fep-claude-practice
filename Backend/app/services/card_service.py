import secrets
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

from app.models.card import Card, CardStatus
from app.models.card_type import CardType
from app.models.email_verification import EmailVerification, VerificationPurpose
from app.models.user import User
from app.models.wallet import Wallet
from app.schemas.card import CardCreate, CardVerify
from app.services.email_types import send_card_verification_email
from app.utils.security import get_password_hash
from app.utils.errors import CardNotFoundError, CardTypeNotFoundError, DatabaseTransactionError, InvalidOTPError, OTPExpiredError, UserNotFoundError, WalletNotFoundError
from app.utils.datetime import ensure_utc

def validate_card_details(card_data: CardCreate, db: Session):
    # Checking if card_type exists 
    card_type = db.query(CardType).filter(CardType.id == card_data.card_type_id).first()
    if not card_type:
        raise CardTypeNotFoundError("Invalid card type")

    return True

async def create_card(db: Session, current_user: User, card_data: CardCreate, background_tasks) -> Card:
    # Validating card details
    validate_card_details(card_data, db)

    # Geting user and wallet
    user = current_user
    wallet = user.wallet
    if not wallet:
        raise WalletNotFoundError("User has no wallet")

    # Masking all but the last 4 digits of the card number
    suffix = card_data.card_number[-4:]
    masked_prefix = "*" * (len(card_data.card_number) - 4)
    card_number_masked = " ".join(masked_prefix[i:i+4] for i in range(0, len(masked_prefix), 4))
    card_number_masked = f"{card_number_masked} {suffix}" if card_number_masked else suffix

    # Creating card
    new_card = Card(
        user_id=current_user.id,
        card_type_id=card_data.card_type_id,
        wallet_id=wallet.id,
        card_number_masked=card_number_masked,
        cardholder_name=card_data.cardholder_name,
        expiry_month=card_data.expiry_month,
        expiry_year=card_data.expiry_year,
        status=CardStatus.blocked,  # Blocked until verified
        is_email_verified=False,
        is_deleted=False,
        card_pin=get_password_hash(card_data.card_pin)
    )

    # Generating OTP
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

        # Schedule verification email
        background_tasks.add_task(
            send_card_verification_email,
            recipient=current_user.email,
            name=current_user.name,
            card_last_four=card_data.card_number[-4:],
            otp=otp_code
        )

        return new_card
    except SQLAlchemyError:
        db.rollback()
        raise DatabaseTransactionError("An error occurred while creating the card. Please try again.")

def verify_card(db: Session, data: CardVerify):
    card = db.query(Card).filter(
        Card.id == data.card_id,
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

    try:
        #card.status = CardStatus.active
        card.is_email_verified = True
        verification.is_used = True
        db.commit()
    except Exception:
        db.rollback()
        raise DatabaseTransactionError("An error occurred while verifying the card. Please try again.")

    return {"message": "Card successfully verified!"}

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

    try:
        card.is_deleted = True
        db.commit()
        return {"message": "Card deleted successfully"}
    except SQLAlchemyError:
        db.rollback()
        raise DatabaseTransactionError("An error occurred while deleting the card. Please try again.")
