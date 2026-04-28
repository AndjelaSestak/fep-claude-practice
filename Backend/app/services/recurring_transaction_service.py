from datetime import date, timedelta

from sqlalchemy.orm import Session
from app.models.recurring_transaction import Frequency, RecurringTransaction
from app.models.transaction_template import TransactionTemplate


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
    end_date: date | None = None,
) -> RecurringTransaction:
    next_run_at = template.created_at + FREQUENCY_DELTAS[frequency]

    recurring_transaction = RecurringTransaction(
        transaction_template_id=template.id,
        frequency=frequency,
        next_run_at=next_run_at,  
        end_date=end_date,
        start_date=template.created_at.date(),
    )
    db.add(recurring_transaction)
    db.commit()
    db.refresh(recurring_transaction)
    return recurring_transaction    

def cancel_recurring_transaction(db: Session, recurring_transaction_id: int, user_id: int):
    recurring_transaction = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_transaction_id,
        RecurringTransaction.user_id == user_id,
        RecurringTransaction.is_active == True
    ).first()

    if not recurring_transaction:
        return None 

    recurring_transaction.is_active = False
    db.commit()
    db.refresh(recurring_transaction)
    return recurring_transaction
    
