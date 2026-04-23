from pydantic import BaseModel, ConfigDict, model_validator
from decimal import Decimal
from typing import Optional, List
from datetime import datetime, date
from app.models.transaction import TransactionType
from app.models.recurring_transaction import Frequency


class TransactionTemplateBase(BaseModel):
    name: str
    amount: Decimal
    currency: str
    recipient: str
    recipient_account_number: str
    card_id: int
    reference: Optional[str] = None
    type: TransactionType = TransactionType.single


class TransactionTemplateCreate(TransactionTemplateBase):
    frequency: Optional[Frequency] = None
    start_date: Optional[datetime] = None
    end_date: Optional[date] = None

    @model_validator(mode="after")
    def validate_recurring_fields(self):
        if self.type == TransactionType.reccuring:
            if not self.frequency or not self.start_date:
                raise ValueError("Frequency and start date are required for recurring transactions.")
        return self


class TransactionTemplateUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[Decimal] = None
    currency: Optional[str] = None
    recipient: Optional[str] = None
    recipient_account_number: Optional[str] = None
    card_id: Optional[int] = None
    reference: Optional[str] = None
    type: Optional[TransactionType] = None
    frequency: Optional[Frequency] = None
    start_date: Optional[datetime] = None
    end_date: Optional[date] = None


class CardSummary(BaseModel):
    id: int
    card_number_masked: str
    card_type_id: int

    model_config = ConfigDict(from_attributes=True)


class RecurringTransactionSummary(BaseModel):
    id: int
    frequency: Frequency
    start_date: Optional[datetime] = None
    next_run_at: Optional[datetime] = None
    end_date: Optional[date] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class TransactionTemplateResponse(TransactionTemplateBase):
    id: int
    user_id: int
    card: Optional[CardSummary] = None
    recurring_transactions: List[RecurringTransactionSummary] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)