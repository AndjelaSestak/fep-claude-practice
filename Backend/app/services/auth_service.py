import secrets
import string
from datetime import datetime, timedelta, timezone

from fastapi import BackgroundTasks
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import settings
from app.models.email_verification import EmailVerification, VerificationPurpose
from app.models.refresh_token import RefreshToken
from app.models.role import Role
from app.models.user import User
from app.models.wallet import Wallet
from app.schemas.auth import ResetPasswordRequest, VerifyOTP
from app.schemas.user import UserCreate
from app.services.card_service import generate_account_number
from app.services.email_types import (
    send_reset_password_email,
    send_verification_email,
    send_welcome_email,
)
from app.utils.datetime import ensure_utc
from app.utils.errors import (
    DatabaseTransactionError,
    EmailAlreadyRegisteredError,
    InvalidOTPError,
    InvalidTokenError,
    OTPExpiredError,
    RoleNotFoundError,
    UserNotFoundError,
)
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)


def register_user(
    db: Session, user_data: UserCreate, background_tasks: BackgroundTasks
) -> User:
    existing_user = (
        db.query(User).filter(func.lower(User.email) == user_data.email.lower()).first()
    )

    if existing_user:
        raise EmailAlreadyRegisteredError("Email is already registered")

    default_role = db.query(Role).filter(Role.name == "user").first()
    if not default_role:
        raise RoleNotFoundError(
            "Critical error: Default 'user' role is missing from the database."
        )
    role_id = default_role.id

    new_user = User(
        name=user_data.name,
        email=user_data.email.lower(),
        password_hash=get_password_hash(user_data.password),
        city=user_data.city,
        address=user_data.address,
        date_of_birth=user_data.date_of_birth,
        role_id=role_id,
    )

    try:
        db.add(new_user)
        db.flush()

        otp_code = "".join(secrets.choice(string.digits) for _ in range(6))

        new_verification = EmailVerification(
            user_id=new_user.id,
            token=otp_code,
            purpose=VerificationPurpose.registration,
            expires_at=datetime.now(timezone.utc)
            + timedelta(minutes=10),  # Ističe za 10 min
            is_used=False,
        )
        db.add(new_verification)

        new_wallet = Wallet(
            user_id=new_user.id,
            balance=0,
            account_number=generate_account_number(db),
            currency="RSD",
        )
        db.add(new_wallet)

        db.commit()

        db.refresh(new_user)

        background_tasks.add_task(
            send_verification_email,
            recipient=new_user.email,
            name=new_user.name,
            otp=otp_code,
        )

        return new_user

    except SQLAlchemyError:
        raise DatabaseTransactionError(
            "An error occurred while creating the account. Please try again."
        )


def verify_user_email(db: Session, data: VerifyOTP, background_tasks: BackgroundTasks):

    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user:
        raise UserNotFoundError("No user found with the provided email address")

    verification = (
        db.query(EmailVerification)
        .filter(
            EmailVerification.user_id == user.id,
            EmailVerification.token == data.otp_code,
            EmailVerification.purpose == VerificationPurpose.registration,
            EmailVerification.is_used == False,
        )
        .order_by(EmailVerification.expires_at.desc())
        .first()
    )

    if not verification:
        raise InvalidOTPError("Invalid OTP code provided")

    if ensure_utc(verification.expires_at) < datetime.now(timezone.utc):
        raise OTPExpiredError("OTP code has expired")

    user.is_email_verified = True
    verification.is_used = True

    try:
        db.commit()

    except Exception:
        raise DatabaseTransactionError(
            "An error occurred while creating the account. Please try again."
        )

    background_tasks.add_task(send_welcome_email, recipient=data.email, name=user.name)

    return {"message": "Email successfully verified!"}


def resend_verification_email(
    db: Session, email: str, background_tasks: BackgroundTasks
):
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user:
        raise UserNotFoundError("No user found with the provided email address")
    if user.is_email_verified:
        return {"message": "Email is already verified"}

    # Ukoliko neko klikne 10 puta resend otp token onda ce biti 10 aktivnih otp-ova,
    # pa na ovaj nacin invalidiram sve prethpdne i pravim novi
    db.query(EmailVerification).filter(
        EmailVerification.user_id == user.id,
        EmailVerification.purpose == VerificationPurpose.registration,
        EmailVerification.is_used == False,
    ).update({"is_used": True})

    otp_code = "".join(secrets.choice(string.digits) for _ in range(6))

    new_verification = EmailVerification(
        user_id=user.id,
        token=otp_code,
        purpose=VerificationPurpose.registration,
        expires_at=datetime.now(timezone.utc)
        + timedelta(minutes=10),  # Istice za 10 min
        is_used=False,
    )
    try:
        db.add(new_verification)
        db.commit()
    except SQLAlchemyError:
        raise DatabaseTransactionError(
            "An error occurred while resending the verification email."
            " Please try again."
        )

    background_tasks.add_task(
        send_verification_email, recipient=user.email, name=user.name, otp=otp_code
    )

    return {"message": "A new verification email has been sent."}


