from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.repositories.wallet_repository import WalletRepository
from app.schemas.user import UserPasswordUpdate, UserUpdate
from app.utils.errors import BadRequestError
from app.utils.security import get_password_hash, verify_password


class UserService:
    def __init__(
        self,
        user_repository: UserRepository,
        wallet_repository: WalletRepository,
    ) -> None:
        self.user_repository = user_repository
        self.wallet_repository = wallet_repository

    async def get_all_users(self) -> list[User]:
        return await self.user_repository.get_all()

    async def get_user_by_id_or_raise(self, user_id: int) -> User:
        return await self.user_repository.get_by_id_or_raise(user_id)

    async def delete_current_user(self, current_user: User) -> None:
        self.user_repository.soft_delete(current_user)
        wallet = await self.wallet_repository.get_wallet_by_user_id(current_user.id)
        if wallet is not None:
            self.wallet_repository.deactivate(wallet)

    async def update_current_user(
        self,
        current_user: User,
        user_data: UserUpdate,
    ) -> User:
        self.user_repository.update_fields(
            current_user,
            user_data.model_dump(exclude_unset=True),
        )
        return current_user

    async def change_password(
        self,
        current_user: User,
        user_password_update: UserPasswordUpdate,
    ) -> User:
        if not verify_password(
            user_password_update.current_password,
            current_user.password_hash,
        ):
            raise BadRequestError("Current password is incorrect")

        hashed_new_password = get_password_hash(user_password_update.new_password)
        self.user_repository.update_password_hash(current_user, hashed_new_password)
        return current_user
