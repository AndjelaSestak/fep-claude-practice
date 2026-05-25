from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.utils.enums import Frequency

if TYPE_CHECKING:
    from app.models.transaction import Transaction
    from app.models.transaction_template import TransactionTemplate


class RecurringTransaction(Base):
    __tablename__ = "recurring_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    transaction_template_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("transaction_templates.id")
    )
    frequency: Mapped[Frequency] = mapped_column(Enum(Frequency))
    next_run_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    end_date: Mapped[date] = mapped_column(Date, nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    transaction_template: Mapped["TransactionTemplate"] = relationship(
        "TransactionTemplate", back_populates="recurring_transactions"
    )
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="recurring_transaction"
    )

    @property
    def has_executed_transactions(self) -> bool:
        return bool(self.transactions)
