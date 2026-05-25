from app.models.user import User
from app.repositories.wallet_repository import WalletRepository
from app.schemas.wallet import WalletBalanceResponse
from app.utils.errors import WalletNotFoundError


class WalletService:
    def __init__(self, wallet_repository: WalletRepository) -> None:
        self.wallet_repository = wallet_repository

    async def get_wallet_balance(self, current_user: User) -> WalletBalanceResponse:
        wallet = await self.wallet_repository.get_wallet_by_user_id(current_user.id)
        if not wallet:
            raise WalletNotFoundError("Active wallet not found for the user.")
        return WalletBalanceResponse(
            balance=float(wallet.balance),
            currency=wallet.currency,
            account_number=wallet.account_number,
        )
