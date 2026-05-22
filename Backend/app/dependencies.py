from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.utils.security import decode_token
from app.utils.errors import InvalidTokenError, NotAuthenticatedError
from app.models.user import User
from app.database import get_async_db as _get_async_db
from app.database import get_db as _get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from app.services.exchange_rate_service import ExchangeRateService
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.repositories.wallet_repository import WalletRepository

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

def get_exchange_rate_service() -> ExchangeRateService:
    return ExchangeRateService()

def get_user_service(db: AsyncSession = Depends(_get_async_db)) -> UserService:
    return UserService(
        user_repository=UserRepository(db),
        wallet_repository=WalletRepository(db),
    )
