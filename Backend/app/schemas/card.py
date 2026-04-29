from typing import Optional

from pydantic import BaseModel, Field, computed_field, field_validator, ConfigDict, model_validator
from datetime import datetime, timezone
from app.models.card import CardStatus


# Minimal wallet projection used only inside CardResponse to expose account_number
# without touching the Card model or making an extra service call.
class _WalletBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    account_number: str


class CardCreate(BaseModel):
    cardholder_name: str = Field(..., min_length=1, max_length=100)
    card_type_id: int = Field(...)

    @field_validator("cardholder_name")
    @classmethod
    def validate_cardholder_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Cardholder name is required")
        return v.strip().upper()

    @field_validator("card_type_id")
    @classmethod
    def validate_card_type_id(cls, v):
        if v <= 0:
            raise ValueError("Please select a card type")
        return v


class CardVerify(BaseModel):
    card_id: int = Field(..., gt=0)
    otp_code: str = Field(..., min_length=6, max_length=6)

    @field_validator("otp_code")
    @classmethod
    def validate_otp(cls, v):
        if not v.isdigit():
            raise ValueError("OTP must contain only digits")
        return v


class CardPinVerify(BaseModel):
    card_id: int = Field(..., gt=0)
    pin: str = Field(..., min_length=4, max_length=4)

    @field_validator("pin")
    @classmethod
    def validate_pin(cls, v):
        if not v.isdigit():
            raise ValueError("PIN must contain only digits")
        return v


class CardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    card_type_id: int
    wallet_id: int
    card_number_masked: str
    cardholder_name: str
    expiry_month: int
    expiry_year: int
    status: CardStatus
    is_email_verified: bool
    is_deleted: bool
    created_at: datetime

    # Pydantic reads `wallet` from the ORM relationship (from_attributes=True),
    # but exclude=True keeps it out of the JSON response.
    wallet: Optional[_WalletBrief] = Field(default=None, exclude=True)

    @computed_field
    @property
    def account_number(self) -> str | None:
        return self.wallet.account_number if self.wallet else None
