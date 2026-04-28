import sys
import os
from datetime import date, timezone, datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.role import Role
from app.models.user import User
from app.models.card_type import CardType
from app.models.wallet import Wallet
from app.models.card import Card, CardStatus
from app.models.transaction import Transaction, TransactionType, TransactionStatus, TransactionDirection
from app.utils.security import get_password_hash

IBAN_TEST = "RS359080000000000002"
IBAN_JANE = "RS359080000000000003"

def seed():
    db = SessionLocal()
    try:
        # ── 1. Roles ─────────────────────────────────────────────────────────
        for role_data in [
            {"name": "admin",   "description": "Administrator role with full access"},
            {"name": "user",    "description": "Standard user role"},
            {"name": "visitor", "description": "Visitor role with limited access"},
        ]:
            if not db.query(Role).filter(Role.name == role_data["name"]).first():
                db.add(Role(**role_data))
                print(f"Role '{role_data['name']}' added.")
        db.commit()

        # ── 2. Users ─────────────────────────────────────────────────────────
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        user_role  = db.query(Role).filter(Role.name == "user").first()

        if admin_role and user_role:
            for u_data in [
                {
                    "name": "Admin User", "email": "admin@example.com",
                    "password_hash": get_password_hash("password123"),
                    "role_id": admin_role.id,
                    "city": "Novi Sad", "address": "Centar 1",
                    "date_of_birth": date(1985, 3, 10),
                    "is_email_verified": True,   # must be True to allow login
                    "is_deleted": False,
                },
                {
                    "name": "Test User", "email": "user@example.com",
                    "password_hash": get_password_hash("password123"),
                    "role_id": user_role.id,
                    "city": "Beograd", "address": "Bulevar 2",
                    "date_of_birth": date(1990, 5, 15),
                    "is_email_verified": True,
                    "is_deleted": False,
                },
                {
                    "name": "Jane Doe", "email": "jane@example.com",
                    "password_hash": get_password_hash("password123"),
                    "role_id": user_role.id,
                    "city": "Nis", "address": "Glavna 3",
                    "date_of_birth": date(1995, 10, 20),
                    "is_email_verified": True,
                    "is_deleted": False,
                },
            ]:
                if not db.query(User).filter(User.email == u_data["email"]).first():
                    db.add(User(**u_data))
                    print(f"User '{u_data['email']}' added.")
            db.commit()

        # ── 3. Card Types ─────────────────────────────────────────────────────
        for ct_data in [
            {"name": "Visa"},
            {"name": "MasterCard"},
        ]:
            if not db.query(CardType).filter(CardType.name == ct_data["name"]).first():
                db.add(CardType(**ct_data))
                print(f"CardType '{ct_data['name']}' added.")
        db.commit()

        # ── 4. Wallets ────────────────────────────────────────────────────────
        test_user = db.query(User).filter(User.email == "user@example.com").first()
        jane_user = db.query(User).filter(User.email == "jane@example.com").first()

        for user, iban, balance, currency in [
            (test_user,  IBAN_TEST,  5000.00,  "RSD"),
            (jane_user,  IBAN_JANE,  12000.00, "RSD"),
        ]:
            if user and not db.query(Wallet).filter(Wallet.user_id == user.id).first():
                db.add(Wallet(
                    user_id=user.id,
                    balance=balance,
                    account_number=iban,
                    currency=currency,
                ))
                print(f"Wallet for '{user.email}' added ({iban}).")
        db.commit()

        # ── 5. Cards ──────────────────────────────────────────────────────────
        visa_type   = db.query(CardType).filter(CardType.name == "Visa").first()
        master_type = db.query(CardType).filter(CardType.name == "MasterCard").first()
        test_wallet = db.query(Wallet).filter(Wallet.user_id == test_user.id).first() if test_user else None
        jane_wallet = db.query(Wallet).filter(Wallet.user_id == jane_user.id).first() if jane_user else None

        if test_user and jane_user and visa_type and master_type and test_wallet and jane_wallet:
            for c_data in [
                {
                    "user_id": test_user.id, "card_type_id": master_type.id,
                    "wallet_id": test_wallet.id,
                    "card_number_masked": "**** **** **** 5678",
                    "cardholder_name": "TEST USER",
                    "expiry_month": 4, "expiry_year": 2030,
                    "status": CardStatus.active,
                    "card_pin": get_password_hash("1234"),
                    "is_email_verified": True,
                    "is_deleted": False,
                },
                {
                    "user_id": jane_user.id, "card_type_id": visa_type.id,
                    "wallet_id": jane_wallet.id,
                    "card_number_masked": "**** **** **** 9012",
                    "cardholder_name": "JANE DOE",
                    "expiry_month": 4, "expiry_year": 2030,
                    "status": CardStatus.active,
                    "card_pin": get_password_hash("4321"),
                    "is_email_verified": True,
                    "is_deleted": False,
                },
            ]:
                if not db.query(Card).filter(Card.card_number_masked == c_data["card_number_masked"]).first():
                    db.add(Card(**c_data))
                    print(f"Card '**** {c_data['card_number_masked'][-4:]}' added for '{c_data['cardholder_name']}'.")
            db.commit()

        # ── 6. Transactions ───────────────────────────────────────────────────
        test_card = db.query(Card).filter(Card.card_number_masked == "**** **** **** 5678").first()
        jane_card = db.query(Card).filter(Card.card_number_masked == "**** **** **** 9012").first()

        if test_user and jane_user and test_card and jane_card and test_wallet and jane_wallet:
            if db.query(Transaction).count() == 0:
                for t_data in [
                    {
                        "user_id": test_user.id, "card_id": test_card.id,
                        "type": TransactionType.single, "amount": 250.0, "currency": "RSD",
                        "recipient": "Online Store",
                        "recipient_account_number": "RS359080000000000099",
                        "sender": "Test User",
                        "sender_account_number": test_wallet.account_number,
                        "reference": "Order #12345",
                        "status": TransactionStatus.completed,
                        "direction": TransactionDirection.outgoing,
                    },
                    {
                        "user_id": jane_user.id, "card_id": jane_card.id,
                        "type": TransactionType.single, "amount": 150.0, "currency": "RSD",
                        "recipient": "Restaurant",
                        "recipient_account_number": "RS359080000000000098",
                        "sender": "Jane Doe",
                        "sender_account_number": jane_wallet.account_number,
                        "reference": "Dinner with friends",
                        "status": TransactionStatus.completed,
                        "direction": TransactionDirection.outgoing,
                    },
                    {
                        "user_id": test_user.id, "card_id": test_card.id,
                        "type": TransactionType.single, "amount": 3000.0, "currency": "RSD",
                        "recipient": "Test User",
                        "recipient_account_number": test_wallet.account_number,
                        "sender": "Jane Doe",
                        "sender_account_number": jane_wallet.account_number,
                        "reference": "Rent payment",
                        "status": TransactionStatus.completed,
                        "direction": TransactionDirection.incoming,
                    },
                ]:
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
