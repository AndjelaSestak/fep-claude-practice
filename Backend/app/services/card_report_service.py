from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from app.services.email_types import send_card_block_notification
from app.models.card import Card, CardStatus
from app.models.card_report import CardReport, ReportType

def _report_and_block_card(
    db: Session,
    card_id: int,
    background_tasks: BackgroundTasks,
    report_type: ReportType,
    new_status: CardStatus,
) -> Card:
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise ValueError("Card not found")
    if card.status != CardStatus.active:
        raise ValueError("Only active cards can be reported or blocked")
    
    card_report = CardReport(
        card_id=card.id,
        user_id=card.user_id,
        report_type=report_type,
    )
    db.add(card_report)
    
    card.status = new_status
    db.commit()
    db.refresh(card)

    background_tasks.add_task(
        send_card_block_notification,
        recipient=card.user.email,
        name=card.user.name,
        card_last_four=card.card_number_masked[-4:] if card.card_number_masked else "****",
        reason=report_type.value,
    )

    return card


def manual_block_card(db: Session, card_id: int, background_tasks: BackgroundTasks) -> Card:
    return _report_and_block_card(
        db=db,
        card_id=card_id,
        background_tasks=background_tasks,
        report_type=ReportType.manual_block, 
        new_status=CardStatus.blocked,
    )


def report_lost_card(db: Session, card_id: int, background_tasks: BackgroundTasks) -> Card:
    return _report_and_block_card(
        db=db,
        card_id=card_id,
        background_tasks=background_tasks,
        report_type=ReportType.lost,
        new_status=CardStatus.reported_lost,
    )


def report_stolen_card(db: Session, card_id: int, background_tasks: BackgroundTasks) -> Card:
    return _report_and_block_card(
        db=db,
        card_id=card_id,
        background_tasks=background_tasks,
        report_type=ReportType.stolen,
        new_status=CardStatus.reported_stolen,
    )


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
