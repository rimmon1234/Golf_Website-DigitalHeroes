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

## 2. Implemented Phase 3 Endpoints

### Golf Scores (`/api/scores`)

All score endpoints require an authenticated user session (`Authorization: Bearer <supabase_jwt>`). Ownership is strictly derived from the authenticated token; users cannot view, edit, or delete another user's scores.

#### 1. Retrieve Current User Scores
- **URL:** `/api/scores`
- **Method:** `GET`
- **Auth Required:** Yes (`Bearer <token>`)
- **Behavior:** Returns only the authenticated user's retained scores, ordered chronologically by `score_date DESC`.
- **Response (200 OK):**
```json
{
  "status": "ok",
  "data": {
    "scores": [
      {
        "id": "11111111-2222-3333-4444-555555555555",
        "user_id": "99999999-8888-7777-6666-555555555555",
        "score": 42,
        "score_date": "2026-09-06",
        "created_at": "2026-09-06T10:00:00.000Z",
        "updated_at": "2026-09-06T10:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### 2. Record New Score
- **URL:** `/api/scores`
- **Method:** `POST`
- **Auth Required:** Yes
- **Validation:**
  - `score`: integer, 1 <= score <= 45.
  - `score_date`: required, valid ISO date format `YYYY-MM-DD`.
  - Duplicate date for the same user is rejected.
- **Rolling-Five Rule:** After insertion, the system enforces `COUNT(retained scores) <= 5` by ordering by `score_date DESC, created_at DESC` and removing any records outside the top 5.
- **Request Body:**
```json
{
  "score": 38,
  "score_date": "2026-09-05"
}
```
- **Response (201 Created):**
```json
{
  "status": "ok",
  "message": "Score added successfully",
  "data": {
    "score": { ... },
    "scores": [ ... ]
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Validation failure (e.g. score < 1 or > 45, invalid date).
  - `401 Unauthorized`: Missing or invalid bearer token.
  - `409 Conflict`: "A score already exists for this date."

#### 3. Update Existing Score
- **URL:** `/api/scores/:id`
- **Method:** `PATCH`
- **Auth Required:** Yes
- **Validation:**
  - `:id`: Valid UUID.
  - `score`: optional integer (1-45).
  - `score_date`: optional valid date `YYYY-MM-DD`.
  - Date conflicts with another of the user's scores return `409 Conflict`.
- **Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Score updated successfully",
  "data": {
    "score": { ... },
    "scores": [ ... ]
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Validation failure or invalid UUID format.
  - `404 Not Found`: Score does not exist or does not belong to user (preserves isolation).
  - `409 Conflict`: Date conflict with another existing score for the user.

#### 4. Delete Score
- **URL:** `/api/scores/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Behavior:** Deletes the user's score. Does not auto-restore past pruned scores.
- **Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Score deleted successfully"
}
```
- **Error Responses:**
  - `400 Bad Request`: Invalid UUID format.
  - `404 Not Found`: Score not found or belongs to another user.

---

### Charity Preference (`/api/charity-preference`)

#### 1. Get Designated Charity Preference
- **URL:** `/api/charity-preference`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "status": "ok",
  "data": {
    "preference": {
      "id": "uuid",
      "user_id": "uuid",
      "charity_id": "uuid",
      "contribution_percentage": 25,
      "created_at": "2026-09-01T00:00:00.000Z",
      "updated_at": "2026-09-01T00:00:00.000Z",
      "charity": {
        "id": "uuid",
        "name": "Youth on Course Foundation",
        "category": "Youth Development",
        "image_url": "https://...",
        "mission_statement": "..."
      }
    }
  }
}
```
*(If no preference is set, `preference` is `null`).*

#### 2. Set/Update Designated Charity Preference
- **URL:** `/api/charity-preference`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Validation:**
  - `charity_id`: required valid UUID of an active charity.
  - `contribution_percentage`: required number, 10 <= percentage <= 100.
- **Behavior:** Upserts the single preference record for the authenticated user (`UNIQUE(user_id)`). Switching charities updates this row rather than creating a duplicate.
- **Request Body:**
```json
{
  "charity_id": "44444444-4444-4444-4444-444444444444",
  "contribution_percentage": 20
}
```
- **Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Charity preference updated successfully",
  "data": {
    "preference": { ... }
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Percentage out of bounds (<10% or >100%), or selected charity is inactive/invalid.
  - `401 Unauthorized`: Missing or invalid token.

---

## 3. Planned REST Endpoints (Phases 4–6)

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
