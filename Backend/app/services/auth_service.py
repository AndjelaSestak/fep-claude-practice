from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

import random
from app.models.user import User
from app.models.role import Role
from app.models.wallet import Wallet
from app.schemas.user import UserCreate
from app.utils.security import get_password_hash

from app.utils.errors import EmailAlreadyRegisteredError, RoleNotFoundError, DatabaseTransactionError

def register_user(db: Session, user_data: UserCreate) -> User:
    existing_user = db.query(User).filter(
        func.lower(User.email) == user_data.email.lower()
    ).first()

    if existing_user:
        raise EmailAlreadyRegisteredError("Email is already registered")

    default_role = db.query(Role).filter(Role.name == "user").first()
    if not default_role:
        raise RoleNotFoundError("Critical error: Default 'user' role is missing from the database.")
    role_id = default_role.id

    new_user = User(
        name=user_data.name,
        email=user_data.email.lower(),
        password_hash=get_password_hash(user_data.password),
        city=user_data.city,
        address=user_data.address,
        date_of_birth=user_data.date_of_birth,
        role_id=role_id
    )

    try:
        db.add(new_user)
        db.flush()

        # Create a wallet for the new user automatically
        account_number = "".join([str(random.randint(0, 9)) for _ in range(16)])
        new_wallet = Wallet(
            user_id=new_user.id,
            balance=0,
            account_number=account_number,
            currency="RSD"
        )
        db.add(new_wallet)

        db.commit()
        db.refresh(new_user)

        return new_user
    except SQLAlchemyError:
        db.rollback()
        raise DatabaseTransactionError("An error occurred while creating the account. Please try again.")