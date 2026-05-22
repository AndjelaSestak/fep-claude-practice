from pydantic import BaseModel


class WalletBalanceResponse(BaseModel):
    balance: float
    currency: str
    account_number: str
