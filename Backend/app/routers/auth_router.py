from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)

from app.config import settings
from app.dependencies import get_auth_service
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    ResendEmailRequest,
    ResetPasswordRequest,
    VerifyOTP,
)
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService
from app.utils.permissions import RequireRole

router = APIRouter(prefix="/auth", tags=["Authentication"])

require_user = RequireRole(["user"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register_user(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    service: AuthService = Depends(get_auth_service),
):
    return await service.register_user(
        user_data=user, background_tasks=background_tasks
    )


@router.post("/verify_email", status_code=status.HTTP_200_OK)
async def verify_email(
    data: VerifyOTP,
    background_tasks: BackgroundTasks,
    service: AuthService = Depends(get_auth_service),
):
    return await service.verify_user_email(data=data, background_tasks=background_tasks)


@router.post("/forgot_password_email")
async def forgot_password_email(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    service: AuthService = Depends(get_auth_service),
):
    return await service.forgot_password(
        email=request.email, background_tasks=background_tasks
    )


@router.post("/reset_password")
async def reset_password(
    data: ResetPasswordRequest,
    service: AuthService = Depends(get_auth_service),
):
    return await service.reset_password(data=data)


@router.post("/resend_verification_email", status_code=status.HTTP_200_OK)
async def resend_verification_email(
    data: ResendEmailRequest,
    background_tasks: BackgroundTasks,
    service: AuthService = Depends(get_auth_service),
):
    return await service.resend_verification_email(
        email=data.email, background_tasks=background_tasks
    )


@router.post("/login", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def login(
    request: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    tokens = await service.login_user(
        email=request.email,
        password=request.password,
    )
    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )
    return {"message": "Logged in successfully"}


@router.post("/refresh", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def refresh(
    request: Request,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token"
        )

    new_tokens = await service.refresh_access_token(refresh_token=refresh_token)

    response.set_cookie(
        key="access_token",
        value=new_tokens["access_token"],
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    response.set_cookie(
        key="refresh_token",
        value=new_tokens["refresh_token"],
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )

    return {"message": "Token refreshed successfully"}


@router.post("/logout", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def logout(
    request: Request,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    refresh_token = request.cookies.get("refresh_token")
    await service.logout_user(refresh_token=refresh_token)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_me(current_user: User = Depends(require_user)):
    return current_user
