from fastapi import APIRouter, Depends
from app.repositories.wallet_repository import WalletRepository
from app.models.user import User
from app.services.wallet_service import WalletService
from app.dependencies import get_async_db
from app.utils.permissions import AsyncRequireRole
from sqlalchemy.ext.asyncio import AsyncSession
router = APIRouter(prefix="/wallet", tags=["Wallet"])

require_user = AsyncRequireRole(["user"])

def get_wallet_service(
        db: AsyncSession = Depends(get_async_db)
) -> WalletService:
    return WalletService(
        wallet_repository=WalletRepository(db),
    )

@router.get("/me/balance")
async def get_current_wallet_balance(
    current_user: User = Depends(require_user),
    service: WalletService = Depends(get_wallet_service)
):
    return await service.get_wallet_balance(current_user)
