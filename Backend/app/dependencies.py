from typing import Generator

from fastapi import Depends, Request
from app.utils.security import decode_token
from app.utils.errors import InvalidTokenError, NotAuthenticatedError
from app.models.user import User
from app.database import SessionLocal
from sqlalchemy.orm import Session

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

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