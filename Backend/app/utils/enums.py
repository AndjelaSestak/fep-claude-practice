import enum
from typing import Optional

from pydantic import BaseModel


class TransactionType(str, enum.Enum):
    recurring = "recurring"
    single = "single"
    all = "all"


class TransactionStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"


class TransactionDirection(str, enum.Enum):
    incoming = "incoming"
    outgoing = "outgoing"
    all = "all"


class ReportType(str, enum.Enum):
    lost = "lost"
    stolen = "stolen"
    manual_block = "manual_block"
    admin_block = "admin_block"


class CardStatus(str, enum.Enum):
    active = "active"
    blocked = "blocked"
    expired = "expired"
    reported_lost = "reported_lost"
    reported_stolen = "reported_stolen"


class VerificationPurpose(str, enum.Enum):
    registration = "registration"
    password_reset = "password_reset"
    card_verification = "card_verification"
    card_report = "card_report"


class Frequency(str, enum.Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"


class TransactionFilterParams(BaseModel):
    search: Optional[str] = None
    type: TransactionType = TransactionType.single
    direction: TransactionDirection = TransactionDirection.all
    period: Optional[str] = None
    limit: int = 10
    offset: int = 0
