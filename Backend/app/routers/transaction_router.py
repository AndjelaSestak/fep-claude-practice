from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.services import transaction_service
from app.schemas.transaction import CreateTransactionRequest, TransactionResponse
from app.services.auth_service import get_current_user
from app.dependencies import get_db

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    request: CreateTransactionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return transaction_service.create_transaction(db=db, request=request, current_user=current_user)