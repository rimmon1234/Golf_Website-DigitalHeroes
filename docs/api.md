# REST API Specification

*Digital Heroes API Contract — Phase 0 Foundation*

## 1. Active Phase 0 Endpoints

### System Health Check
Verifies backend operational status, server uptime, and environment.

- **URL:** `/api/health`
- **Method:** `GET`
- **Auth Required:** No
- **Headers:** `None`

#### Success Response (200 OK)
```json
{
  "status": "ok",
  "timestamp": "2026-09-21T13:52:00.000Z",
  "uptime": 123,
  "environment": "development"
}
```

#### Standard Error Response Envelope
```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Human-readable error description"
}
```

---

## 2. Planned REST Endpoints (Phases 1–6)

Below is the planned endpoint mapping to be implemented across subsequent phases:

### Authentication & Profiles (`/api/auth`, `/api/users`)
- `POST /api/auth/sync-profile` — Sync Supabase auth user with application user profile.
- `GET  /api/users/me` — Retrieve authenticated user profile, role, and subscription status.
- `PUT  /api/users/me` — Update user profile and preferences.

### Golf Scores (`/api/scores`)
- `GET    /api/scores` — Retrieve current user's latest 5 scores (newest first).
- `POST   /api/scores` — Log a new score (range 1–45, date required, rolling FIFO applied).
- `PUT    /api/scores/:id` — Update an existing score entry.
- `DELETE /api/scores/:id` — Remove a score entry.

### Charities (`/api/charities`)
- `GET  /api/charities` — List charities with search, filter, and spotlight support.
- `GET  /api/charities/:id` — Detailed charity profile with upcoming events.
- `POST /api/charities/preference` — Update user's charity and contribution percentage (min 10%).

### Subscriptions & Payments (`/api/subscriptions`, `/api/payments`)
- `POST /api/subscriptions/checkout` — Create Stripe Checkout session for monthly/yearly plans.
- `GET  /api/subscriptions/status` — Get verified subscription state.
- `POST /api/payments/webhook` — Stripe webhook handler for lifecycle events.

### Draws & Results (`/api/draws`)
- `GET  /api/draws` — List published draws and winning history.
- `GET  /api/draws/upcoming` — Get details of next upcoming monthly draw and estimated pool.
- `POST /api/draws/simulate` (Admin) — Simulate random or algorithmic draw with preview.
- `POST /api/draws/publish` (Admin) — Finalize and publish draw results and calculate winners.

### Winners & Proof Verification (`/api/winners`)
- `GET   /api/winners` — List user's winnings or (for admin) all pending winners.
- `POST  /api/winners/:id/proof` — Upload screenshot proof to Supabase Storage.
- `PATCH /api/winners/:id/verify` (Admin) — Approve or reject winner submission.
- `PATCH /api/winners/:id/payout` (Admin) — Mark approved payout as Paid.

### Admin Operations (`/api/admin`)
- `GET /api/admin/users` — Search and manage user accounts.
- `GET /api/admin/analytics` — Platform metrics (subscribers, prize pool, charity totals).
