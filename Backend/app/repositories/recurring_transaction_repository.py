from datetime import datetime

from sqlalchemy import exists, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.recurring_transaction import RecurringTransaction
from app.models.transaction import Transaction
from app.models.transaction_template import TransactionTemplate
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError


class RecurringTransactionRepository(BaseRepository[RecurringTransaction]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_by_id_and_user(
        self,
        recurring_transaction_id: int,
        user_id: int,
        *,
        active_only: bool = False,
    ) -> RecurringTransaction | None:
        try:
            conditions = [
                RecurringTransaction.id == recurring_transaction_id,
                TransactionTemplate.user_id == user_id,
            ]
            if active_only:
                conditions.append(RecurringTransaction.is_active == True)

            result = await self.db.execute(
                select(RecurringTransaction)
                .join(TransactionTemplate)
                .where(*conditions)
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the recurring transaction."
            ) from e

    async def get_due(self, now: datetime) -> list[RecurringTransaction]:
        try:
            result = await self.db.execute(
                select(RecurringTransaction)
                .options(
                    selectinload(
                        RecurringTransaction.transaction_template
                    ).selectinload(TransactionTemplate.user)
                )
                .where(
                    RecurringTransaction.next_run_at <= now,
                    RecurringTransaction.is_active == True,
                )
            )
            return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching due recurring transactions."
            ) from e

    async def has_executed_transactions(self, recurring_transaction_id: int) -> bool:
        try:
            result = await self.db.execute(
                select(
                    exists().where(
                        Transaction.recurring_transaction_id == recurring_transaction_id
                    )
                )
            )
            return result.scalar() or False
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while checking executed transactions."
            ) from e
