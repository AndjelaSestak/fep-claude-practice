# Frontend Review Rules

Use these rules only for frontend changes.

Check whether the implementation:

- follows the frontend `CLAUDE.md`
- reuses existing components
- reuses existing hooks
- reuses existing CSS or Tailwind patterns
- follows existing page structure
- follows existing React Query patterns
- separates UI from business logic
- keeps components focused
- avoids duplicated JSX
- avoids duplicated styling
- avoids duplicated API logic
- uses existing formatting helpers
- uses existing validation patterns
- follows existing naming conventions

Flag:

- duplicated JSX
- duplicated styling
- duplicated business logic
- inline styles when shared styles exist
- components doing too many things
- unnecessary wrapper components
- unnecessary `useMemo`
- unnecessary `useCallback`
- unnecessary `useEffect`

## Frontend Reuse Checklist

Always look for existing:

- React hooks
- reusable components
- shared layouts
- CSS classes
- Tailwind patterns
- API clients
- mapping functions
- formatting helpers
- validators
- schemas
- types
