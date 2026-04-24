from app.database import SessionLocal
from app.services import transaction_service
from app.schemas.transaction import CreateTransactionRequest
from app.models.user import User
from app.models.card import Card, CardStatus
from app.models.wallet import Wallet
import random

def run_test_seed():
    db = SessionLocal()
    try:

        
        
        # 1. PRONAĐI SEBE (Zameni email sa tvojim)
        user = db.query(User).filter(User.email == "mateja@gmail.com").first()
        print(f"Korisnikov id je {user.id}")
        if not user:
            print("Greška: Korisnik sa tim emailom nije pronađen!")
            return
        


        # 3. DOPUNI WALLET (da bi kreiranje transakcija prošlo)
        wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()
        if wallet:
            wallet.balance = 500000.00  # Dajemo ti 500k da imaš za testiranje
            db.commit()
            print(f"Wallet dopunjen. Trenutni balans: {wallet.balance} {wallet.currency}")

        
        existing_card = db.query(Card).filter(Card.user_id == 12).first()
        if not existing_card:
            new_card = Card(
                user_id=12,
                card_type_id=1, # Proveri da li imas bar jedan CardType u bazi!
                wallet_id=wallet.id,
                card_number_masked="**** **** **** 9999",
                cardholder_name="MATEJA MATEJIC",
                expiry_month=12,
                expiry_year=2030,
                status=CardStatus.active,
                is_email_verified=True
            )
            db.add(new_card)
            db.commit()
            print("Kartica nije postojala, pa smo je upravo kreirali!")

        card = db.query(Card).filter(Card.user_id == user.id).first()
            
        if not card:
            print("Greška: Kartica i dalje ne postoji!")
            return

        print(f"Koristimo karticu sa ID: {card.id}")
        # 4. KREIRAJ 15 TRANSAKCIJA KROZ KOLEGIN SERVIS
        print("Pokrećem kreiranje transakcija...")
        for i in range(15):
            # Pravimo Request objekat koji šema zahteva
            req = CreateTransactionRequest(
                card_id=card.id,
                amount=random.uniform(100.0, 1000.0),
                currency="RSD",
                recipient=f"Prodavnica Br. {i+1}",
                recipient_account_number=f"160-0000000000{i+1}-55",
                reference=f"Plaćanje-računa-{i+1}"
            )

            # Pozivamo kolegino rješenje
            # On očekuje (db, request, current_user)
            transaction_service.create_transaction(db, req, user)
            print(f"Kreirana transakcija {i+1}/15")

        print("\n--- TEST USPEŠAN ---")
        print(f"Ubacili smo 15 transakcija za korisnika: {user.email}")
        print("Sada osveži Frontend stranicu!")

    except Exception as e:
        print(f"\n--- GREŠKA ---")
        print(str(e))
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_test_seed()