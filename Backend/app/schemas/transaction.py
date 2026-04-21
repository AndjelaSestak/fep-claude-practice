from pydantic import BaseModel, field_validator
from datetime import datetime
from app.models.transaction import TransactionStatus, TransactionDirection, TransactionType
from app.services.exchange_rate_service import get_supported_currencies

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
    def currency_must_be_supported(cls, v):
        supported = [c["value"] for c in get_supported_currencies()]
        if v.upper() not in supported:
            raise ValueError(f"Currency {v} is not supported")
        return v.upper()


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