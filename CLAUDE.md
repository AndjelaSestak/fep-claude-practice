# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

Monorepo with three independent services sharing one PostgreSQL database:

```
Backend/          # FastAPI REST API (port 8000)
Frontend/my-app/  # React + Vite SPA (port 5173)
Admin/            # Django admin panel (port 8000 — conflicts with Backend)
```

Each service has its own `venv` / `node_modules` and its own `.env`. See the service-level CLAUDE.md for stack-specific conventions.

## Commit Conventions

Format: `type(scope): short description`

**Types:** `feat` | `fix` | `chore`  
**Scopes:** `(fe)` for frontend, `(be)` for backend — omit for repo-wide changes

Rules: single line, lowercase after colon, no period, under 72 characters, describe *what* changed not *that* it changed.

Examples:
```
feat(be): add recurring transaction filtering by date range
fix(fe): prevent double-submit on payment form
chore: update npm dependencies
```

## Cross-Cutting Rules

- Auth uses HTTP-only cookies (`access_token`), not `Authorization` headers — applies to both Backend and Frontend
- Each service manages its own DB migrations; never cross-import between services
- Backend and Admin share the same PostgreSQL database but run independently
