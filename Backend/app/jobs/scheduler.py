from datetime import timezone
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import text
from app.database import SessionLocal
from app.services.recurring_transaction_service import run_due_recurring_transactions
from app.services.transaction_service import process_expired_pending_transactions

scheduler = AsyncIOScheduler(timezone=timezone.utc)


RECURRING_JOB_LOCK_ID = 1001
PENDING_TRANSACTIONS_JOB_LOCK_ID = 1002

async def recurring_transactions_job() -> None:
    db = SessionLocal()
    lock_acquired = False

    try:
        lock_acquired = db.execute(
            text("SELECT pg_try_advisory_lock(:lock_id)"),
            {"lock_id": RECURRING_JOB_LOCK_ID},
        ).scalar()
        
        if not lock_acquired:
            return

        await run_due_recurring_transactions(db)

    finally:
        if lock_acquired:
            db.execute(
                text("SELECT pg_advisory_unlock(:lock_id)"),
                {"lock_id": RECURRING_JOB_LOCK_ID},
            )
        db.close()


def pending_transactions_job() -> None:
    db = SessionLocal()
    lock_acquired = False

    try:
        lock_acquired = db.execute(
            text("SELECT pg_try_advisory_lock(:lock_id)"),
            {"lock_id": PENDING_TRANSACTIONS_JOB_LOCK_ID},
        ).scalar()

        if not lock_acquired:
            return

        process_expired_pending_transactions(db)

    finally:
        if lock_acquired:
            db.execute(
                text("SELECT pg_advisory_unlock(:lock_id)"),
                {"lock_id": PENDING_TRANSACTIONS_JOB_LOCK_ID},
            )
        db.close()

def start_scheduler() -> None:
    scheduler.add_job(
        recurring_transactions_job,
        "interval",
        minutes=1,
        id="recurring-transactions-job",
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
