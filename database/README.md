# Digital Heroes Database Architecture & Migrations

This directory contains the PostgreSQL schema definitions, triggers, constraints, Row Level Security (RLS) policies, and seed data for the Digital Heroes platform.

---

## 1. Directory Structure

```
database/
├── migrations/
│   ├── 001_initial_schema.sql    # Tables, relationships, check constraints, indexes, triggers
│   ├── 002_rls_policies.sql      # Row Level Security (RLS) policies and admin helper
│   └── 003_seed.sql              # Non-auth seed data (verified charities & charity events)
├── seed.sql                      # Copy of non-auth seed data
└── README.md                     # Documentation & setup guide
```

---

## 2. Table Relationships Overview

```
auth.users (Supabase Managed)
    │
    ▼ (1:1 via trigger)
public.users
    ├── subscriptions (1:N)
    ├── scores (1:N)
    ├── user_charity_preferences (1:1) ──► charities (N:1) ──► charity_events (1:N)
    ├── draw_entries (1:N) ──────────────► draws (N:1)
    ├── winners (1:N) ───────────────────► draws (N:1)
    └── payments (1:N)
```

### Table Reference

| Table | Primary Key | Key Constraints & Rules |
| :--- | :--- | :--- |
| `public.users` | `id UUID` (FK to `auth.users.id`) | Role `CHECK (role IN ('user', 'admin'))`. Defaults to `user`. Protected against client escalation. |
| `public.subscriptions` | `id UUID` | `user_id` (FK to `users`), `plan_type` ('monthly'/'yearly'), lifecycle status states. |
| `public.scores` | `id UUID` | `CHECK (score >= 1 AND score <= 45)`, `UNIQUE(user_id, score_date)`. One score per date. |
| `public.charities` | `id UUID` | `name` UNIQUE, category, active & featured flags. |
| `public.charity_events` | `id UUID` | `charity_id` (FK to `charities` ON DELETE CASCADE), event date, title. |
| `public.user_charity_preferences` | `id UUID` | `UNIQUE(user_id)` (one active preference), `CHECK (contribution_percentage >= 10.00 AND <= 100.00)`. |
| `public.draws` | `id UUID` | `UNIQUE(draw_month)`, status ('draft', 'simulated', 'published', 'completed'), winning numbers, prize pool & rollover. |
| `public.draw_entries` | `id UUID` | `UNIQUE(draw_id, user_id)` (one entry per user per draw), selected 5 numbers. |
| `public.winners` | `id UUID` | `UNIQUE(draw_id, user_id, match_type)`, status ('pending', 'approved', 'rejected'), payout ('pending', 'paid'). |
| `public.payments` | `id UUID` | Audit ledger of payments, type ('subscription', 'charity_donation', 'prize_payout'), status. |

---

## 3. How to Apply Migrations

### Option A: Supabase Web Dashboard (Recommended for Quick Setup)
1. Open your project on [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** tab.
3. Run the migrations in sequential order:
   - Paste and execute `database/migrations/001_initial_schema.sql`
   - Paste and execute `database/migrations/002_rls_policies.sql`
   - Paste and execute `database/migrations/003_seed.sql`

### Option B: Supabase CLI
```bash
supabase link --project-ref <your-project-id>
supabase db push
```

---

## 4. Automatic User Profile Creation (`auth.users` &rarr; `public.users`)

When a user registers through Supabase Auth (client or API), the `on_auth_user_created` trigger fires `public.handle_new_user()`:
1. It copies `NEW.id` &rarr; `public.users.id`.
2. Extracts `full_name` and `avatar_url` from `NEW.raw_user_meta_data`.
3. **Security Enforcement:** Role is hardcoded to `'user'`. Any attempt by the client to inject `role: 'admin'` inside user metadata is ignored.
4. The `trg_prevent_role_escalation` trigger blocks any direct client `UPDATE` from modifying the `role` column.

---

## 5. Row Level Security (RLS) Strategy

Every application table in the `public` schema has RLS strictly enabled:
- **`public.is_admin()` Helper:** Declared with `SECURITY DEFINER` and safe `search_path = public, pg_temp`. It evaluates with superuser privileges, completely preventing recursion loops on `public.users`.
- **User Data Isolation:** Users can only `SELECT`, `INSERT`, `UPDATE`, or `DELETE` their own rows (`auth.uid() = user_id`).
- **Tamper Prevention:**
  - `subscriptions`: Normal users cannot write or mark subscriptions active.
  - `winners`: Normal users cannot alter prize amounts or mark payouts as paid.
  - `payments`: Normal users cannot create fake payment records.
  - `draws`: Non-admin users can only view draws that have `status = 'published'`.

---

## 6. Admin Role Promotion (Safe Workflow)

Because role escalation cannot be performed from the frontend:
1. Register the admin user through the standard signup flow (e.g., `admin@digitalheroes.com`).
2. Verify the user's email or confirm it in the Supabase Auth dashboard.
3. In the Supabase SQL Editor, run:
```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'admin@digitalheroes.com';
```
This safely grants administrative access without exposing private keys or creating vulnerable client endpoints.
