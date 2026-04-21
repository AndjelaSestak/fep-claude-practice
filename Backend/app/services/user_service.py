from app.utils.security import verify_password, get_password_hash
from app.schemas.user import UserPasswordUpdate, UserUpdate
from app.utils.errors import UserNotFoundError
from sqlalchemy.orm import Session

from app.models.user import User


def get_all_users(db: Session) -> list[User]:
    query = db.query(User)
    query = query.filter(User.is_deleted == False)
    users = query.all()
    if not users:
        raise UserNotFoundError("No users found in the database")
    return users

def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise UserNotFoundError(f"User with id {user_id} not found") 
    return user

def delete_user_by_id(db: Session, user_id: int) -> None:
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise UserNotFoundError(f"User with id {user_id} not found")
    user.is_deleted = True
    db.commit()

def  update_user(db: Session, user_id: int, user_data: UserUpdate) -> User:
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise UserNotFoundError(f"User with id {user_id} not found")
    
    for key, value in user_data.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user

def change_password(db: Session, user_id: int, user_password_update: UserPasswordUpdate) -> User:
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise UserNotFoundError(f"User with id {user_id} not found")

    if not verify_password(user_password_update.current_password, user.password_hash):
        raise ValueError("Current password is incorrect")

    hashed_new_password = get_password_hash(user_password_update.new_password)
    user.password_hash = hashed_new_password
    db.commit()
    db.refresh(user)
    return user