from sqlalchemy.orm import Session
from app.models.user import User
from app.models.wallet import Wallet
from app.utils.errors import  WalletNotFoundError

def get_wallet_balance(db: Session, current_user: User) -> dict[str, float | str]:
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id, Wallet.is_active == True).first()
    if not wallet:
        raise WalletNotFoundError("Active wallet not found for the user")
    return {
        "balance": float(wallet.balance),
        "currency": wallet.currency,
        "account_number": wallet.account_number,
    }