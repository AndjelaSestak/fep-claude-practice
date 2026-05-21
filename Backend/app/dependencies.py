from typing import AsyncGenerator, Generator

from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.utils.security import decode_token
from app.utils.errors import InvalidTokenError, NotAuthenticatedError
from app.models.user import User
from app.database import AsyncSessionLocal, SessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as db:
        try:
            yield db
            await db.commit()
        except Exception:
            await db.rollback()
            raise

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

async def get_current_user_async(
    request: Request,
    db: AsyncSession = Depends(get_async_db),
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
