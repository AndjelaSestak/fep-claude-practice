from app.models.transaction import Transaction
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import String

def getTransactionByUser(db: Session, user_id: int, search: Optional[str] = None, limit: int = 10, offset: int = 0,):
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Transaction.recipient.ilike(search_pattern)) |
            (Transaction.sender.ilike(search_pattern)) |
            (Transaction.amount.cast(String).ilike(search_pattern)) |
            (Transaction.type.ilike(search_pattern))
        )

    return query.order_by(Transaction.created_at.desc()).offset(offset).limit(limit).all()