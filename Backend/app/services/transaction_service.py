from sqlalchemy.orm import Session
from app.models.transaction import Transaction, TransactionStatus, TransactionDirection, TransactionType
from app.models.card import Card, CardStatus
from app.models.wallet import Wallet
from app.models.user import User
from app.schemas.transaction import CreateTransactionRequest
from app.services.exchange_rate_service import convert_amount
from app.services.wallet_service import get_wallet_balance
from app.utils.errors import InvalidTokenError

def create_transaction(db: Session, request: CreateTransactionRequest, current_user: User) -> Transaction:

    # 1. Proveri karticu
    card = db.query(Card).filter(
        Card.id == request.card_id,
        Card.user_id == current_user.id
    ).first()

    if not card:
        raise InvalidTokenError("Card not found or does not belong to you")

    if card.status != CardStatus.active:
        raise ValueError("Card is not active")

    if not card.is_email_verified:
        raise ValueError("Card is not verified")

    # 2. Uzmi wallet
    wallet = db.query(Wallet).filter(
        Wallet.user_id == current_user.id,
        Wallet.is_active == True
    ).first()

    if not wallet:
        raise ValueError("Wallet not found")

    # 3. Konvertuj u valutu walleta
    amount_converted = convert_amount(request.amount, request.currency, wallet.currency)

    # 4. Kreiraj transakciju sa pending statusom
    transaction = Transaction(
        user_id=current_user.id,
        card_id=request.card_id,
        type=TransactionType.single,
        amount=amount_converted,
        currency=wallet.currency,
        recipient=request.recipient,
        recipient_account_number=request.recipient_account_number,
        sender=current_user.name,
        sender_account_number=wallet.account_number,
        reference=request.reference,
        status=TransactionStatus.pending,
        direction=TransactionDirection.outgoing
    )
    db.add(transaction)
    db.flush()

    # 5. Proveri balance i izvrsi transakciju
    if float(wallet.balance) < amount_converted:
        transaction.status = TransactionStatus.failed
        db.commit()
        raise ValueError("Insufficient funds")

    wallet.balance = float(wallet.balance) - amount_converted
    transaction.status = TransactionStatus.completed
    db.commit()
    db.refresh(transaction)

    return transaction