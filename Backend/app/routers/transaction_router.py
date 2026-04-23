from typing import Optional

from fastapi import APIRouter, Query, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session
from app.utils.errors import TransactionNotFoundError
from app.models.user import User

from app.dependencies import get_db
from app.services import transaction_service
from app.services.auth_service import get_current_user
from app.services.exchange_rate_service import get_supported_currencies
from sqlalchemy.orm import Session
from app.schemas.transaction import CreateTransactionRequest, TransactionResponse


router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("/currencies", status_code=status.HTTP_200_OK)
def get_currencies():
    return get_supported_currencies()

@router.get("/all", status_code=status.HTTP_200_OK)
def get_all_transactions_for_user(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), search: Optional[str] = Query(None),limit: int = 10, 
    offset: int = 0,):
            transactions = transaction_service.getTransactionByUser(db, user_id=current_user.id, search=search, limit=limit, offset=offset)
            return transactions

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    request: CreateTransactionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = transaction_service.create_transaction(db=db, request=request, current_user=current_user)
    background_tasks.add_task(transaction_service.process_transaction, transaction.id)
    return transaction

@router.get("/{transaction_id}", response_model=TransactionResponse)
def read_transaction(
    transaction_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
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
    current_user: User = Depends(get_current_user)
):
    return transaction_service.cancel_transaction(db=db, transaction_id=transaction_id, current_user=current_user)
