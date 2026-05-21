from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_async_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.repositories.wallet_repository import WalletRepository
from app.schemas.user import UserPasswordUpdate, UserResponse, UserUpdate
from app.services.user_service import UserService
from app.utils.permissions import AsyncRequireRole

router = APIRouter(prefix="/users", tags=["Users"])

require_user = AsyncRequireRole(["user"])


def get_user_service(db: AsyncSession = Depends(get_async_db)) -> UserService:
    return UserService(
        user_repository=UserRepository(db),
        wallet_repository=WalletRepository(db),
    )


@router.get("/get_all_users", response_model=list[UserResponse])
async def get_users(
    current_user: User = Depends(require_user),
    service: UserService = Depends(get_user_service),
):
    return await service.get_all_users()


@router.get("/get_user_by_id/{user_id}", response_model=UserResponse)
async def get_user_by_id_route(
    user_id: int,
    current_user: User = Depends(require_user),
    service: UserService = Depends(get_user_service),
):
    return await service.get_user_by_id(user_id)


@router.delete("/me")
async def delete_current_user_route(
    response: Response,
    current_user: User = Depends(require_user),
    service: UserService = Depends(get_user_service),
):
    await service.delete_current_user(current_user)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"detail": "User has been deleted successfully."}


@router.patch("/me", response_model=UserResponse)
async def update_current_user_route(
    user_data: UserUpdate,
    current_user: User = Depends(require_user),
    service: UserService = Depends(get_user_service),
):
    return await service.update_current_user(current_user, user_data)


@router.patch("/me/password", response_model=UserResponse)
async def change_password_route(
    user_password_update: UserPasswordUpdate,
    current_user: User = Depends(require_user),
    service: UserService = Depends(get_user_service),
):
    return await service.change_password(current_user, user_password_update)
