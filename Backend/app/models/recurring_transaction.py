from sqlalchemy import Integer, Boolean, Date, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, date
import enum
from app.database import Base

class Frequency(str, enum.Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"

class RecurringTransaction(Base):
    __tablename__ = "recurring_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    transaction_template_id: Mapped[int] = mapped_column(Integer, ForeignKey("transaction_templates.id"))
    frequency: Mapped[Frequency] = mapped_column(Enum(Frequency))
    next_run_at: Mapped[datetime] = mapped_column(nullable=True)
    end_date: Mapped[date] = mapped_column(Date, nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    transaction_template: Mapped["TransactionTemplate"] = relationship("TransactionTemplate", back_populates="recurring_transactions")
    transactions: Mapped[list["Transaction"]] = relationship("Transaction", back_populates="recurring_transaction")