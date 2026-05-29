from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.card import Card
from app.models.recurring_transaction import RecurringTransaction
from app.models.transaction_template import TransactionTemplate
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError


class TemplateRepository(BaseRepository[TransactionTemplate]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_by_id_and_user(
        self, template_id: int, user_id: int
    ) -> TransactionTemplate | None:
        try:
            result = await self.db.execute(
                select(TransactionTemplate)
                .options(
                    selectinload(
                        TransactionTemplate.recurring_transactions
                    ).selectinload(RecurringTransaction.transactions),
                    selectinload(TransactionTemplate.card).selectinload(Card.card_type),
                )
                .where(
                    TransactionTemplate.id == template_id,
                    TransactionTemplate.user_id == user_id,
                    TransactionTemplate.is_deleted == False,
                )
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the template."
            ) from e

    async def get_all_by_user(self, user_id: int) -> list[TransactionTemplate]:
        try:
            result = await self.db.execute(
                select(TransactionTemplate)
                .options(
                    selectinload(
                        TransactionTemplate.recurring_transactions
                    ).selectinload(RecurringTransaction.transactions),
                    selectinload(TransactionTemplate.card).selectinload(Card.card_type),
                )
                .where(
                    TransactionTemplate.user_id == user_id,
                    TransactionTemplate.is_deleted == False,
                )
            )
            return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching templates."
            ) from e
