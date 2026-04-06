from sqlalchemy import Integer, Numeric, String, Text, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
import enum
from app.database import Base

class TransactionType(str, enum.Enum):
   reccuring = "reccuring"
   single = "single"

class TransactionStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"

class TransactionDirection(str, enum.Enum):
    incoming = "incoming"
    outgoing = "outgoing"

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"))
    type: Mapped[TransactionType] = mapped_column(Enum(TransactionType), default = TransactionType.single)
    amount: Mapped[float] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="RSD")
    recipient: Mapped[str] = mapped_column(Text, nullable=True)
    recipient_account_number: Mapped[str] = mapped_column(Text, nullable=True)
    sender: Mapped[str] = mapped_column(Text, nullable=True)
    sender_account_number: Mapped[str] = mapped_column(Text, nullable=True)
    reference: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[TransactionStatus] = mapped_column(Enum(TransactionStatus), default=TransactionStatus.pending)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
    direction: Mapped[TransactionDirection] = mapped_column(Enum(TransactionDirection))
    recurring_transaction_id: Mapped[int] = mapped_column(Integer, ForeignKey("recurring_transactions.id"), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="transactions")
    card: Mapped["Card"] = relationship("Card", back_populates="transactions")
    recurring_transaction: Mapped["RecurringTransaction"] = relationship("RecurringTransaction", back_populates="transactions")