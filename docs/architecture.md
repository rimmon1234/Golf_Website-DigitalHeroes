# System Architecture Overview

*Digital Heroes Architecture Document — Phase 1 Complete*

## 1. High-Level Architecture

The platform uses a clean, decoupled client-server architecture with strict Row Level Security (RLS) and server-side authorization:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 18 + Vite + TypeScript + Tailwind CSS               │
│  React Router · React Hook Form · Zod · Recharts · Lucide   │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │ 1. User Authenticates         │ 2. HTTPS / JSON with Bearer JWT
               ▼                               ▼
┌──────────────────────────────┐ ┌─────────────────────────────────────────────────────────────┐
│       Supabase Auth          │ │                      Backend API Layer                      │
│  Issue JWT Session           │ │  Node.js + Express + TypeScript                             │
│  Auto-refresh token          │ │  Helmet · CORS · Morgan · Zod Validation · Error Handler    │
└──────────────────────────────┘ └──────────────────────────────┬──────────────────────────────┘
                                                                │ 3. authenticateUser verifies JWT
                                                                │ 4. requireAdmin verifies role
                                                                ▼
                                 ┌─────────────────────────────────────────────────────────────┐
                                 │                   Supabase PostgreSQL Layer                 │
                                 │  Row Level Security (RLS) Enforced on ALL Tables            │
                                 │  User isolation (auth.uid() = user_id)                      │
                                 │  is_admin() superuser evaluation prevents recursion         │
                                 └─────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication & Authorization Flow

```
Frontend (User enters email + password)
   │
   ▼
Supabase Auth (Validates credentials, issues JWT access token)
   │
   ▼
Access Token (Stored securely in client session via AuthContext)
   │
   ▼ (Automatically attached via Axios interceptor: Authorization: Bearer <token>)
Express API Endpoint (e.g. GET /api/auth/me)
   │
   ▼
Authentication Middleware (`authenticateUser`)
   - Extracts Bearer token from header
   - Calls `supabase.auth.getUser(token)` to verify signature with Auth server
   - Populates `req.user = { id, email }` and `req.authToken = token`
   │
   ▼
Authorization Middleware (`requireAdmin` for privileged endpoints)
   - Queries `public.users` role for `req.user.id`
   - Verifies `role === 'admin'`
   - Rejects non-admin requests with HTTP 403 Forbidden
   │
   ▼
Database Access Layer (`getUserSupabase(jwt)`)
   - Uses user-scoped client carrying user Bearer JWT
   - Respects PostgreSQL Row Level Security (RLS)
   │
   ▼
PostgreSQL Engine
   - RLS evaluates `auth.uid() = user_id`
   - Data returned to Express & forwarded as standardized JSON to client
```

---

## 3. Data Model Relationships

```
auth.users (Supabase Managed Identity)
    │
    ▼ (1:1 via database trigger: handle_new_user)
public.users
    ├── subscriptions (1:N)
    ├── scores (1:N)
    ├── user_charity_preferences (1:1) ──► charities (N:1) ──► charity_events (1:N)
    ├── draw_entries (1:N) ──────────────► draws (N:1)
    ├── winners (1:N) ───────────────────► draws (N:1)
    └── payments (1:N)
```

---

## 4. Business Logic Boundaries Across Phases

All critical business rules live exclusively on the backend in dedicated services:

1. **Phase 2 — Public Platform & Charities**:
   - Charity directory discovery & filtering service.
2. **Phase 3 — Subscription & Score Engine**:
   - `scoreService`: Enforces 1–45 point constraint, one score per date, and rolling-5 FIFO pruning (automatic deletion of oldest score upon 6th entry).
   - `subscriptionService`: Manages subscription status transitions and checks subscriber eligibility.
3. **Phase 4 — User Dashboard**:
   - Aggregates user profile, active subscription, latest 5 scores, charity preference, and draw status.
4. **Phase 5 — Draw & Prize Calculation Engine**:
   - `drawService`: Generates 5 winning numbers in Random mode or weighted Algorithmic mode (weighted by monthly subscriber score frequency).
   - `prizeService`: Calculates prize pool (50% subscription share + unclaimed 5-match jackpot rollover), splits ties across winners, and creates winner records.
5. **Phase 6 — Admin Operations & Winner Verification**:
   - `winnerService`: Admin proof verification (Pending &rarr; Approved/Rejected) and payout lifecycle (Pending &rarr; Paid).
   - `adminService`: User management and platform analytics.
