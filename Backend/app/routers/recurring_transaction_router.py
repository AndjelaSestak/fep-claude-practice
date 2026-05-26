from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_db
from app.models.user import User
from app.repositories.card_repository import CardRepository
from app.repositories.recurring_transaction_repository import (
    RecurringTransactionRepository,
)
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.wallet_repository import WalletRepository
from app.services.recurring_transaction_service import (
    RecurringTransactionService,
)
from app.utils.permissions import AsyncRequireRole

router = APIRouter(prefix="/recurring_transactions", tags=["Recurring Transactions"])

require_user = AsyncRequireRole(["user"])


def get_recurring_transaction_service(
    db: AsyncSession = Depends(get_async_db),
) -> RecurringTransactionService:
    return RecurringTransactionService(
        recurring_transaction_repository=RecurringTransactionRepository(db),
        transaction_repository=TransactionRepository(db),
        wallet_repository=WalletRepository(db),
        card_repository=CardRepository(db),
    )


@router.patch("/{recurring_transaction_id}/cancel")
async def cancel_recurring_transaction_route(
    recurring_transaction_id: int,
    current_user: User = Depends(require_user),
    service: RecurringTransactionService = Depends(get_recurring_transaction_service),
):
    await service.set_recurring_transaction_status(
        recurring_transaction_id=recurring_transaction_id,
        user_id=current_user.id,
        is_active=False,
    )
    return {"detail": "Recurring transaction has been successfully cancelled."}


@router.patch("/{recurring_transaction_id}/activate")
async def activate_recurring_transaction_route(
    recurring_transaction_id: int,
    current_user: User = Depends(require_user),
    service: RecurringTransactionService = Depends(get_recurring_transaction_service),
):
    await service.set_recurring_transaction_status(
        recurring_transaction_id=recurring_transaction_id,
        user_id=current_user.id,
        is_active=True,
    )
    return {"detail": "Recurring transaction has been successfully activated."}
