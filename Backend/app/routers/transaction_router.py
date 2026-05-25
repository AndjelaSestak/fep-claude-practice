from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.transaction import CreateTransactionRequest, TransactionResponse
from app.services import transaction_service
from app.services.exchange_rate_service import get_supported_currencies
from app.utils.enums import TransactionFilterParams
from app.utils.errors import TransactionNotFoundError
from app.utils.permissions import RequireRole

router = APIRouter(prefix="/transactions", tags=["Transactions"])

require_user = RequireRole(["user"])


@router.get("/currencies", status_code=status.HTTP_200_OK)
def get_currencies(current_user: User = Depends(require_user)):
    return get_supported_currencies()


@router.get(
    "/", response_model=list[TransactionResponse], status_code=status.HTTP_200_OK
)
def get_all_transactions_for_user(
    filters: Annotated[TransactionFilterParams, Query()],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    transactions = transaction_service.get_transaction_by_user(
        db,
        user_id=current_user.id,
        search=filters.search,
        type=filters.type,
        direction=filters.direction,
        limit=filters.limit,
        offset=filters.offset,
    )
    return transactions


@router.post(
    "", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED
)
def create_transaction(
    request: CreateTransactionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    transaction = transaction_service.create_transaction(
        db=db, request=request, current_user=current_user
    )
    background_tasks.add_task(transaction_service.process_transaction, transaction.id)
    return transaction


@router.get("/{transaction_id}", response_model=TransactionResponse)
def read_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    db_transaction = transaction_service.get_transaction_by_id(
        db, transaction_id=transaction_id, user_id=current_user.id
    )
    if not db_transaction:
        raise TransactionNotFoundError("Transaction not found or access denied")
    return db_transaction


@router.delete("/{transaction_id}", response_model=TransactionResponse)
def cancel_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return transaction_service.cancel_transaction(
        db=db, transaction_id=transaction_id, current_user=current_user
    )
