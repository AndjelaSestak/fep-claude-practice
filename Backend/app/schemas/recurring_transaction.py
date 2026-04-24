from pydantic import BaseModel

class RecurringTransactionBase(BaseModel):
    transaction_template_id: int
    frequency: str
    next_run_at: str | None = None
    end_date: str | None = None
    start_date: str | None = None
    is_active: bool = True