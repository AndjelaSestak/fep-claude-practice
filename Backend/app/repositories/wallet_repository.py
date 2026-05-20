from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.wallet import Wallet
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError, WalletNotFoundError
from sqlalchemy.exc import SQLAlchemyError


class WalletRepository(BaseRepository[Wallet]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_wallet_by_user_id(self, user_id: int) -> Wallet | None:
        try:
            result = await self.db.execute(
                select(Wallet).where(
                    Wallet.user_id == user_id,
                    Wallet.is_active == True,
                )
            )
            wallet = result.scalar_one_or_none()
        except SQLAlchemyError:
            raise DatabaseTransactionError("An error occurred while fetching the wallet.")
        if not wallet:
            raise WalletNotFoundError("Wallet not found.")
        return wallet

    def deactivate(self, wallet: Wallet) -> Wallet:
        wallet.is_active = False
        return wallet
