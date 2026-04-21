from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, Response, status
from typing import Annotated
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserResponse
from app.dependencies import get_db
from app.services import auth_service
from app.schemas.auth import LoginRequest, TokenResponse, ForgotPasswordRequest, MessageResponse,ResendEmailRequest, ResetPasswordRequest, VerifyOTP
from app.utils.security import verify_password, create_access_token, create_refresh_token
from app.config import settings
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    return auth_service.register_user(db=db, user_data=user, background_tasks=background_tasks)

@router.post("/verify-email", status_code=status.HTTP_200_OK)
def verify_email(data: VerifyOTP, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    return auth_service.verify_user_email(db=db, data=data, background_tasks=background_tasks)
@router.post("/forgot-password_email")
def forgot_password_email(request: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    return auth_service.forgot_password(db=db, email=request.email, background_tasks=background_tasks)

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.reset_password(db=db, data=data)

@router.post("/resend-verification-email", status_code=status.HTTP_200_OK)
def resend_verification_email(data: ResendEmailRequest, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    return auth_service.resend_verification_email(db=db, email=data.email, background_tasks=background_tasks)

@router.post("/login", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    tokens = auth_service.login_user(db=db, email=request.email, password=request.password)
    response.set_cookie(
        key="access_token", value=tokens["access_token"],
        httponly=True, samesite="lax", secure=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    response.set_cookie(
        key="refresh_token", value=tokens["refresh_token"],
        httponly=True, samesite="lax", secure=False,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400
    )
    return {"message": "Logged in successfully"}

@router.post("/refresh", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
    
    # Servis sada vraća dict {"access_token": ..., "refresh_token": ...}
    new_tokens = auth_service.refresh_access_token(db=db, refresh_token=refresh_token)
    
    # Postavi novi Access Token
    response.set_cookie(
        key="access_token", value=new_tokens["access_token"],
        httponly=True, samesite="lax", secure=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    # Postavi novi Refresh Token (rotacija)
    response.set_cookie(
        key="refresh_token", value=new_tokens["refresh_token"],
        httponly=True, samesite="lax", secure=False,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400
    )
    
    return {"message": "Token refreshed successfully"}

@router.post("/logout", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    auth_service.logout_user(db=db, refresh_token=refresh_token)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_me(request: Request, db: Session = Depends(get_db)):
    return auth_service.get_current_user(request=request, db=db)
