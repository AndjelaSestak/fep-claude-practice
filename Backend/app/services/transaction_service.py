import asyncio
from datetime import date, timedelta
import io
import csv
from weasyprint import HTML
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
from app.utils.datetime import utc_now
from sqlalchemy.exc import SQLAlchemyError
from app.utils.errors import DatabaseTransactionError, InvalidTokenError


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
    try:
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while creating the transaction. Please try again.")
    return transaction


def complete_pending_transaction(db: Session, transaction: Transaction) -> None:
    if transaction.status != TransactionStatus.pending:
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


async def process_transaction(transaction_id: int) -> None:
    await asyncio.sleep(PENDING_DELAY_SECONDS)
    db: Session = SessionLocal()
    try:
        transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
        if not transaction:
            return
        complete_pending_transaction(db, transaction)
    except Exception:
        db.rollback()
    finally:
        db.close()


def process_expired_pending_transactions(db: Session) -> None:
    cutoff = utc_now() - timedelta(seconds=PENDING_DELAY_SECONDS)

    transactions = db.query(Transaction).filter(
        Transaction.status == TransactionStatus.pending,
        Transaction.created_at <= cutoff,
    ).all()

    for transaction in transactions:
        complete_pending_transaction(db, transaction)

    

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
    try:
        db.commit()
        db.refresh(transaction)
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while cancelling the transaction. Please try again.")

    return transaction


def get_filtered_transactions(db: Session, user_id: int, search=None, type=None, direction=None, period=None):
    
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    # 1. Filter za Period (Dashboard)
    if period == "current_month":
        from datetime import datetime, timezone
        today = datetime.now(timezone.utc)
        start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        query = query.filter(Transaction.created_at >= start_of_month)

    # 2. Filter za Search (Pretraga po recipientu, senderu ili referenci)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Transaction.recipient.ilike(search_pattern)) |
            (Transaction.sender.ilike(search_pattern)) |
            (Transaction.reference.ilike(search_pattern))
        )

    # 3. Filter za Type (single / reccuring)
    if type and type != "all":
        query = query.filter(Transaction.type == type)

    # 4. Filter za Direction (incoming / outgoing)
    if direction and direction != "all":
        query = query.filter(Transaction.direction == direction)

    results = query.order_by(Transaction.created_at.desc()).all()
    return results

    

def generate_csv_report(transactions):

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Datum", "Primalac", "Iznos", "Valuta", "Tip", "Smer"])
    
    for t in transactions:
        date_str = t.created_at.strftime("%d.%m.%Y") if t.created_at else "N/A"
        
        writer.writerow([date_str, t.recipient, t.amount, t.currency, t.type.value, t.direction.value])
    
    return output.getvalue()
    
    
def generate_pdf_report(transactions, user_email):
    if not transactions:
        # Vraćamo jednostavan PDF ili poruku ako nema podataka
        html_content = f"<html><body><h1>Nema transakcija za izabrani period</h1></body></html>"
        return HTML(string=html_content).write_pdf()
    total_in = sum(float(t.amount) for t in transactions if t.direction.value == "incoming")
    total_out = sum(float(t.amount) for t in transactions if t.direction.value == "outgoing")


    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: sans-serif; padding: 20px; color: #333; }}
            .header {{ border-bottom: 2px solid #4f46e5; margin-bottom: 20px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th {{ background: #f3f4f6; text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }}
            td {{ padding: 10px; border-bottom: 1px solid #eee; }}
            .summary {{ margin-top: 30px; border-top: 2px solid #eee; padding-top: 10px; text-align: right; }}
            .income {{ color: green; }} .expense {{ color: red; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Izveštaj transakcija</h1>
            <p>Korisnik: {user_email} | Datum: {date.today().strftime("%d.%m.%Y")}</p>
        </div>
        <table>
            <thead><tr><th>Datum</th><th>Primalac</th><th>Tip</th><th>Iznos</th></tr></thead>
            <tbody>
                {"".join([f'<tr><td>{t.created_at.strftime("%d.%m.%Y")}</td><td>{t.recipient if t.recipient else (t.sender if t.sender else "N/A")}</td><td>{t.type.value}</td><td class="{"income" if t.direction.value == "incoming" else "expense"}">{"+" if t.direction.value == "incoming" else "-"}{t.amount} {t.currency}</td></tr>' for t in transactions])}
            </tbody>
        </table>
        <div class="summary">
            <p>Ukupno uplate: <span class="income">+{total_in:.2f}</span></p>
            <p>Ukupno isplate: <span class="expense">-{total_out:.2f}</span></p>
            <p><strong>Neto razlika: {total_in - total_out:.2f}</strong></p>
        </div>
    </body>
    </html>
    """
    return HTML(string=html_content).write_pdf()
