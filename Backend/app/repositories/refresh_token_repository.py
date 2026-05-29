from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.refresh_token import RefreshToken
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError


class RefreshTokenRepository(BaseRepository[RefreshToken]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_active_by_jti(self, jti: str) -> RefreshToken | None:
        try:
            result = await self.db.execute(
                select(RefreshToken).where(
                    RefreshToken.jti == jti,
                    RefreshToken.revoked == False,
                )
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the refresh token."
            ) from e
