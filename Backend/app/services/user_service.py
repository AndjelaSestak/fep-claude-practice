from app.utils.security import verify_password, get_password_hash
from app.schemas.user import UserPasswordUpdate, UserUpdate
from app.utils.errors import DatabaseTransactionError, UserNotFoundError, BadRequestError
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.user import User


def get_all_users(db: Session) -> list[User]:

    return db.query(User).filter(User.is_deleted == False).all()
    """
    query = db.query(User)
    query = query.filter(User.is_deleted == False)
    users = query.all()
    if not users:
        raise UserNotFoundError("No users found in the database")
    return users 
    """

def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise UserNotFoundError(f"User with id {user_id} not found") 
    return user

def delete_current_user(db: Session, current_user: User) -> None:
    if current_user.wallet:
        current_user.wallet.is_active = False

    current_user.is_deleted = True
    try:
     db.commit()
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while deleting user. Please try again.")

def update_current_user(db: Session, current_user: User, user_data: UserUpdate) -> User:

    for key, value in user_data.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    
    try:
        db.commit()
        db.refresh(current_user)
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while updating user. Please try again.")
    return current_user

def change_password(db: Session, current_user: User, user_password_update: UserPasswordUpdate) -> User:
   
    if not verify_password(user_password_update.current_password, current_user.password_hash):
        raise BadRequestError("Current password is incorrect")

    hashed_new_password = get_password_hash(user_password_update.new_password)
    current_user.password_hash = hashed_new_password
    try:
        db.commit()
        db.refresh(current_user)
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while changing password. Please try again.")
    return current_user
