# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server (port 5173)
npm run build        # production build
npm run lint         # ESLint — zero warnings allowed
npm run lint:fix     # auto-fix lint errors
npm run format       # Prettier
```

## Architecture

Feature-based structure under `src/`:

- `features/` — domain modules (auth, payments, transactions, users); each owns its components, hooks, and queries
- `services/` — one axios wrapper file per domain entity; all API calls live here, never inline in components
- `store/slices/` — Redux Toolkit slices for global client-side state only
- `router/` — React Router v7 config; `ProtectedRoute` wraps all authenticated pages
- `schemas/` — Zod validation schemas for forms
- `hooks/`, `components/`, `ui/`, `layout/` — shared primitives

## Key Conventions

**State split:** React Query (`@tanstack/react-query`) for server state. Redux Toolkit for client-only global state. Never use Redux to cache server-fetched data.

**HTTP client** (`src/services/api.js`): single axios instance with `withCredentials: true`. Handles silent token refresh on 401 — queues in-flight requests, retries after refresh. Do not create additional axios instances.

**Form validation:** Zod schemas go in `src/schemas/`, not co-located with components.

**API calls:** Always go through `src/services/`, not directly from components or hooks.

**Linting:** ESLint with `eslint-plugin-react-hooks` and `eslint-config-prettier`. `--max-warnings=0` — all warnings are errors in CI.
