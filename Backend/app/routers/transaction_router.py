from typing import Optional

from fastapi import APIRouter, Query, status
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models.user import User

from app.dependencies import get_db
from app.services import transaction_service
from app.services.auth_service import get_current_user
from sqlalchemy.orm import Session
from app.schemas.transaction import CreateTransactionRequest, TransactionResponse


router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("/all", status_code=status.HTTP_200_OK)
def get_all_transactions_for_user(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), search: Optional[str] = Query(None),limit: int = 10, 
    offset: int = 0,):
            transactions = transaction_service.getTransactionByUser(db, user_id=current_user.id, search=search, limit=limit, offset=offset)
            return transactions

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    request: CreateTransactionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return transaction_service.create_transaction(db=db, request=request, current_user=current_user)
