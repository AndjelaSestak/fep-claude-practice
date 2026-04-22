# Project: SecureBank

## Rules
- Never edit files without explicit user permission
- Always show proposed changes and wait for approval
- Never run terminal commands without asking first

## Tech Stack
### Backend
- Python, FastAPI, SQLAlchemy, Alembic
- PostgreSQL (local: payment_service)
- JWT authentication with HttpOnly cookies
- bcrypt for password hashing

### Frontend
- React, JavaScript, Vite
- Tailwind CSS
- React Router
- Axios with interceptors for auto token refresh

## Project Structure
- Backend: /Backend/app
  - models/ - SQLAlchemy modeli
  - routers/ - FastAPI ruteri
  - services/ - biznis logika
  - schemas/ - Pydantic modeli
  - utils/ - helper funkcije
- Frontend: /Frontend/my-app/src
  - components/ui/ - reusable komponente
  - components/layout/ - Navbar, Footer, Sidebar
  - pages/ - stranice
  - router/ - React Router konfiguracija

## Code Style
- Backend: snake_case, type hints obavezni
- Frontend: camelCase, komponente PascalCase
- Uvek koristi reusable komponente iz components/ui/
- Uvek importuj Button iz components/ui/Button
- Uvek importuj Input iz components/ui/Input

## Git
- Branch format: broj/NazivTaska (npr. 7.1.1/CreateTransaction)
- Commit format: feature(backend): opis ili feature(frontend): opis
- Nikad ne pushuj direktno na main ili dev

## Authentication
- HttpOnly cookies za JWT tokene
- access_token: 15 min
- refresh_token: 7 dana, hashovan u bazi
- withCredentials: true na svim API pozivima

## API Naming Conventions
- Endpoints: kebab-case, plural nouns
- Never use PascalCase or verb-based endpoint names

### Transactions
- GET    /transactions
- GET    /transactions/{tx_id}
- POST   /transactions
- DELETE /transactions/{tx_id}
- GET    /transactions/export
- POST   /recurring-transactions

### Schedules
- GET    /api/schedules
- GET    /api/schedules/{schedule_id}
- PUT    /api/schedules/{schedule_id}
- DELETE /api/schedules/{schedule_id}

### Templates
- GET    /api/templates
- POST   /api/templates
- GET    /api/templates/{template_id}
- PUT    /api/templates/{template_id}
- DELETE /api/templates/{template_id}

### Rules
- Endpoint opisuje resurs (imenica), HTTP metoda opisuje akciju
- GET    = dohvati
- POST   = kreiraj
- PUT    = izmeni
- DELETE = obriši
- Akcije koje nisu CRUD: /api/cards/{id}/block, /api/cards/{id}/unblock