from datetime import date, timedelta, datetime
import asyncio
from sqlalchemy.orm import Session
from app.services.transaction_service import create_transaction, process_transaction
from app.models.transaction import TransactionType
from app.schemas.transaction import CreateTransactionRequest
from app.models.recurring_transaction import Frequency, RecurringTransaction
from app.models.transaction_template import TransactionTemplate
from app.utils.datetime import ensure_utc, utc_now


FREQUENCY_DELTAS = {
    Frequency.daily: timedelta(days=1),
    Frequency.weekly: timedelta(days=7),
    Frequency.monthly: timedelta(days=30),
    Frequency.yearly: timedelta(days=365),
}

def create_recurring_transaction(
    db: Session,
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
    db.add(recurring_transaction)
    db.commit()
    db.refresh(recurring_transaction)
    return recurring_transaction    

def cancel_recurring_transaction(db: Session, recurring_transaction_id: int):
    recurring_transaction = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_transaction_id,
        RecurringTransaction.is_active == True
    ).first()
    if recurring_transaction:
        recurring_transaction.is_active = False
        db.commit()
    
async def run_due_recurring_transactions(db: Session):
    now = utc_now()

    due_transactions = db.query(RecurringTransaction).filter(
        RecurringTransaction.next_run_at <= now,
        RecurringTransaction.is_active == True
    ).all()

    for recurring_transaction in due_transactions:
        template = recurring_transaction.transaction_template

        if template.is_deleted:
            recurring_transaction.is_active = False
            db.commit()
            continue

        if recurring_transaction.end_date and recurring_transaction.next_run_at.date() > recurring_transaction.end_date:
            recurring_transaction.is_active = False
            db.commit()
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

            transaction = create_transaction(db, transaction_request, template.user)
            transaction.type = TransactionType.recurring
            transaction.recurring_transaction_id = recurring_transaction.id

            recurring_transaction.next_run_at += FREQUENCY_DELTAS[recurring_transaction.frequency]
            db.commit()
        except Exception as e:
            print(f"Failed to create recurring transaction id={recurring_transaction.id}: {e}")
            db.rollback()
            continue

        asyncio.create_task(process_transaction(transaction.id))

        

