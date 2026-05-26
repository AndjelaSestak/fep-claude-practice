from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.card_report import CardReport
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError


class CardReportRepository(BaseRepository[CardReport]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_by_card_id(self, card_id: int) -> Sequence[CardReport]:
        try:
            result = await self.db.execute(
                select(CardReport).where(CardReport.card_id == card_id)
            )
            return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching card reports."
            ) from e
