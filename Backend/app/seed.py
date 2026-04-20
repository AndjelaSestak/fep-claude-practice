import sys
import os
from datetime import date, timezone, datetime
import traceback
# Ensure app can be imported if script is run directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.role import Role
from app.models.user import User
from app.models.card_type import CardType
from app.models.wallet import Wallet
from app.models.card import Card, CardStatus
from app.models.transaction import Transaction, TransactionType, TransactionStatus, TransactionDirection
from app.utils.security import get_password_hash

def seed():
    db = SessionLocal()
    try:
        # 1. Seed Roles
        roles_to_seed = [
            {"name": "admin", "description": "Administrator role with full access"},
            {"name": "user", "description": "Standard user role"},
            {"name": "visitor", "description": "Visitor role with limited access"},
        ]
        for role_data in roles_to_seed:
            if not db.query(Role).filter(Role.name == role_data["name"]).first():
                db.add(Role(**role_data))
                print(f"Role '{role_data['name']}' added.")
        db.commit()

        # 2. Seed Users
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        user_role = db.query(Role).filter(Role.name == "user").first()
        
        if admin_role and user_role:
            users_to_seed = [
                {"name": "Admin User", "email": "admin@example.com", "password_hash": get_password_hash("password123"), "role_id": admin_role.id, "city": "Novi Sad", "address": "Centar 1", "date_of_birth": date(1985, 3, 10)},
                {"name": "Test User", "email": "user@example.com", "password_hash": get_password_hash("password123"), "role_id": user_role.id, "city": "Beograd", "address": "Bulevar 2", "date_of_birth": date(1990, 5, 15)},
                {"name": "Jane Doe", "email": "jane@example.com", "password_hash": get_password_hash("password123"), "role_id": user_role.id, "city": "Nis", "address": "Glavna 3", "date_of_birth": date(1995, 10, 20)}
            ]
            for u_data in users_to_seed:
                if not db.query(User).filter(User.email == u_data["email"]).first():
                    db.add(User(**u_data))
                    print(f"User '{u_data['email']}' added.")
            db.commit()

        # 3. Seed Card Types
        card_types_to_seed = [
            {"name": "Visa"},
            {"name": "MasterCard"},
            {"name": "American Express"}
        ]
        for ct_data in card_types_to_seed:
            if not db.query(CardType).filter(CardType.name == ct_data["name"]).first():
                db.add(CardType(**ct_data))
                print(f"CardType '{ct_data['name']}' added.")
        db.commit()

        # 4. Seed Wallets
        test_user = db.query(User).filter(User.email == "user@example.com").first()
        jane_user = db.query(User).filter(User.email == "jane@example.com").first()
        
        if test_user and jane_user:
            wallets_to_seed = [
                {"user_id": test_user.id, "balance": 5000.00, "account_number": "0987654321098765", "currency": "EUR"},
                {"user_id": jane_user.id, "balance": 12000.00, "account_number": "1122334455667788", "currency": "RSD"},
            ]
            for w_data in wallets_to_seed:
                if not db.query(Wallet).filter(Wallet.user_id == w_data["user_id"]).first():
                    db.add(Wallet(**w_data))
                    print(f"Wallet for user_id '{w_data['user_id']}' added.")
            db.commit()

        # 5. Seed Cards
        visa_type = db.query(CardType).filter(CardType.name == "Visa").first()
        master_type = db.query(CardType).filter(CardType.name == "MasterCard").first()
        test_wallet = db.query(Wallet).filter(Wallet.user_id == test_user.id).first() if test_user else None
        jane_wallet = db.query(Wallet).filter(Wallet.user_id == jane_user.id).first() if jane_user else None

        if test_user and jane_user and visa_type and master_type and test_wallet and jane_wallet:
            cards_to_seed = [
                {
                    "user_id": test_user.id, "card_type_id": master_type.id, "wallet_id": test_wallet.id,
                    "card_number_masked": "**** **** **** 5678", "cardholder_name": "Test User", 
                    "expiry_month": 10, "expiry_year": 2026, "status": CardStatus.active,
                    "card_pin": get_password_hash("1234")
                },
                {
                    "user_id": jane_user.id, "card_type_id": visa_type.id, "wallet_id": jane_wallet.id,
                    "card_number_masked": "**** **** **** 9012", "cardholder_name": "Jane Doe", 
                    "expiry_month": 8, "expiry_year": 2027, "status": CardStatus.active,
                    "card_pin": get_password_hash("4321")
                }
            ]
            for c_data in cards_to_seed:
                if not db.query(Card).filter(Card.card_number_masked == c_data["card_number_masked"]).first():
                    db.add(Card(**c_data))
                    print(f"Card ending with '{c_data['card_number_masked'][-4:]}' added.")
            db.commit()

        # 6. Seed Transactions
        test_card = db.query(Card).filter(Card.card_number_masked == "**** **** **** 5678").first()
        jane_card = db.query(Card).filter(Card.card_number_masked == "**** **** **** 9012").first()
        
        test_wallet = db.query(Wallet).filter(Wallet.user_id == test_user.id).first() if test_user else None
        jane_wallet = db.query(Wallet).filter(Wallet.user_id == jane_user.id).first() if jane_user else None

        if test_user and jane_user and test_card and jane_card and test_wallet and jane_wallet:
            if db.query(Transaction).count() == 0:
                transactions_to_seed = [
                    {
                        "user_id": test_user.id, "card_id": test_card.id, "type": TransactionType.single,
                        "amount": 250.0, "currency": "EUR", "recipient": "Online Store", 
                        "recipient_account_number": "9988776655443322",
                        "sender": "Test User", "sender_account_number": test_wallet.account_number,
                        "reference": "Order #12345",
                        "status": TransactionStatus.completed, "direction": TransactionDirection.outgoing
                    },
                    {
                        "user_id": jane_user.id, "card_id": jane_card.id, "type": TransactionType.single,
                        "amount": 150.0, "currency": "RSD", "recipient": "Restaurant", 
                        "recipient_account_number": "2233445566778899",
                        "sender": "Jane Doe", "sender_account_number": jane_wallet.account_number,
                        "reference": "Dinner with friends",
                        "status": TransactionStatus.completed, "direction": TransactionDirection.outgoing
                    }
                ]
                for t_data in transactions_to_seed:
                    db.add(Transaction(**t_data))
                db.commit()
                print("Transactions added.")

        print("Seeding completed successfully.")
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
