from sqlalchemy.orm import Session
from app.schemas.recurring_transaction import RecurringTransactionUpdate
from app.models.transaction_template import TransactionTemplate
from app.models.card import Card
from app.models.user import User
from app.schemas.transaction_template import TransactionTemplateCreate, TransactionTemplateUpdate
from app.models.transaction import TransactionType
from app.utils.security import verify_password
from app.models.recurring_transaction import RecurringTransaction
from app.utils.errors import DatabaseTransactionError, TemplateNotFoundError, TemplateExecutionError,InvalidPinError
from fastapi import BackgroundTasks
from app.schemas.transaction import CreateTransactionRequest
from app.services import recurring_transaction_service, transaction_service
from sqlalchemy.exc import SQLAlchemyError

def create_template(db: Session, request: TransactionTemplateCreate, current_user: User) -> TransactionTemplate:
    template = TransactionTemplate(
        user_id=current_user.id,
        name=request.name,
        type=request.type,
        amount=request.amount,
        currency=request.currency,
        recipient=request.recipient,
        recipient_account_number=request.recipient_account_number,
        card_id=request.card_id,
        reference=request.reference
    )
    try:
        db.add(template)
        db.commit()
        db.refresh(template)
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while creating template. Please try again.")

    if template.type == TransactionType.recurring:
        recurring_transaction_service.create_recurring_transaction(
            db=db,
            template=template,
            frequency=request.frequency,
            end_date=request.end_date,
            start_date=request.start_date

        )

    return template

def get_templates(db: Session, current_user: User):
    return db.query(TransactionTemplate).filter(
        TransactionTemplate.user_id == current_user.id,
        TransactionTemplate.is_deleted == False
    ).all()

def get_template_by_id(db: Session, template_id: int, current_user: User) -> TransactionTemplate:
    template = db.query(TransactionTemplate).filter(
        TransactionTemplate.id == template_id,
        TransactionTemplate.user_id == current_user.id,
        TransactionTemplate.is_deleted == False
    ).first()
    if not template:
        raise TemplateNotFoundError("Template not found")
    return template

def update_template(db: Session, template_id: int, request: TransactionTemplateUpdate, current_user: User) -> TransactionTemplate:
    template = get_template_by_id(db, template_id, current_user)

    TEMPLATE_FIELDS = {"name", "amount", "currency", "recipient", "recipient_account_number", "card_id", "reference"}

    RECURRING_FIELDS = {"frequency", "start_date", "end_date"}

    update_data = request.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key in TEMPLATE_FIELDS:
            setattr(template, key, value)

    recurring_update = {k: v for k, v in update_data.items() if k in RECURRING_FIELDS}
    
    if template.type == TransactionType.recurring and recurring_update:
        recurring_transactions = db.query(RecurringTransaction).filter(
            RecurringTransaction.transaction_template_id == template.id,
            RecurringTransaction.is_active == True
        ).all()

        if not recurring_transactions:
            raise TemplateNotFoundError("Recurring transaction not found")

        if len(recurring_transactions) > 1:
            raise TemplateExecutionError("Multiple active recurring transactions found for this template")

        recurring_transaction = recurring_transactions[0]
        
        recurring_transaction_service.update_recurring_transaction(
            db=db,
            recurring_transaction_id=recurring_transaction.id,
            request=RecurringTransactionUpdate(**recurring_update),
            current_user=current_user
        )

    try:
        db.commit()
        db.refresh(template)
    except SQLAlchemyError:
        raise DatabaseTransactionError("Failed to update template due to a database error.")

    return template


def delete_template(db: Session, template_id: int, current_user: User):
    template = get_template_by_id(db, template_id, current_user)
    for recurring in template.recurring_transactions:
        if recurring.is_active: 
            recurring.is_active = False
    template.is_deleted = True

    try:
        db.commit()
        db.refresh(template)
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while deleting template. Please try again.")

def execute_template(db: Session, template_id: int, current_user: User, background_tasks: BackgroundTasks, pin: str):
    template = get_template_by_id(db, template_id, current_user)

    if template.type == TransactionType.recurring:
        raise TemplateExecutionError("Recurring templates are executed automatically via scheduler.")

    card = db.query(Card).filter(Card.id == template.card_id, Card.user_id == current_user.id).first()
    if not card or not verify_password(pin, card.card_pin):
        raise InvalidPinError("Incorrect PIN")

    transaction_request = CreateTransactionRequest(
        card_id=template.card_id,
        amount=float(template.amount),
        currency=template.currency,
        recipient=template.recipient,
        recipient_account_number=template.recipient_account_number,
        reference=template.reference
    )

    transaction = transaction_service.create_transaction(db=db, request=transaction_request, current_user=current_user)
    background_tasks.add_task(transaction_service.process_transaction, transaction.id)
    return transaction
