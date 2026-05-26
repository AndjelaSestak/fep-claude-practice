from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_db
from app.models.user import User
from app.repositories.card_repository import CardRepository
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.wallet_repository import WalletRepository
from app.schemas.transaction import CreateTransactionRequest, TransactionResponse
from app.services.exchange_rate_service import get_supported_currencies
from app.services.transaction_service import TransactionService
from app.utils.enums import TransactionFilterParams
from app.utils.permissions import AsyncRequireRole

router = APIRouter(prefix="/transactions", tags=["Transactions"])

require_user = AsyncRequireRole(["user"])


def get_transaction_service(
    db: AsyncSession = Depends(get_async_db),
) -> TransactionService:
    return TransactionService(
        transaction_repository=TransactionRepository(db),
        wallet_repository=WalletRepository(db),
        card_repository=CardRepository(db),
    )


@router.get("/currencies", status_code=status.HTTP_200_OK)
def get_currencies(current_user: User = Depends(require_user)):
    return get_supported_currencies()


@router.get(
    "/", response_model=list[TransactionResponse], status_code=status.HTTP_200_OK
)
async def get_all_transactions_for_user(
    filters: Annotated[TransactionFilterParams, Query()],
    current_user: User = Depends(require_user),
    service: TransactionService = Depends(get_transaction_service),
):
    return await service.get_transactions_by_user(
        user_id=current_user.id,
        search=filters.search,
        type=filters.type,
        direction=filters.direction,
        limit=filters.limit,
        offset=filters.offset,
    )


@router.post(
    "", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED
)
async def create_transaction(
    request: CreateTransactionRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_user),
    service: TransactionService = Depends(get_transaction_service),
):
    transaction = await service.create_transaction(
        request=request, current_user=current_user
    )
    background_tasks.add_task(service.process_transaction, transaction.id)
    return transaction


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def read_transaction(
    transaction_id: int,
    current_user: User = Depends(require_user),
    service: TransactionService = Depends(get_transaction_service),
):
    return await service.get_transaction_by_id(
        transaction_id=transaction_id, user_id=current_user.id
    )


@router.delete("/{transaction_id}", response_model=TransactionResponse)
async def cancel_transaction(
    transaction_id: int,
    current_user: User = Depends(require_user),
    service: TransactionService = Depends(get_transaction_service),
):
    return await service.cancel_transaction(
        transaction_id=transaction_id, current_user=current_user
    )
