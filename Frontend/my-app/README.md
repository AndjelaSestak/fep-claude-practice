# PaymentService — Frontend

The frontend for the **PaymentService** platform, built with React and Vite. Handles authentication, user management, payments, and transactions.

## Tech Stack

- **React 18** — UI library
- **Vite** — build tool with HMR
- **React Router v7** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Tailwind CSS v4** — utility-first styling
- **ESLint + Prettier** — linting and formatting

## Project Structure

```
src/
├── context/        # React context providers (Auth, Theme)
├── features/       # Feature modules (auth, payments, transactions, users)
├── hooks/          # Custom React hooks
├── pages/          # Page-level components (Home, Login, Dashboard, NotFound)
├── router/         # Route definitions and protected route guard
├── services/       # API service layer (api.js, authService, userService)
├── store/          # Global state store and slices
└── utils/          # Constants, formatters, validators
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Authentication

The app uses JWT-based authentication. Tokens are stored in `localStorage` and automatically attached to every outgoing API request via an Axios request interceptor (`src/services/api.js`). Protected routes are enforced via `src/router/ProtectedRoute.jsx`.

## Routes

| Path         | Component     | Access    |
| ------------ | ------------- | --------- |
| `/`          | HomePage      | Public    |
| `/login`     | LoginPage     | Public    |
| `/dashboard` | DashboardPage | Protected |
| `*`          | NotFoundPage  | Public    |
