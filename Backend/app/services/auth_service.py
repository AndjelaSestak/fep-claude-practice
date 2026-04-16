import secrets
import string

from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta, timezone

import random
from app.schemas.auth import VerifyOTP
from app.models.email_verification import EmailVerification, VerificationPurpose
from app.models.user import User
from app.models.role import Role
from app.models.wallet import Wallet
from app.models.refresh_token import RefreshToken
from app.schemas.user import UserCreate
from app.utils.security import create_access_token, create_refresh_token, decode_token, get_password_hash, verify_password
from app.services.email_types import send_verification_email, send_welcome_email
from fastapi import BackgroundTasks, Depends, Request
from app.config import settings
from app.dependencies import get_db

from app.utils.errors import EmailAlreadyRegisteredError, InvalidOTPError, InvalidTokenError, NotAuthenticatedError, OTPExpiredError, RoleNotFoundError, DatabaseTransactionError, UserNotFoundError

def register_user(db: Session, user_data: UserCreate,background_tasks: BackgroundTasks) -> User:
    existing_user = db.query(User).filter(
        func.lower(User.email) == user_data.email.lower()
    ).first()

    if existing_user:
        raise EmailAlreadyRegisteredError("Email is already registered")

    default_role = db.query(Role).filter(Role.name == "user").first()
    if not default_role:
        raise RoleNotFoundError("Critical error: Default 'user' role is missing from the database.")
    role_id = default_role.id

    new_user = User(
        name=user_data.name,
        email=user_data.email.lower(),
        password_hash=get_password_hash(user_data.password),
        city=user_data.city,
        address=user_data.address,
        date_of_birth=user_data.date_of_birth,
        role_id=role_id
    )

    try:
        db.add(new_user)
        db.flush()

        
        otp_code = "".join(secrets.choice(string.digits) for _ in range(6))

        new_verification = EmailVerification(
            user_id=new_user.id,
            token=otp_code,
            purpose=VerificationPurpose.registration,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10), # Ističe za 10 min
            is_used=False
        )
        db.add(new_verification)

        # Create a wallet for the new user automatically
        while True:
            account_number = "".join([str(random.randint(0, 9)) for _ in range(16)])
            existing = db.query(Wallet).filter(Wallet.account_number == account_number).first()
            if not existing:
                break
        new_wallet = Wallet(
            user_id=new_user.id,
            balance=0,
            account_number=account_number,
            currency="RSD"
        )
        db.add(new_wallet)

        db.commit()
        db.refresh(new_user)

        background_tasks.add_task(
            send_verification_email,
            recipient=new_user.email,
            name=new_user.name,
            otp=otp_code
        )

        return new_user
    
    except SQLAlchemyError:
        db.rollback()
        raise DatabaseTransactionError("An error occurred while creating the account. Please try again.")
    
def verify_user_email(db: Session, data: VerifyOTP,background_tasks: BackgroundTasks):

    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user:
        raise UserNotFoundError("No user found with the provided email address")    

    
    verification = db.query(EmailVerification).filter(
        EmailVerification.user_id == user.id,
        EmailVerification.token == data.otp_code,
        EmailVerification.purpose == VerificationPurpose.registration,
        EmailVerification.is_used == False
    ).order_by(EmailVerification.expires_at.desc()).first()

    
    if not verification:
        raise InvalidOTPError("Invalid OTP code provided")

    if verification.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise OTPExpiredError("OTP code has expired")

    
    try:
        user.is_email_verified = True
        verification.is_used = True
        db.commit()

        background_tasks.add_task(
            send_welcome_email,
            recipient=data.email,
            name=user.name
        )
    except Exception:
        db.rollback()
        raise DatabaseTransactionError("An error occurred while creating the account. Please try again.")

    return {"message": "Email successfully verified!"}

def login_user(db: Session, email: str, password: str) -> dict:
    user = db.query(User).filter(User.email == email.lower()).first()

    if not user or not verify_password(password, user.password_hash):
        raise UserNotFoundError("Invalid email or password")

    jti = secrets.token_hex(32)
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id), "jti": jti})

    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        jti=jti,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(db_token)
    db.commit()

    return {"access_token": access_token, "refresh_token": refresh_token}

def logout_user(db: Session, refresh_token: str | None):
    if not refresh_token:
        return
    db_token = db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    if db_token:
        db_token.revoked = True
        db.commit()

def refresh_access_token(db: Session, refresh_token: str) -> str:
    from jose import JWTError
    try:
        payload = decode_token(refresh_token)
    except JWTError:
        raise InvalidTokenError("Refresh token is invalid or expired")

    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token,
        RefreshToken.revoked == False
    ).first()
    if not db_token:
        raise InvalidTokenError("Refresh token is invalid or revoked")

    return create_access_token({"sub": payload["sub"]})

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    from jose import JWTError
    token = request.cookies.get("access_token")
    if not token:
        raise NotAuthenticatedError("Not authenticated")
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise InvalidTokenError("Invalid or expired token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise InvalidTokenError("User not found")
    return user