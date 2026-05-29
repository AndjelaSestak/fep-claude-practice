import asyncio
from datetime import date, datetime, timedelta

from app.models.recurring_transaction import Frequency, RecurringTransaction
from app.models.transaction import TransactionType
from app.models.transaction_template import TransactionTemplate
from app.models.user import User
from app.repositories.card_repository import CardRepository
from app.repositories.recurring_transaction_repository import (
    RecurringTransactionRepository,
)
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.wallet_repository import WalletRepository
from app.schemas.recurring_transaction import RecurringTransactionUpdate
from app.schemas.transaction import CreateTransactionRequest
from app.services.transaction_service import TransactionService
from app.utils.datetime import ensure_utc, utc_now
from app.utils.errors import (
    BadRequestError,
    TransactionNotFoundError,
)

FREQUENCY_DELTAS = {
    Frequency.daily: timedelta(days=1),
    Frequency.weekly: timedelta(days=7),
    Frequency.monthly: timedelta(days=30),
    Frequency.yearly: timedelta(days=365),
}


class RecurringTransactionService:
    def __init__(
        self,
        recurring_transaction_repository: RecurringTransactionRepository,
        transaction_repository: TransactionRepository,
        wallet_repository: WalletRepository,
        card_repository: CardRepository,
    ) -> None:
        self.recurring_transaction_repository = recurring_transaction_repository
        self.transaction_repository = transaction_repository
        self.wallet_repository = wallet_repository
        self.card_repository = card_repository

    async def create_recurring_transaction(
        self,
        template: TransactionTemplate,
        frequency: Frequency,
        start_date: datetime,
        end_date: date | None = None,
    ) -> RecurringTransaction:
        start_date_utc = ensure_utc(start_date)

        recurring_transaction = RecurringTransaction(
            transaction_template_id=template.id,
            frequency=frequency,
            next_run_at=start_date_utc,
            end_date=end_date,
            start_date=start_date_utc.date(),
        )
        self.recurring_transaction_repository.add(recurring_transaction)
        await self.recurring_transaction_repository.flush()
        await self.recurring_transaction_repository.refresh(recurring_transaction)
        return recurring_transaction

    async def set_recurring_transaction_status(
        self, recurring_transaction_id: int, user_id: int, is_active: bool
    ) -> RecurringTransaction:

        recurring_transaction = (
            await self.recurring_transaction_repository.get_by_id_and_user(
                recurring_transaction_id, user_id
            )
        )

        if not recurring_transaction:
            raise TransactionNotFoundError("Recurring transaction not found.")

        if recurring_transaction.is_active == is_active:
            status = "active" if is_active else "cancelled"
            raise TransactionNotFoundError(
                f"Recurring transaction is already {status}."
            )
        self._set_is_active(recurring_transaction, is_active)
        await self.recurring_transaction_repository.flush()
        await self.recurring_transaction_repository.refresh(recurring_transaction)
        return recurring_transaction

    async def run_due_recurring_transactions(self) -> None:
        now = utc_now()

        due_transactions = await self.recurring_transaction_repository.get_due(now)

        for recurring_transaction in due_transactions:
            template = recurring_transaction.transaction_template

            if template.is_deleted or (
                recurring_transaction.end_date
                and recurring_transaction.next_run_at.date()
                > recurring_transaction.end_date
            ):
                self._set_is_active(recurring_transaction, False)
                await self.recurring_transaction_repository.flush()
                continue

            transaction_request = CreateTransactionRequest(
                card_id=template.card_id,
                amount=float(template.amount),
                currency=template.currency,
                recipient=template.recipient,
                recipient_account_number=template.recipient_account_number,
                reference=template.reference,
            )

            try:
                transaction_service = TransactionService(
                    transaction_repository=self.transaction_repository,
                    wallet_repository=self.wallet_repository,
                    card_repository=self.card_repository,
                )
                transaction = await transaction_service.create_transaction(
                    transaction_request, template.user
                )
                transaction.type = TransactionType.recurring
                transaction.recurring_transaction_id = recurring_transaction.id
                recurring_transaction.next_run_at += FREQUENCY_DELTAS[
                    recurring_transaction.frequency
                ]
                await self.recurring_transaction_repository.flush()
                asyncio.create_task(
                    transaction_service.process_transaction(transaction.id)
                )
            except Exception:
                continue

    async def update_recurring_transaction(
        self,
        recurring_transaction_id: int,
        request: RecurringTransactionUpdate,
        current_user: User,
    ) -> RecurringTransaction:

        recurring_transaction = (
            await self.recurring_transaction_repository.get_by_id_and_user(
                recurring_transaction_id, current_user.id, active_only=True
            )
        )

        if not recurring_transaction:
            raise TransactionNotFoundError(
                "Recurring transaction not found or is not active."
            )

        update_data = request.model_dump(exclude_unset=True)

        if "frequency" in update_data:
            recurring_transaction.frequency = update_data["frequency"]

        if "end_date" in update_data:
            recurring_transaction.end_date = update_data["end_date"]

        if "start_date" in update_data:
            has_executed = (
                await self.recurring_transaction_repository.has_executed_transactions(
                    recurring_transaction.id
                )
            )

            if has_executed:
                raise BadRequestError(
                    "Start date cannot be changed after the recurring transaction has been executed."
                )

            start_date_utc = ensure_utc(update_data["start_date"])
            recurring_transaction.next_run_at = start_date_utc
            recurring_transaction.start_date = start_date_utc.date()

        await self.recurring_transaction_repository.flush()
        await self.recurring_transaction_repository.refresh(recurring_transaction)
        return recurring_transaction

    def _set_is_active(
        self, recurring_transaction: RecurringTransaction, is_active: bool
    ) -> RecurringTransaction:
        recurring_transaction.is_active = is_active
        return recurring_transaction
