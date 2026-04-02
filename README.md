# PaymentService

A full-stack payment management platform consisting of three services:

| Service | Tech | Purpose |
|---------|------|---------|
| **Backend** | FastAPI + PostgreSQL | Core REST API |
| **Frontend** | React + Vite + Tailwind | User-facing SPA |
| **Admin** | Django + DRF + PostgreSQL | Admin panel & management API |

## Repository Structure

```
Commit-Pray/
├── Backend/         # FastAPI REST API
├── Frontend/
│   └── my-app/      # React + Vite frontend
└── Admin/           # Django admin panel
```

---

## Backend (FastAPI)

**Stack:** FastAPI · SQLAlchemy · Alembic · PostgreSQL · JWT · Uvicorn

### Setup

```bash
cd Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in values
alembic upgrade head
uvicorn app.main:app --reload
```

Runs on `http://localhost:8000` · Docs at `/docs`

> See [`Backend/README.md`](./Backend/README.md) for full details.

---

## Frontend (React + Vite)

**Stack:** React 18 · Vite · Tailwind CSS · React Router v7 · Axios · Redux

### Setup

```bash
cd Frontend/my-app
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

Runs on `http://localhost:5173`

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Admin (Django)

**Stack:** Django 6 · Django REST Framework · SimpleJWT · drf-spectacular · PostgreSQL

### Setup

```bash
cd Admin
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Runs on `http://localhost:8000` · Admin panel at `/admin` · API schema at `/api/schema/`

---

## Environment Variables

Each service has its own `.env.example` — copy it to `.env` and fill in the values before running.

### Backend `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/paymentservice
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM=
MAIL_SERVER=
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=PaymentService
VITE_APP_ENV=development
```

### Admin `.env`

```env
SECRET_KEY=
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@localhost:5432/paymentservice
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_USE_TLS=True
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+ / npm
- PostgreSQL
