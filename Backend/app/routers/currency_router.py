from fastapi import APIRouter, Depends

from app.models.user import User
from app.services.exchange_rate_service import ExchangeRateService
from app.utils.permissions import AsyncRequireRole

router = APIRouter(prefix="/currency", tags=["Currency"])

require_user = AsyncRequireRole(["user"])


def get_exchange_rate_service() -> ExchangeRateService:
    return ExchangeRateService()


@router.get("/currencies")
async def get_currencies(
    current_user: User = Depends(require_user),
    service: ExchangeRateService = Depends(get_exchange_rate_service),
):
    return await service.get_supported_currencies()


@router.get("/exchange_rate")
async def get_exchange_rate(
    from_currency: str,
    to_currency: str,
    current_user: User = Depends(require_user),
    service: ExchangeRateService = Depends(get_exchange_rate_service),
):
    rate = await service.fetch_exchange_rate(from_currency, to_currency)
    return {"exchange_rate": rate}
