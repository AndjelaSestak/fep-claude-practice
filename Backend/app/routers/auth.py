from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import VerifyOTP
from app.dependencies import get_db
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    return auth_service.register_user(db=db, user_data=user, background_tasks=background_tasks)

@router.post("/verify-email", status_code=status.HTTP_200_OK)
def verify_email(data: VerifyOTP, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    return auth_service.verify_user_email(db=db, data=data, background_tasks=background_tasks)