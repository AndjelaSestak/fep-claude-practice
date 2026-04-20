from sqlalchemy.orm import Session
from app.models.card import Card, CardStatus
from app.models.card_report import CardReport, ReportType

def manual_block_card(db: Session, card_id: int) -> Card:
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise ValueError("Card not found")
    if card.status == CardStatus.blocked:
        raise ValueError("Card is already blocked")
    
    card.status = CardStatus.blocked
    db.commit()
    db.refresh(card)
    return card

def manual_unblock_card(db: Session, card_id: int) -> Card:
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise ValueError("Card not found")
    if card.status == CardStatus.active:
        raise ValueError("Card is already active")
    
    card.status = CardStatus.active
    db.commit()
    db.refresh(card)
    return card
