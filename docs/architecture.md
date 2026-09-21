# System Architecture Overview

*Digital Heroes Architecture Document — Phase 0 Foundation*

## 1. High-Level Architecture

The platform uses a clean, decoupled client-server architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 18 + Vite + TypeScript + Tailwind CSS               │
│  React Router · React Hook Form · Zod · Recharts · Lucide   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON (Central Axios)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API Layer                      │
│  Node.js + Express + TypeScript                             │
│  Helmet · CORS · Morgan · Zod Validation · Error Handler    │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌─────────────────────────┐
│     Database & Auth Layer    │    │      Payment Layer      │
│  Supabase PostgreSQL         │    │  Stripe Checkout        │
│  Supabase Auth & Storage     │    │  Stripe Webhooks        │
└──────────────────────────────┘    └─────────────────────────┘
```

---

## 2. Layered Backend Design

To guarantee maintainability and separation of concerns, the backend adheres to a strict layered structure:

```
HTTP Request
     │
     ▼
[ Route ]              - Maps URL endpoints and applies authentication/role guards
     │
     ▼
[ Controller ]         - Parses inputs, invokes validators, formats HTTP responses
     │
     ▼
[ Service ]            - Core business logic (score rolling, draw simulation, prize math)
     │
     ▼
[ Repository ]         - Data access layer executing queries against Supabase PostgreSQL
     │
     ▼
[ Supabase / Postgres ]- Persistent storage with constraints, indexes, and cascades
```

### Guiding Principles
1. **Zero Business Logic in Routes or Views:** Business rules (e.g. rolling 5 scores, jackpot rollover, winner validation) reside exclusively in backend service modules.
2. **Never Trust Client Claims:** User identity, role (`USER` vs `ADMIN`), subscription status, and prize amounts are computed or validated server-side on every request.
3. **Fail Safe Error Handling:** In production, stack traces are withheld from client responses; errors return standardized, actionable JSON envelopes.

---

## 3. Communication Strategy

- **Development:** The Vite development server runs on `http://localhost:5173` and proxies all `/api/*` traffic directly to the Express backend on `http://localhost:5000`. This eliminates CORS issues in development.
- **Production:** Frontend static assets will be served via Vercel CDN, routing API requests to the backend deployed on Render.
- **API Client:** The frontend uses a centralized Axios client (`src/services/api.ts`) with request interceptors for auth tokens and response interceptors for standardized error extraction.
