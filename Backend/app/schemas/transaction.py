from pydantic import BaseModel, field_validator
from datetime import datetime
from app.models.transaction import TransactionStatus, TransactionDirection, TransactionType

class CreateTransactionRequest(BaseModel):
    card_id: int
    amount: float
    currency: str = "RSD"
    recipient: str
    recipient_account_number: str
    reference: str | None = None

    @field_validator("amount")
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Amount must be greater than 0")
        return v

    @field_validator("currency")
    def currency_format_must_be_valid(cls, v):
        if not v or len(v) != 3:
            raise ValueError("Currency must be a 3-letter code")
        return v.upper()

    @field_validator("recipient_account_number")
    def recipient_account_number_must_be_16_digits(cls, v):
        if not v.isdigit():
            raise ValueError("Recipient account number must contain only digits")
        if len(v) != 16:
            raise ValueError("Recipient account number must contain exactly 16 digits")
        return v


class TransactionResponse(BaseModel):
    id: int
    amount: float
    currency: str
    recipient: str
    recipient_account_number: str
    sender: str
    sender_account_number: str
    reference: str | None
    status: TransactionStatus
    direction: TransactionDirection
    type: TransactionType
    created_at: datetime

    class Config:
        from_attributes = True
