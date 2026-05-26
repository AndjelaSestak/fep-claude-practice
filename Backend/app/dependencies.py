from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session, selectinload

from app.database import get_async_db as _get_async_db
from app.database import get_db as _get_db
from app.models.user import User
from app.repositories.card_report_repository import CardReportRepository
from app.repositories.card_repository import CardRepository
from app.repositories.user_repository import UserRepository
from app.repositories.wallet_repository import WalletRepository
from app.services.card_report_service import CardReportService
from app.repositories.email_verification_repository import EmailVerificationRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.role_repository import RoleRepository
from app.services.auth_service import AuthService
from app.services.exchange_rate_service import ExchangeRateService
from app.services.user_service import UserService
from app.utils.errors import InvalidTokenError, NotAuthenticatedError
from app.utils.security import decode_token


def get_current_user(request: Request, db: Session = Depends(_get_db)) -> User:
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


async def get_current_user_async(
    request: Request,
    db: AsyncSession = Depends(_get_async_db),
) -> User:
    from jose import JWTError

    token = request.cookies.get("access_token")
    if not token:
        raise NotAuthenticatedError("Not authenticated")
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise InvalidTokenError("Invalid or expired token")

    result = await db.execute(
        select(User)
        .options(selectinload(User.role))
        .where(User.id == user_id, User.is_deleted == False)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise InvalidTokenError("User not found")
    return user


def get_card_report_service(
    db: AsyncSession = Depends(_get_async_db),
) -> CardReportService:
    return CardReportService(
        card_repository=CardRepository(db),
        card_report_repository=CardReportRepository(db),
    )


def get_exchange_rate_service() -> ExchangeRateService:
    return ExchangeRateService()


def get_user_service(db: AsyncSession = Depends(_get_async_db)) -> UserService:
    return UserService(
        user_repository=UserRepository(db),
        wallet_repository=WalletRepository(db),
    )


def get_auth_service(db: AsyncSession = Depends(_get_async_db)) -> AuthService:
    return AuthService(
        user_repository=UserRepository(db),
        wallet_repository=WalletRepository(db),
        role_repository=RoleRepository(db),
        email_verification_repository=EmailVerificationRepository(db),
        refresh_token_repository=RefreshTokenRepository(db),
    )
