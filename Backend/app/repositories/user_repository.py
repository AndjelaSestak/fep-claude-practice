from typing import Any

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_all(self) -> list[User]:
        try:
            result = await self.db.execute(select(User).where(User.is_deleted == False))
            return list(result.scalars().all())
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching users."
            ) from e

    async def get_by_id(self, user_id: int) -> User | None:
        try:
            result = await self.db.execute(
                select(User).where(
                    User.id == user_id,
                    User.is_deleted == False,
                )
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the user."
            ) from e

    def soft_delete(self, user: User) -> User:
        user.is_deleted = True
        return user

    def update_password_hash(self, user: User, password_hash: str) -> User:
        user.password_hash = password_hash
        return user

    def update_fields(self, user: User, fields: dict[str, Any]) -> User:
        for key, value in fields.items():
            setattr(user, key, value)
        return user
