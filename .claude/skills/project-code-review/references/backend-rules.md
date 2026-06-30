# Backend Review Rules

Use these rules only for backend changes.

Check whether the implementation:

- follows the backend `CLAUDE.md`
- keeps routers thin
- keeps business logic inside services
- keeps data access inside repositories
- reuses existing services
- reuses existing helpers
- follows the project's async patterns
- follows dependency injection patterns
- uses existing schemas
- uses existing error handling
- avoids repeated validation
- avoids repeated queries
- keeps service methods reasonably small

Flag:

- business logic inside routers
- duplicated repository logic
- duplicated helper functions
- repeated validation
- repeated queries
- oversized service methods
- inconsistent exception handling
- inconsistent project patterns
- direct database access outside the repository layer

## Backend Reuse Checklist

Always look for existing:

- services
- repositories
- helper functions
- utility functions
- schemas
- validators
- enums
- constants
- business logic
