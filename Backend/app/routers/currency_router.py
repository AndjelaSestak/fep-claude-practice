from fastapi import APIRouter, Depends

from app.models.user import User
from app.utils.permissions import RequireRole
from app.services.exchange_rate_service import fetch_exchange_rate, get_supported_currencies

router = APIRouter(prefix="/currency", tags=["Currency"])

require_user = RequireRole(["user"])

@router.get("/currencies")
def get_currencies(current_user: User = Depends(require_user)):
    return get_supported_currencies()


@router.get("/exchange_rate")
def get_exchange_rate(from_currency: str, to_currency: str, current_user: User = Depends(require_user)):
    rate = fetch_exchange_rate(from_currency, to_currency)
    return {"exchange_rate": rate}
