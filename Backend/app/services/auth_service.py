import secrets
import string
from datetime import datetime, timedelta, timezone

from fastapi import BackgroundTasks
from jose import JWTError

from app.config import settings
from app.models.email_verification import EmailVerification, VerificationPurpose
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.models.wallet import Wallet
from app.repositories.email_verification_repository import EmailVerificationRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.role_repository import RoleRepository
from app.repositories.user_repository import UserRepository
from app.repositories.wallet_repository import WalletRepository
from app.schemas.auth import ResetPasswordRequest, VerifyOTP
from app.schemas.user import UserCreate
from app.services.email_service import email_service
from app.services.wallet_service import generate_account_number
from app.utils.datetime import ensure_utc
from app.utils.errors import (
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


class AuthService:
    def __init__(
        self,
        user_repository: UserRepository,
        wallet_repository: WalletRepository,
        role_repository: RoleRepository,
        email_verification_repository: EmailVerificationRepository,
        refresh_token_repository: RefreshTokenRepository,
    ) -> None:
        self.user_repository = user_repository
        self.wallet_repository = wallet_repository
        self.role_repository = role_repository
        self.email_verification_repository = email_verification_repository
        self.refresh_token_repository = refresh_token_repository

    async def register_user(
        self, user_data: UserCreate, background_tasks: BackgroundTasks
    ) -> User:
        existing_user = await self.user_repository.get_by_email(user_data.email.lower())

        if existing_user:
            raise EmailAlreadyRegisteredError("Email is already registered")

        default_role = await self.role_repository.get_by_name("user")
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
        self.user_repository.add(new_user)
        await self.user_repository.flush()

        otp_code = "".join(secrets.choice(string.digits) for _ in range(6))

        new_verification = EmailVerification(
            user_id=new_user.id,
            token=otp_code,
            purpose=VerificationPurpose.registration,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            is_used=False,
        )
        self.email_verification_repository.add(new_verification)

        new_wallet = Wallet(
            user_id=new_user.id,
            balance=0,
            account_number=await generate_account_number(self.wallet_repository.db),
            currency="RSD",
        )
        self.wallet_repository.add(new_wallet)

        background_tasks.add_task(
            email_service.send_verification_email,
            recipient=new_user.email,
            name=new_user.name,
            otp=otp_code,
        )

        return new_user

    async def verify_user_email(
        self, data: VerifyOTP, background_tasks: BackgroundTasks
    ) -> dict:
        user = await self.user_repository.get_by_email(data.email.lower())
        if not user:
            raise UserNotFoundError("No user found with the provided email address")

        verification_repo = self.email_verification_repository
        verification = await verification_repo.get_latest_registration_verification(
            user.id,
            data.otp_code,
        )

        if not verification:
            raise InvalidOTPError("Invalid OTP code provided")

        if ensure_utc(verification.expires_at) < datetime.now(timezone.utc):
            raise OTPExpiredError("OTP code has expired")

        user.is_email_verified = True
        verification.is_used = True

        background_tasks.add_task(
            email_service.send_welcome_email, recipient=data.email, name=user.name
        )

        return {"message": "Email successfully verified!"}

    async def resend_verification_email(
        self, email: str, background_tasks: BackgroundTasks
    ) -> dict:
        user = await self.user_repository.get_by_email(email.lower())
        if not user:
            raise UserNotFoundError("No user found with the provided email address")
        if user.is_email_verified:
            return {"message": "Email is already verified"}

        verification_repo = self.email_verification_repository
        await verification_repo.mark_active_registration_verifications_used(user.id)

        otp_code = "".join(secrets.choice(string.digits) for _ in range(6))

        new_verification = EmailVerification(
            user_id=user.id,
            token=otp_code,
            purpose=VerificationPurpose.registration,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            is_used=False,
        )
        self.email_verification_repository.add(new_verification)

        background_tasks.add_task(
            email_service.send_verification_email,
            recipient=user.email,
            name=user.name,
            otp=otp_code,
        )

        return {"message": "A new verification email has been sent."}

    async def login_user(self, email: str, password: str) -> dict:
        user = await self.user_repository.get_by_email_with_role(email.lower())

        if not user or not verify_password(password, user.password_hash):
            raise UserNotFoundError("Invalid email or password")
        if not user.is_email_verified:
            raise UserNotFoundError("Email address has not been verified")

        jti = secrets.token_hex(32)
        access_token = create_access_token(
            {"sub": str(user.id), "role": user.role.name}
        )
        refresh_token = create_refresh_token({"sub": str(user.id), "jti": jti})

        db_token = RefreshToken(
            user_id=user.id,
            token=get_password_hash(refresh_token),
            jti=jti,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        self.refresh_token_repository.add(db_token)

        return {"access_token": access_token, "refresh_token": refresh_token}

    async def forgot_password(
        self, email: str, background_tasks: BackgroundTasks
    ) -> dict:
        response = {
            "message": "If an account with that email exists,"
            " a password reset link has been sent."
        }

        user = await self.user_repository.get_by_email(email.lower())
        if not user:
            return response

        reset_token = secrets.token_urlsafe(32)

        new_verification = EmailVerification(
            user_id=user.id,
            token=reset_token,
            purpose=VerificationPurpose.password_reset,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=30),
            is_used=False,
        )
        self.email_verification_repository.add(new_verification)

        reset_link = f"http://localhost:5173/reset_password?token={reset_token}"

        background_tasks.add_task(
            email_service.send_reset_password_email,
            recipient=user.email,
            name=user.name,
            reset_link=reset_link,
        )

        return response

    async def reset_password(self, data: ResetPasswordRequest) -> dict:
        verification_repo = self.email_verification_repository
        verification = await verification_repo.get_active_password_reset_verification(
            data.token
        )

        if not verification:
            raise InvalidOTPError("Invalid or expired reset link")

        if ensure_utc(verification.expires_at) < datetime.now(timezone.utc):
            raise OTPExpiredError("Reset link has expired")

        user = await self.user_repository.get_by_id(verification.user_id)
        if not user:
            raise UserNotFoundError("User not found")

        self.user_repository.update_password_hash(
            user, get_password_hash(data.new_password)
        )
        verification.is_used = True

        return {"message": "Password reset successfully."}

    async def logout_user(self, refresh_token: str | None) -> None:
        if not refresh_token:
            return
        try:
            payload = decode_token(refresh_token)
            jti = payload.get("jti")
        except Exception:
            return

        if not jti:
            return

        db_token = await self.refresh_token_repository.get_active_by_jti(jti)
        if db_token:
            db_token.revoked = True

    async def refresh_access_token(self, refresh_token: str) -> dict[str, str]:
        try:
            payload = decode_token(refresh_token)
            jti = payload.get("jti")
        except JWTError:
            raise InvalidTokenError("Refresh token is invalid or expired")

        if not jti:
            raise InvalidTokenError("Refresh token is invalid or expired")

        old_db_token = await self.refresh_token_repository.get_active_by_jti(jti)

        if not old_db_token or not verify_password(refresh_token, old_db_token.token):
            raise InvalidTokenError("Refresh token is invalid or revoked")

        user_id = payload["sub"]

        user = await self.user_repository.get_by_id_with_role(int(user_id))
        if not user:
            raise InvalidTokenError("User not found or deleted")

        new_jti = secrets.token_hex(32)
        new_access_token = create_access_token(
            {"sub": str(user_id), "role": user.role.name}
        )
        new_refresh_token = create_refresh_token({"sub": user_id, "jti": new_jti})

        new_db_token = RefreshToken(
            user_id=int(user_id),
            token=get_password_hash(new_refresh_token),
            jti=new_jti,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )

        self.refresh_token_repository.add(new_db_token)
        await self.refresh_token_repository.flush()

        old_db_token.revoked = True
        old_db_token.replaced_by = new_db_token.id

        return {"access_token": new_access_token, "refresh_token": new_refresh_token}
