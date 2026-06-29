# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
source venv/bin/activate
uvicorn app.main:app --reload                            # dev server
ruff check . && ruff format .                            # lint + format
mypy app/                                                # type check
alembic revision --autogenerate -m "description"         # new migration
alembic upgrade head                                     # apply migrations
```

Migrations and DB seeding (`app/seed.py`) run automatically on startup.

## Architecture

Strict layered flow — never skip layers:

```
router → service → repository → model
```

- `app/routers/` — thin route handlers; no business logic
- `app/services/` — all business logic lives here
- `app/repositories/` — all DB queries; extend `BaseRepository(AsyncSession)`
- `app/models/` — SQLAlchemy ORM models
- `app/schemas/` — Pydantic v2 request/response schemas
- `app/dependencies.py` — FastAPI DI wiring; all service construction happens here
- `app/jobs/scheduler.py` — APScheduler for recurring transactions; uses `pg_try_advisory_lock` to prevent concurrent execution

## Key Conventions

**Sessions:** Two sessions coexist — sync (`get_db`) and async (`get_async_db`). Use async for all new code. `BaseRepository` is async-only.

**Auth dependency:** Use `get_current_user_async` (not sync `get_current_user`) for all new routes.

**Queries:** Use `self.db.execute(select(...))` pattern in repositories, not `db.query()`.

**DI:** Wire new services in `dependencies.py`. Routers receive services via `Depends(get_*_service)`.

**Linting:** `ruff` (E, F, I rules) + `mypy`. Line length 88. `alembic/versions/` excluded from both.
