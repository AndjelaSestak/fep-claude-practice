from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.role import Role
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError


class RoleRepository(BaseRepository[Role]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_by_name(self, name: str) -> Role | None:
        try:
            result = await self.db.execute(select(Role).where(Role.name == name))
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the role by name."
            ) from e