def login_user(db: Session, email: str, password: str) -> dict:
    user = (
        db.query(User)
        .filter(User.email == email.lower(), User.is_deleted == False)
        .first()
    )

    if not user or not verify_password(password, user.password_hash):
        raise UserNotFoundError("Invalid email or password")
    if not user.is_email_verified:
        raise UserNotFoundError("Email address has not been verified")

    jti = secrets.token_hex(32)
    access_token = create_access_token({"sub": str(user.id), "role": user.role.name})
    refresh_token = create_refresh_token({"sub": str(user.id), "jti": jti})

    db_token = RefreshToken(
        user_id=user.id,
        token=get_password_hash(refresh_token),
        jti=jti,
        expires_at=datetime.now(timezone.utc)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    try:
        db.add(db_token)
        db.commit()
    except SQLAlchemyError:
        raise DatabaseTransactionError(
            "An error occurred while logging in. Please try again."
        )

    return {"access_token": access_token, "refresh_token": refresh_token}


def forgot_password(db: Session, email: str, background_tasks: BackgroundTasks):
    user = (
        db.query(User)
        .filter(User.email == email.lower(), User.is_deleted == False)
        .first()
    )
    if not user:
        return {
            "message": "If an account with that email exists,"
            " a password reset link has been sent."
        }

    reset_token = secrets.token_urlsafe(32)

    new_verification = EmailVerification(
        user_id=user.id,
        token=reset_token,
        purpose=VerificationPurpose.password_reset,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=30),
        is_used=False,
    )
    try:
        db.add(new_verification)
        db.commit()
    except SQLAlchemyError:
        raise DatabaseTransactionError(
            "An error occurred while sending the password reset email."
            " Please try again."
        )

    reset_link = f"http://localhost:5173/reset_password?token={reset_token}"

    background_tasks.add_task(
        send_reset_password_email,
        recipient=user.email,
        name=user.name,
        reset_link=reset_link,
    )

    return {
        "message": "If an account with that email exists,"
        " a password reset link has been sent."
    }


def reset_password(db: Session, data: ResetPasswordRequest):
    verification = (
        db.query(EmailVerification)
        .filter(
            EmailVerification.token == data.token,
            EmailVerification.purpose == VerificationPurpose.password_reset,
            EmailVerification.is_used == False,
        )
        .first()
    )

    if not verification:
        raise InvalidOTPError("Invalid or expired reset link")

    if ensure_utc(verification.expires_at) < datetime.now(timezone.utc):
        raise OTPExpiredError("Reset link has expired")

    user = (
        db.query(User)
        .filter(User.id == verification.user_id, User.is_deleted == False)
        .first()
    )

    if not user:
        raise UserNotFoundError("User not found")

    user.password_hash = get_password_hash(data.new_password)
    verification.is_used = True

    try:
        db.commit()
    except SQLAlchemyError:
        raise DatabaseTransactionError(
            "An error occurred while resetting the password. Please try again."
        )

    return {"message": "Password reset successfully."}


def logout_user(db: Session, refresh_token: str | None):
    if not refresh_token:
        return
    try:
        payload = decode_token(refresh_token)
        jti = payload.get("jti")
    except Exception:
        return
    db_token = db.query(RefreshToken).filter(RefreshToken.jti == jti).first()
    if db_token:
        db_token.revoked = True

    try:
        db.commit()
    except SQLAlchemyError:
        raise DatabaseTransactionError(
            "An error occurred while logging out. Please try again."
        )


def refresh_access_token(db: Session, refresh_token: str) -> str:
    from jose import JWTError

    try:
        payload = decode_token(refresh_token)
        jti = payload.get("jti")
    except JWTError:
        raise InvalidTokenError("Refresh token is invalid or expired")

    # 1. Pronalaženje starog tokena
    old_db_token = (
        db.query(RefreshToken)
        .filter(RefreshToken.jti == jti, RefreshToken.revoked == False)
        .first()
    )

    if not old_db_token or not verify_password(refresh_token, old_db_token.token):
        raise InvalidTokenError("Refresh token is invalid or revoked")

    # 2. Generisanje novih identiteta
    user_id = payload["sub"]

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise InvalidTokenError("User not found or deleted")

    new_jti = secrets.token_hex(32)
    new_access_token = create_access_token(
        {"sub": str(user_id), "role": user.role.name}
    )
    new_refresh_token = create_refresh_token({"sub": user_id, "jti": new_jti})

    # 3. Upisivanje novog tokena koji će zameniti stari
    new_db_token = RefreshToken(
        user_id=int(user_id),
        token=get_password_hash(new_refresh_token),
        jti=new_jti,
        expires_at=datetime.now(timezone.utc)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )

    db.add(new_db_token)
    db.flush()  # Dobijamo ID novog tokena pre commita

    # 4. KLJUČNI DEO: Povezivanje starog sa novim
    old_db_token.revoked = True
    old_db_token.replaced_by = new_db_token.id

    try:
        db.commit()
    except SQLAlchemyError:
        raise DatabaseTransactionError(
            "An error occurred while refreshing the access token. Please try again."
        )

    # Vraćamo oba, ruter će ih staviti u cookies
    return {"access_token": new_access_token, "refresh_token": new_refresh_token}
