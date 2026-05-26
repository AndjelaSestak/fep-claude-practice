from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction
from app.models.wallet import Wallet
from app.repositories.base_repository import BaseRepository
from app.utils.enums import TransactionDirection, TransactionStatus, TransactionType
from app.utils.errors import DatabaseTransactionError


class TransactionRepository(BaseRepository[Transaction]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    def _user_account_subquery(self, user_id: int):
        return (
            select(Wallet.account_number)
            .where(Wallet.user_id == user_id)
            .scalar_subquery()
        )

    async def get_by_id(self, transaction_id: int) -> Transaction | None:
        try:
            result = await self.db.execute(
                select(Transaction).where(Transaction.id == transaction_id)
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the transaction."
            ) from e

    async def get_by_id_and_user(
        self, transaction_id: int, user_id: int
    ) -> Transaction | None:
        try:
            user_account = self._user_account_subquery(user_id)
            result = await self.db.execute(
                select(Transaction).where(
                    Transaction.id == transaction_id,
                    or_(
                        Transaction.user_id == user_id,
                        Transaction.recipient_account_number == user_account,
                    ),
                )
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the transaction."
            ) from e

    async def get_by_user(
        self,
        user_id: int,
        search: Optional[str] = None,
        limit: int = 10,
        offset: int = 0,
    ) -> list[Transaction]:
        try:
            user_account = self._user_account_subquery(user_id)
            query = select(Transaction).where(
                or_(
                    Transaction.user_id == user_id,
                    Transaction.recipient_account_number == user_account,
                )
            )

            if search:
                search_pattern = f"%{search}%"
                query = query.where(
                    or_(
                        Transaction.recipient.ilike(search_pattern),
                        Transaction.sender.ilike(search_pattern),
                        Transaction.reference.ilike(search_pattern),
                    )
                )

            query = (
                query.order_by(Transaction.created_at.desc())
                .offset(offset)
                .limit(limit)
            )
            result = await self.db.execute(query)
            return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching transactions."
            ) from e

    async def get_filtered(
        self,
        user_id: int,
        search: Optional[str] = None,
        type: Optional[str] = None,
        direction: Optional[str] = None,
        period: Optional[str] = None,
        limit: Optional[int] = None,
        offset: int = 0,
    ) -> list[Transaction]:
        try:
            user_account = self._user_account_subquery(user_id)
            query = select(Transaction).where(
                or_(
                    Transaction.user_id == user_id,
                    Transaction.recipient_account_number == user_account,
                )
            )

            if period == "current_month":
                today = datetime.now(timezone.utc)
                start_of_month = today.replace(
                    day=1, hour=0, minute=0, second=0, microsecond=0
                )
                query = query.where(Transaction.created_at >= start_of_month)

            if search:
                search_pattern = f"%{search}%"
                query = query.where(
                    or_(
                        Transaction.recipient.ilike(search_pattern),
                        Transaction.sender.ilike(search_pattern),
                        Transaction.reference.ilike(search_pattern),
                    )
                )

            if type and type != TransactionType.all:
                query = query.where(Transaction.type == type)

            if direction and direction != TransactionDirection.all:
                if direction == TransactionDirection.incoming:
                    query = query.where(
                        Transaction.sender_account_number != user_account
                    )
                elif direction == TransactionDirection.outgoing:
                    query = query.where(
                        Transaction.sender_account_number == user_account
                    )

            query = query.order_by(Transaction.created_at.desc())

            if limit is not None:
                query = query.offset(offset).limit(limit)

            result = await self.db.execute(query)
            return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching transactions."
            ) from e

    async def get_pending_expired(self, cutoff: datetime) -> list[Transaction]:
        try:
            result = await self.db.execute(
                select(Transaction).where(
                    Transaction.status == TransactionStatus.pending,
                    Transaction.created_at <= cutoff,
                )
            )
            return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching pending transactions."
            ) from e

    def update_status(
        self, transaction: Transaction, status: TransactionStatus
    ) -> Transaction:
        transaction.status = status
        return transaction
