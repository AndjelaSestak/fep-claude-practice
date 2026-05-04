from datetime import date, datetime

from pydantic import BaseModel

from app.models.recurring_transaction import Frequency

class RecurringTransactionBase(BaseModel):
    transaction_template_id: int
    frequency: Frequency
    next_run_at: datetime | None = None
    end_date: date | None = None
    start_date: date | None = None
    is_active: bool = True

class RecurringTransactionUpdate(BaseModel):
    frequency: Frequency | None = None
    end_date: date | None = None
    start_date: datetime | None = None
