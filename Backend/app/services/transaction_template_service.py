from sqlalchemy.orm import Session
from app.models.transaction_template import TransactionTemplate
from app.models.user import User
from app.schemas.transaction_template import TransactionTemplateCreate, TransactionTemplateUpdate
from app.models.transaction import TransactionType
from app.utils.errors import TemplateNotFoundError, TemplateExecutionError
from fastapi import BackgroundTasks
from app.schemas.transaction import CreateTransactionRequest
from app.services import recurring_transaction_service, transaction_service

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
    db.add(template)
    db.commit()
    db.refresh(template)

    if template.type == TransactionType.reccuring:
        recurring_transaction_service.create_recurring_transaction(
            db=db,
            template=template,
            frequency=request.frequency,
            end_date=request.end_date,
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

    # Fields that are updated directly on the TransactionTemplate model
    TEMPLATE_FIELDS = {"name", "amount", "currency", "recipient", "recipient_account_number", "card_id", "reference", "type"}

    # Fields that belong to the recurring schedule (handled by colleague)
    RECURRING_FIELDS = {"frequency", "start_date", "end_date"}

    update_data = request.model_dump(exclude_unset=True)

    # Update fields on the template itself
    for key, value in update_data.items():
        if key in TEMPLATE_FIELDS:
            setattr(template, key, value)

    db.commit()
    db.refresh(template)

    # ---------------------------------------------------------------------------
    # TODO: Uncomment when colleague implements recurring transaction service
    #
    # Recurring schedule fields from the update request:
    # recurring_update = {k: v for k, v in update_data.items() if k in RECURRING_FIELDS}
    #
    # If the template is "recurring" and recurring fields are provided, update the schedule:
    # if template.type == TransactionType.reccuring and recurring_update:
    #     from app.services import recurring_transaction_service
    #     recurring_transaction_service.update_recurring_schedule(
    #         db=db,
    #         template=template,                      # Pass the full object
    #         frequency=recurring_update.get("frequency"),
    #         start_date=recurring_update.get("start_date"),
    #         end_date=recurring_update.get("end_date")
    #     )
    # ---------------------------------------------------------------------------

    return template

def delete_template(db: Session, template_id: int, current_user: User):
    template = get_template_by_id(db, template_id, current_user)
    template.is_deleted = True
    db.commit()
    db.refresh(template)

def execute_template(db: Session, template_id: int, current_user: User, background_tasks: BackgroundTasks):
    template = get_template_by_id(db, template_id, current_user)

    if template.type == TransactionType.reccuring:
        raise TemplateExecutionError("Recurring templates are executed automatically via scheduler.")

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
