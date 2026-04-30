from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.utils.permissions import RequireRole
from app.utils.errors import TransactionNotFoundError
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.recurring_transaction import RecurringTransactionBase
from app.dependencies import get_db
from app.services.recurring_transaction_service import cancel_recurring_transaction, activate_recurring_transaction
from app.models.transaction_template import TransactionTemplate


router = APIRouter(prefix="/recurring-transactions", tags=["Recurring Transactions"])

require_user = RequireRole(["user"])

@router.patch("/{recurring_transaction_id}/cancel")
def cancel_recurring_transaction_route(
    recurring_transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    cancelled_transaction = cancel_recurring_transaction(
        db=db, 
        recurring_transaction_id=recurring_transaction_id, 
        user_id=current_user.id
    )
    return {"detail": "Recurring transaction has been successfully cancelled."}

@router.patch("/{recurring_transaction_id}/activate")
def activate_recurring_transaction_route(
    recurring_transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    activated_transaction = activate_recurring_transaction(
        db=db,
        recurring_transaction_id=recurring_transaction_id,
        user_id=current_user.id
    )
    return {"detail": "Recurring transaction has been successfully activated."}
