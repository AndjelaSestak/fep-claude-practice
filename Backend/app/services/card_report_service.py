from fastapi import BackgroundTasks
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.card import Card, CardStatus
from app.models.card_report import CardReport, ReportType
from app.models.user import User
from app.services.email_types import send_card_block_notification
from app.utils.errors import BadRequestError, DatabaseTransactionError


def _report_and_block_card(
    db: Session,
    card_id: int,
    background_tasks: BackgroundTasks,
    report_type: ReportType,
    new_status: CardStatus,
    current_user: User,
) -> Card:
    card = (
        db.query(Card)
        .filter(Card.id == card_id, Card.user_id == current_user.id)
        .first()
    )
    if not card:
        raise BadRequestError("Card not found")
    if card.status != CardStatus.active:
        raise BadRequestError("Only active cards can be reported or blocked")

    card_report = CardReport(
        card_id=card.id,
        user_id=card.user_id,
        report_type=report_type,
    )

    card.status = new_status
    try:
        db.add(card_report)
        db.commit()
        db.refresh(card)

    except SQLAlchemyError:
        raise DatabaseTransactionError(
            "An error occurred while reporting or blocking the card. Please try again."
        )

    background_tasks.add_task(
        send_card_block_notification,
        recipient=card.user.email,
        name=card.user.name,
        card_last_four=card.card_number_masked[-4:]
        if card.card_number_masked
        else "****",
        reason=report_type.value,
    )

    return card


def manual_block_card(
    db: Session, card_id: int, background_tasks: BackgroundTasks, current_user: User
) -> Card:
    return _report_and_block_card(
        db=db,
        card_id=card_id,
        background_tasks=background_tasks,
        report_type=ReportType.manual_block,
        new_status=CardStatus.blocked,
        current_user=current_user,
    )


def report_lost_card(
    db: Session, card_id: int, background_tasks: BackgroundTasks, current_user: User
) -> Card:
    return _report_and_block_card(
        db=db,
        card_id=card_id,
        background_tasks=background_tasks,
        report_type=ReportType.lost,
        new_status=CardStatus.reported_lost,
        current_user=current_user,
    )


def report_stolen_card(
    db: Session, card_id: int, background_tasks: BackgroundTasks, current_user: User
) -> Card:
    return _report_and_block_card(
        db=db,
        card_id=card_id,
        background_tasks=background_tasks,
        report_type=ReportType.stolen,
        new_status=CardStatus.reported_stolen,
        current_user=current_user,
    )


def manual_unblock_card(db: Session, card_id: int, current_user: User) -> Card:
    card = (
        db.query(Card)
        .filter(Card.id == card_id, Card.user_id == current_user.id)
        .first()
    )
    if not card:
        raise BadRequestError("Card not found")
    if card.status == CardStatus.active:
        raise BadRequestError("Card is already active")

    card.status = CardStatus.active
    try:
        db.commit()
        db.refresh(card)
    except SQLAlchemyError:
        raise DatabaseTransactionError(
            "An error occurred while unblocking the card. Please try again."
        )

    return card


def get_card_reports(db: Session, card_id: int, current_user: User) -> list[CardReport]:
    card = (
        db.query(Card)
        .filter(
            Card.id == card_id,
            Card.user_id == current_user.id,
            Card.is_email_verified == True,
            Card.is_deleted == False,
        )
        .first()
    )
    if not card:
        raise BadRequestError("Card not found")

    reports = db.query(CardReport).filter(CardReport.card_id == card_id).all()
    return reports
