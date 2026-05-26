from datetime import timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import text

from app.database import AsyncSessionLocal
from app.repositories.card_repository import CardRepository
from app.repositories.recurring_transaction_repository import (
    RecurringTransactionRepository,
)
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.wallet_repository import WalletRepository
from app.services.recurring_transaction_service import RecurringTransactionService
from app.services.transaction_service import TransactionService

scheduler = AsyncIOScheduler(timezone=timezone.utc)


RECURRING_JOB_LOCK_ID = 1001
PENDING_TRANSACTIONS_JOB_LOCK_ID = 1002


async def recurring_transactions_job() -> None:
    async with AsyncSessionLocal() as db:
        lock_acquired = False

        try:
            result = await db.execute(
                text("SELECT pg_try_advisory_lock(:lock_id)"),
                {"lock_id": RECURRING_JOB_LOCK_ID},
            )
            lock_acquired = result.scalar()

            if not lock_acquired:
                return

            service = RecurringTransactionService(
                recurring_transaction_repository=RecurringTransactionRepository(db),
                transaction_repository=TransactionRepository(db),
                wallet_repository=WalletRepository(db),
                card_repository=CardRepository(db),
            )

            await service.run_due_recurring_transactions()
            await db.commit()

        finally:
            if lock_acquired:
                await db.execute(
                    text("SELECT pg_advisory_unlock(:lock_id)"),
                    {"lock_id": RECURRING_JOB_LOCK_ID},
                )


async def pending_transactions_job() -> None:
    async with AsyncSessionLocal() as db:
        lock_acquired = False

        try:
            result = await db.execute(
                text("SELECT pg_try_advisory_lock(:lock_id)"),
                {"lock_id": PENDING_TRANSACTIONS_JOB_LOCK_ID},
            )
            lock_acquired = result.scalar()

            if not lock_acquired:
                return

            service = TransactionService(
                transaction_repository=TransactionRepository(db),
                wallet_repository=WalletRepository(db),
                card_repository=CardRepository(db),
            )
            await service.process_expired_pending_transactions()
            await db.commit()

        finally:
            if lock_acquired:
                await db.execute(
                    text("SELECT pg_advisory_unlock(:lock_id)"),
                    {"lock_id": PENDING_TRANSACTIONS_JOB_LOCK_ID},
                )


def start_scheduler() -> None:
    scheduler.add_job(
        recurring_transactions_job,
        "interval",
        minutes=1,
        id="recurring_transactions_job",
        replace_existing=True,
    )
    scheduler.add_job(
        pending_transactions_job,
        "interval",
        minutes=1,
        id="pending-transactions-job",
        replace_existing=True,
    )
    scheduler.start()


def stop_scheduler() -> None:
    scheduler.shutdown()
