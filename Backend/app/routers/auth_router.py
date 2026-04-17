from fastapi import APIRouter, BackgroundTasks, Depends, status
from typing import Annotated
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import ResetPasswordRequest, VerifyOTP
from app.dependencies import get_db
from app.services import auth_service
from app.schemas.auth import LoginRequest, TokenResponse, ForgotPasswordRequest
from app.utils.security import verify_password, create_access_token, create_refresh_token


router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    return auth_service.register_user(db=db, user_data=user, background_tasks=background_tasks)

@router.post("/verify-email", status_code=status.HTTP_200_OK)
def verify_email(data: VerifyOTP, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    return auth_service.verify_user_email(db=db, data=data, background_tasks=background_tasks)

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login_user(db=db, email=request.email, password=request.password)

@router.post("/forgot-password_email")
def forgot_password_email(request: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    return auth_service.forgot_password(db=db, email=request.email, background_tasks=background_tasks)

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.reset_password(db=db, data=data)
