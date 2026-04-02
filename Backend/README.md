# PaymentService — Backend

A RESTful backend API for the PaymentService application, built with **FastAPI** and **PostgreSQL**.

## Tech Stack

- **Framework:** FastAPI
- **Database:** PostgreSQL (via SQLAlchemy + psycopg2)
- **Migrations:** Alembic
- **Auth:** JWT (python-jose) + password hashing (passlib/bcrypt)
- **Email:** fastapi-mail + aiosmtplib
- **Validation:** Pydantic v2
- **Server:** Uvicorn

## Project Structure

```
Backend/
├── app/
│   ├── main.py          # FastAPI app entrypoint
│   ├── config.py        # Settings / environment config
│   ├── database.py      # SQLAlchemy engine & session
│   ├── dependencies.py  # Shared FastAPI dependencies
│   ├── routers/         # Route handlers
│   ├── models/          # SQLAlchemy ORM models
│   ├── schemas/         # Pydantic request/response schemas
│   ├── services/        # Business logic layer
│   └── utils/           # Utility helpers
├── alembic/             # Database migration scripts
├── alembic.ini          # Alembic configuration
├── tests/               # Test suite
└── requirements.txt     # Python dependencies
```

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL

### Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Backend
   ```

2. **Create and activate a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Create a `.env` file in the `Backend/` directory:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/paymentservice
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   MAIL_USERNAME=your@email.com
   MAIL_PASSWORD=your-mail-password
   MAIL_FROM=your@email.com
   MAIL_SERVER=smtp.example.com
   ```

5. **Run database migrations**

   ```bash
   alembic upgrade head
   ```

6. **Start the development server**

   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`.  
   Interactive docs: `http://localhost:8000/docs`

## Running Tests

```bash
pytest tests/
```

## API Documentation

Once the server is running, FastAPI auto-generates interactive API docs:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
