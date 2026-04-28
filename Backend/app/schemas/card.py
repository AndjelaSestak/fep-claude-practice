from pydantic import BaseModel, Field, field_validator, ConfigDict, model_validator
from datetime import datetime, timezone
from app.models.card import CardStatus


class CardCreate(BaseModel):
    card_number: str = Field(..., min_length=13, max_length=19)
    cardholder_name: str = Field(..., min_length=1, max_length=100)
    expiry_month: int = Field(...)
    expiry_year: int = Field(...)
    card_type_id: int = Field(...)
    cvv: str = Field(..., min_length=3, max_length=4)
    card_pin: str = Field(..., min_length=4, max_length=4)

    @field_validator("card_number")
    @classmethod
    def validate_card_number(cls, v):
        if not v.isdigit():
            raise ValueError("Card number must contain only digits")
        return v

    @field_validator("cardholder_name")
    @classmethod
    def validate_cardholder_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Cardholder name is required")
        return v.strip().upper()

    @field_validator("cvv")
    @classmethod
    def validate_cvv(cls, v):
        if not v.isdigit():
            raise ValueError("CVV must contain only digits")
        return v
    
    @field_validator("card_pin")
    @classmethod
    def validate_pin(cls, v):
        if not v.isdigit():
            raise ValueError("PIN must contain only digits")
        return v
    
    @field_validator("expiry_year")
    @classmethod
    def validate_expiry_year(cls, v):
        current_year = datetime.now(timezone.utc).year

        if v < current_year:
            raise ValueError("Expiry year cannot be in the past")

        if v > current_year + 20:
            raise ValueError("Expiry year is too far in the future")
        return v
    
    @field_validator("expiry_month")
    @classmethod
    def validate_expiry_month(cls, v):
        if v < 1 or v > 12:
            raise ValueError("Expiry month must be between 1 and 12")
        return v
    
    @field_validator("card_type_id")
    @classmethod
    def validate_card_type_id(cls, v):
        if v <= 0:
            raise ValueError("Please select a card type")
        return v

    @model_validator(mode="after")
    def validate_expiry_date(self):
        if self.expiry_year is None or self.expiry_month is None:
            return self
        now = datetime.now(timezone.utc)
        if self.expiry_year < now.year or (self.expiry_year == now.year and self.expiry_month < now.month):
            raise ValueError("Card has expired")
        return self


class CardVerify(BaseModel):
    card_id: int = Field(..., gt=0)
    otp_code: str = Field(..., min_length=6, max_length=6)

    @field_validator("otp_code")
    @classmethod
    def validate_otp(cls, v):
        if not v.isdigit():
            raise ValueError("OTP must contain only digits")
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
