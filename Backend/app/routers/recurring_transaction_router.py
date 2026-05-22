from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.recurring_transaction_service import set_recurring_transaction_status
from app.utils.permissions import RequireRole

router = APIRouter(prefix="/recurring_transactions", tags=["Recurring Transactions"])

require_user = RequireRole(["user"])


@router.patch("/{recurring_transaction_id}/cancel")
def cancel_recurring_transaction_route(
    recurring_transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    set_recurring_transaction_status(
        db=db,
        recurring_transaction_id=recurring_transaction_id,
        user_id=current_user.id,
        is_active=False,
    )
    return {"detail": "Recurring transaction has been successfully cancelled."}


@router.patch("/{recurring_transaction_id}/activate")
def activate_recurring_transaction_route(
    recurring_transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    set_recurring_transaction_status(
        db=db,
        recurring_transaction_id=recurring_transaction_id,
        user_id=current_user.id,
        is_active=True,
    )
    return {"detail": "Recurring transaction has been successfully activated."}
