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
2. **Phase 3 — Score Engine & Charity Preferences**:
   - `scoreService`: Enforces 1–45 point constraint, one score per date (`UNIQUE(user_id, score_date)`), and rolling-5 FIFO pruning by `score_date DESC, created_at DESC`.
   - `charityPreferenceService`: Validates active charities and manages user single-row designated charity preferences (10%–100%).
3. **Phase 4 — Subscriptions & Stripe Payments**:
   - Manages Stripe checkout sessions, webhooks, and subscription status lifecycle.
4. **Phase 5 — Draw & Prize Calculation Engine**:
   - `drawService`: Generates 5 winning numbers in Random mode or weighted Algorithmic mode.
   - `prizeService`: Calculates prize pool (50% subscription share + rollover) and creates winner records.
5. **Phase 6 — Admin Operations & Winner Verification**:
   - Admin proof review, winner approval/rejection, and payout disbursement.

---

## 5. Phase 3 Data & Execution Flows

### Score Submission & Rolling-Five Flow

```
React Form (ScoreForm.tsx)
   │ (Score: 1–45 integer, Date: YYYY-MM-DD)
   ▼
Zod Frontend Validation (createScoreSchema)
   │
   ▼
Axios API Client (api.ts: addScore)
   │ (Bearer JWT in Authorization header)
   ▼
authenticateUser Middleware
   │ (Verifies JWT, extracts req.user.id, req.authToken)
   ▼
score.controller (addScore)
   │ (Zod server-side validation)
   ▼
score.service (addScore)
   │ (Checks duplicate date conflict -> 409)
   ▼
Supabase Client (`getUserSupabase(jwt)`)
   │
   ▼
PostgreSQL Engine (`scores` table)
   │ (RLS checks `auth.uid() = user_id`)
   │ (CHECK score BETWEEN 1 AND 45)
   │ (UNIQUE(user_id, score_date))
   ▼
Latest-Five Enforcement (enforce_rolling_five() trigger / service pruning)
   │ (Orders user scores by score_date DESC, created_at DESC)
   │ (Prunes scores beyond top 5)
   ▼
API Response (201 Created)
   │ (Returns newly added score + full list of 5 retained scores)
   ▼
React UI State Update (ScoresPage.tsx)
   │ (Instant reactive update of status bar, average, best score, list)
```

### Charity Selection & Contribution Flow

```
React Component (CharitySelector.tsx + ContributionControl.tsx)
   │ (Selected Charity UUID, Percentage: 10–100)
   ▼
Axios API Client (api.ts: updateCharityPreference)
   │ (Bearer JWT in Authorization header)
   ▼
authenticateUser Middleware
   │ (Verifies JWT, extracts req.user.id, req.authToken)
   ▼
charityPreference.controller (updatePreference)
   │ (Zod server-side validation: 10 <= percentage <= 100)
   ▼
charityPreference.service (updatePreference)
   │ (Verifies charity exists and is_active = true)
   ▼
Supabase Client (`getUserSupabase(jwt)`)
   │
   ▼
PostgreSQL Engine (`user_charity_preferences` table)
   │ (RLS checks `auth.uid() = user_id`)
   │ (UNIQUE(user_id) upsert ensures exactly 1 preference row per user)
   ▼
API Response (200 OK)
   │ (Returns saved preference with joined charity metadata)
   ▼
React UI State Update (MyCharityPage.tsx / DashboardPlaceholder.tsx)
   │ (Confirmation banner, updated designated charity preview)
```

---

## 5. Phase 4: Subscriptions, Stripe Payments & Gating Architecture

### Stripe Subscription & Checkout Lifecycle

```
Member Browser (/subscription)
   │ (Selects Monthly $19/mo or Yearly $190/yr)
   ▼
POST /api/subscriptions/checkout { planType: 'monthly' | 'yearly' }
   │ (Authenticated via Bearer JWT)
   ▼
Backend StripeService.createCheckoutSession
   │ - Finds or creates Stripe Customer with user_id in metadata
   │ - Resolves server-side price ID (STRIPE_MONTHLY_PRICE_ID / STRIPE_YEARLY_PRICE_ID)
   │ - Creates Stripe Checkout Session in subscription mode
   ▼
Stripe Hosted Checkout / Mock Sandbox URL
   │ - Member completes credit card payment in test mode
   ▼
Redirect to /subscription/success?session_id=...
   │ - Success page polls /api/subscriptions/me until webhook sync completes
```

### Stripe Webhook & Synchronization Architecture

```
Stripe Cloud Infrastructure
   │ (Webhook Event POST /api/payments/webhook)
   ▼
Express Raw Body Parser (`express.raw({ type: 'application/json' })`)
   │ Mounted BEFORE express.json() to preserve byte-exact payload
   ▼
WebhookService.constructEvent
   │ Cryptographically verifies HMAC-SHA256 signature using STRIPE_WEBHOOK_SECRET
   │ Rejects invalid/forged payloads with HTTP 400 Bad Request
   ▼
WebhookService.isEventProcessed (Idempotency Guard)
   │ Checks memory cache and stripe_webhook_events table
   │ Prevents duplicate payment recordings or double increments
   ▼
Event Router:
   ├── customer.subscription.created / updated
   │     └── Upserts public.subscriptions with status, plan, period dates
   ├── customer.subscription.deleted
   │     └── Marks subscription as 'cancelled', preserves row for historical audit
   ├── invoice.paid
   │     ├── Inserts payment ledger record into public.payments
   │     └── Snapshots user's charity preference & percentage into subscription_charity_allocations
   └── invoice.payment_failed
         └── Updates subscription status to 'past_due'
```

### Subscription Gating Middleware (`requireActiveSubscription`)

```
Authenticated HTTP Request (e.g. GET /api/scores)
   │
   ▼
authenticateUser Middleware (Extracts req.user)
   │
   ▼
requireActiveSubscription Middleware
   │ Checks subscription status in public.subscriptions
   │
   ├── User has NO subscription OR status != 'active' OR period expired
   │     └── Returns HTTP 403 Forbidden:
   │         {
   │           "status": "error",
   │           "statusCode": 403,
   │           "code": "SUBSCRIPTION_REQUIRED",
   │           "message": "An active subscription is required to access score tracking..."
   │         }
   │
   └── User has active subscription (current_period_end > now())
         └── Calls next() -> Controller executes score operation
```

