from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.permissions import RequireRole
from app.models.user import User
from app.services.wallet_service import get_wallet_balance
from app.dependencies import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/wallet", tags=["Wallet"])

require_user = RequireRole(["user"])

@router.get("/me/balance")
def get_current_wallet_balance(
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    return get_wallet_balance(db, current_user)
