from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.utils.enums import Frequency, TransactionType


class TransactionTemplateBase(BaseModel):
    name: str
    amount: Decimal
    currency: str
    recipient: Optional[str] = None
    recipient_account_number: str
    card_id: int
    reference: Optional[str] = None
    type: TransactionType = TransactionType.single

    @field_validator("recipient_account_number")
    @classmethod
    def recipient_account_number_must_be_16_digits(cls, v):
        if not v.isdigit():
            raise ValueError("Recipient account number must contain only digits")
        if len(v) != 16:
            raise ValueError("Recipient account number must contain exactly 16 digits")
        return v


class TransactionTemplateCreate(TransactionTemplateBase):
    frequency: Optional[Frequency] = None
    start_date: Optional[datetime] = None
    end_date: Optional[date] = None

    @model_validator(mode="after")
    def validate_recurring_fields(self):
        if self.type == TransactionType.recurring:
            if not self.frequency or not self.start_date:
                raise ValueError(
                    "Frequency and start date are required for recurring transactions."
                )
        return self


class ExecuteTemplateRequest(BaseModel):
    pin: str = Field(..., min_length=4, max_length=4)

    @field_validator("pin")
    @classmethod
    def validate_pin(cls, v):
        if not v.isdigit():
            raise ValueError("PIN must contain only digits")
        return v


class TransactionTemplateUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[Decimal] = None
    currency: Optional[str] = None
    recipient: Optional[str] = None
    recipient_account_number: Optional[str] = None
    card_id: Optional[int] = None
    reference: Optional[str] = None
    frequency: Optional[Frequency] = None
    start_date: Optional[datetime] = None
    end_date: Optional[date] = None

    @field_validator("recipient_account_number")
    @classmethod
    def recipient_account_number_must_be_16_digits(cls, v):
        if v is None:
            return v
        if not v.isdigit():
            raise ValueError("Recipient account number must contain only digits")
        if len(v) != 16:
            raise ValueError("Recipient account number must contain exactly 16 digits")
        return v


class CardTypeSummary(BaseModel):
    name: str

    model_config = ConfigDict(from_attributes=True)


class CardSummary(BaseModel):
    id: int
    card_number_masked: str
    card_type_id: int
    card_type: Optional[CardTypeSummary] = None

    model_config = ConfigDict(from_attributes=True)


class RecurringTransactionSummary(BaseModel):
    id: int
    frequency: Frequency
    start_date: Optional[date] = None
    next_run_at: Optional[datetime] = None
    end_date: Optional[date] = None
    is_active: bool
    has_executed_transactions: bool = False

    model_config = ConfigDict(from_attributes=True)


class TransactionTemplateResponse(TransactionTemplateBase):
    id: int
    user_id: int
    card: Optional[CardSummary] = None
    recurring_transactions: List[RecurringTransactionSummary] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
