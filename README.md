# Deskline

> A support ticket platform with JWT authentication, role-based access control (admin/user), and protected routes — built with React, Express, and TypeScript.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Testing](#testing)
- [JWT Storage Justification](#jwt-storage-justification)
- [Branch Strategy](#branch-strategy)

---

## Overview

Deskline is a full-stack support desk application that lets users submit and track tickets while admins can view all tickets across all users. Access is controlled through JWT-based authentication and role-based route guards.

**Key capabilities:**
- Secure login with JWT signing and verification
- Role-based access: `user` sees own tickets, `admin` sees all tickets
- Protected client-side routes with automatic redirect to login
- Email validation utility with full test coverage
- Professional enterprise UI — white/black/blue, Inter + Space Grotesk fonts

---

## Architecture

```
┌────────────────────────┐    HTTP/JSON    ┌──────────────────────────┐
│     React Client       │ ─────────────▶ │     Express Server        │
│  (Vite + TypeScript)   │ ◀───────────── │       (Node.js)           │
│                        │  Bearer Token  │                           │
│  • AuthContext         │                │  • POST /login            │
│  • ProtectedRoute      │                │  • GET  /tickets          │
│  • Login + validation  │                │  • GET  /tickets/all      │
│  • Tickets / Admin     │                │  • JWT middleware          │
└────────────────────────┘                └──────────────────────────┘
```

### Auth Flow

```
User submits credentials
        │
        ▼
POST /login → server verifies password → signs JWT → returns { token }
        │
        ▼
Client stores token in React state (AuthContext — in-memory)
        │
        ▼
Every API call: Authorization: Bearer <token>
        │
        ▼
Server verifies token → checks role → 200 data or 403 Forbidden
```

---

## Project Structure

```
deskline/
├── .gitignore
├── README.md
│
├── server/
│   ├── index.js              # Express app: routes + JWT middleware
│   ├── package.json
│   ├── package-lock.json
│   ├── hash-passwords.js     # One-time script to pre-hash demo passwords
│   └── .env.example          # Template — copy to .env and fill in values
│
└── client/
    ├── index.html
    ├── vite.config.ts        # Vite + Vitest config
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    ├── eslint.config.js
    └── src/
        ├── main.tsx          # App entry: BrowserRouter + AuthProvider
        ├── App.tsx           # Route definitions
        ├── App.css           # CSS imports entry point
        ├── index.css         # Design tokens + global reset
        │
        ├── api/
        │   └── auth.ts               # loginRequest() — POST /login
        │
        ├── context/
        │   └── AuthContext.tsx       # JWT decode, login/logout, user state
        │
        ├── components/
        │   ├── ProtectedRoute.tsx       # Route guard
        │   └── ProtectedRoute.test.tsx  # Redirect test
        │
        ├── pages/
        │   ├── Login.tsx           # Login form with client-side validation
        │   ├── Login.test.tsx      # Form validation tests
        │   ├── Tickets.tsx         # User view — own tickets + stat cards
        │   └── Admin.tsx           # Admin view — all tickets + stat cards
        │
        ├── styles/
        │   ├── login.css       # Login page + branding panel
        │   ├── layout.css      # Navbar, app shell, page headings
        │   └── components.css  # Buttons, forms, tables, badges, stats
        │
        ├── types/
        │   └── auth.ts         # AuthUser, AuthContextType interfaces
        │
        ├── utils/
        │   ├── validateEmail.ts       # isValidEmail() utility
        │   └── validateEmail.test.ts  # 4 unit tests
        │
        └── test/
            └── setup.ts    # @testing-library/jest-dom setup
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone the repository

```bash
git clone https://github.com/preethz2567/Deskline.git
cd Deskline
```

### 2. Set up the server

```bash
cd server
cp .env.example .env        # Then edit .env to set a real JWT_SECRET
npm install
node index.js               # Starts on http://localhost:4000
```

### 3. Set up the client

```bash
cd client
npm install
npm run dev                 # Starts on http://localhost:5173
```

### 4. Open in browser

Navigate to `http://localhost:5173` and sign in with the demo credentials below.

---

## Environment Variables

Copy `server/.env.example` → `server/.env` and fill in real values.  
The `.env` file is listed in `.gitignore` and must **never** be committed.

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | ✅ | Secret key for signing/verifying JWTs. Use a long random string. |
| `PORT` | ✅ | Port the Express server listens on. Default: `4000`. |

---

## API Reference

All protected endpoints require: `Authorization: Bearer <token>`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/login` | None | Any | Accepts `{ email, password }`, returns `{ token }` |
| `GET` | `/tickets` | ✅ | user or admin | Returns the caller's own tickets |
| `GET` | `/tickets/all` | ✅ | admin only | Returns all tickets across all users |

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@deskline.com | adminpass123 |
| User | user@deskline.com | userpass123 |

---

## Testing

Tests use **Vitest** + **React Testing Library**.

```bash
cd client
npm test
```

### Test coverage

| File | Tests | What is tested |
|---|---|---|
| `validateEmail.test.ts` | 4 | Valid email, empty string, missing `@`, missing domain |
| `Login.test.tsx` | 2 | Empty email error message, invalid email format error message |
| `ProtectedRoute.test.tsx` | 1 | Unauthenticated user redirects to `/login` |

All 7 tests pass with zero configuration required beyond `npm install`.

---

## JWT Storage Justification

**Tokens are stored in React state (in-memory), not `localStorage`.**

| Approach | XSS Risk | CSRF Risk | Survives Refresh |
|---|---|---|---|
| `localStorage` |  High |  None |  Yes |
| `httpOnly` cookie |  None |  Needs CSRF token |  Yes |
| **In-memory (this app)** | ** None** | ** None** |  No |

In-memory was chosen because:
1. **XSS cannot read memory** — malicious scripts cannot steal the token
2. **No CSRF surface** — token sent via `Authorization` header, not cookies
3. **Acceptable UX trade-off** — re-login on refresh is fine for an internal support tool

For production, upgrading to an `httpOnly` cookie + CSRF token is recommended.

---


## Glimpse of it
<img width="1918" height="1020" alt="Screenshot 2026-06-29 173337" src="https://github.com/user-attachments/assets/020de82b-cd1e-4b17-816e-7d31728fe85a" />
<img width="1897" height="1073" alt="Screenshot 2026-06-29 173359" src="https://github.com/user-attachments/assets/37aa1f52-cfe8-4842-b0dc-de5ece4b0e83" />
<img width="1918" height="1082" alt="Screenshot 2026-06-29 173407" src="https://github.com/user-attachments/assets/2b533045-63e4-445c-8b3f-a23634d16ee2" />
<img width="1918" height="1020" alt="Screenshot 2026-06-29 173428" src="https://github.com/user-attachments/assets/fe9d4dbb-af74-425a-b250-5e2a2ef9b2c5" />
<img width="1918" height="1080" alt="Screenshot 2026-06-29 173435" src="https://github.com/user-attachments/assets/8f2eb4c3-4d22-4e24-9ca2-7d5f32c201dc" />





## Branch Strategy

This repository uses a **stacked feature branch** workflow:

```
main
  ├── feature/backend-auth       → Express server, JWT, role endpoints
  ├── feature/frontend-auth      → AuthContext, ProtectedRoute, Login
  ├── feature/role-based-pages   → Tickets + Admin pages, routing, UI
  ├── feature/tests              → Vitest + RTL test suite
  └── docs/readme                → This README
```

Five pull requests are open for review — nothing additional has been merged beyond what was already in `main`.
