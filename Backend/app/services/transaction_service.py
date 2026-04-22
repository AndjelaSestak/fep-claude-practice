import asyncio
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import String
from app.models.transaction import Transaction, TransactionStatus, TransactionDirection, TransactionType
from app.models.card import Card, CardStatus
from app.models.wallet import Wallet
from app.models.user import User
from app.schemas.transaction import CreateTransactionRequest
from app.services.exchange_rate_service import convert_amount
from app.database import SessionLocal
from app.utils.errors import InvalidTokenError


PENDING_DELAY_SECONDS = 180

def getTransactionByUser(db: Session, user_id: int, search: Optional[str] = None, limit: int = 10, offset: int = 0,):
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Transaction.recipient.ilike(search_pattern)) |
            (Transaction.sender.ilike(search_pattern)) |
            (Transaction.reference.ilike(search_pattern))
        )
        

    return query.order_by(Transaction.created_at.desc()).offset(offset).limit(limit).all()

def create_transaction(db: Session, request: CreateTransactionRequest, current_user: User) -> Transaction:
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

    wallet = db.query(Wallet).filter(
        Wallet.user_id == current_user.id,
        Wallet.is_active == True
    ).first()

    if not wallet:
        raise ValueError("Wallet not found")

    amount_converted = convert_amount(request.amount, request.currency, wallet.currency)

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
    db.commit()
    db.refresh(transaction)

    return transaction


async def process_transaction(transaction_id: int) -> None:
    await asyncio.sleep(PENDING_DELAY_SECONDS)

    db: Session = SessionLocal()
    try:
        transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()

        if not transaction or transaction.status != TransactionStatus.pending:
            return

        wallet = db.query(Wallet).filter(
            Wallet.user_id == transaction.user_id,
            Wallet.is_active == True
        ).first()

        if not wallet:
            transaction.status = TransactionStatus.failed
            db.commit()
            return

        if float(wallet.balance) < float(transaction.amount):
            transaction.status = TransactionStatus.failed
            db.commit()
            return

        wallet.balance = float(wallet.balance) - float(transaction.amount)
        transaction.status = TransactionStatus.completed
        db.commit()
    finally:
        db.close()

def get_transaction_by_id(db: Session, transaction_id: int, user_id: int):
    return db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == user_id
    ).first()

def cancel_transaction(db: Session, transaction_id: int, current_user: User) -> Transaction:
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()

    if not transaction:
        raise ValueError("Transaction not found")

    if transaction.status != TransactionStatus.pending:
        raise ValueError("Only pending transactions can be cancelled")

    transaction.status = TransactionStatus.cancelled
    db.commit()
    db.refresh(transaction)

    return transaction
