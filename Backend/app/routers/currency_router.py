from fastapi import APIRouter

from app.services.exchange_rate_service import fetch_exchange_rate, get_supported_currencies

router = APIRouter(prefix="/currency", tags=["Currency"])


@router.get("/currencies")
def get_currencies():
    return get_supported_currencies()


@router.get("/exchange-rate")
def get_exchange_rate(from_currency: str, to_currency: str):
    rate = fetch_exchange_rate(from_currency, to_currency)
    return {"exchange_rate": rate}
