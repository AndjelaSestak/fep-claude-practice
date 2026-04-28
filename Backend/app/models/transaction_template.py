from decimal import Decimal
from sqlalchemy import Integer, Numeric, String, Text, DateTime, ForeignKey, Boolean, Enum
from app.models.transaction import TransactionType
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from app.database import Base

class TransactionTemplate(Base):
    __tablename__ = "transaction_templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"))
    name: Mapped[str] = mapped_column(Text)
    type: Mapped[TransactionType] = mapped_column(Enum(TransactionType), default=TransactionType.single)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="RSD")
    recipient: Mapped[str] = mapped_column(Text, nullable=True)
    recipient_account_number: Mapped[str] = mapped_column(Text)
    reference: Mapped[str] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="transaction_templates")
    card: Mapped["Card"] = relationship("Card", back_populates="transaction_templates")
    recurring_transactions: Mapped[list["RecurringTransaction"]] = relationship("RecurringTransaction", back_populates="transaction_template")
