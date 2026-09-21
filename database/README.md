# Database & Data Layer Architecture

*Digital Heroes Database Specification — Phase 0 Foundation*

## 1. Overview

Digital Heroes utilizes **Supabase PostgreSQL** for its persistence layer. The database schema enforces data integrity at the database engine level (foreign keys, check constraints, unique constraints, and cascades).

> **Important (Phase 0 Scope):** No database tables or seed records are created during Phase 0. Migrations and schema design will be executed in **Phase 1 (Database + Auth)**.

---

## 2. Planned Schema Architecture (Phase 1 Preview)

The following relational entities are planned for implementation in Phase 1:

1. **`users`**: Application user profiles mapped to `auth.users.id`.
   - Fields: `id`, `auth_user_id`, `name`, `email`, `role ('USER' | 'ADMIN')`, `created_at`, `updated_at`.
2. **`subscriptions`**: Active and historical billing status.
   - Fields: `id`, `user_id`, `plan_type ('MONTHLY' | 'YEARLY')`, `status ('active' | 'past_due' | 'cancelled')`, `stripe_customer_id`, `stripe_subscription_id`, `start_date`, `renewal_date`, `cancelled_at`, `created_at`, `updated_at`.
3. **`charities`**: Registered charity organizations.
   - Fields: `id`, `name`, `description`, `category`, `image_url`, `featured`, `active`, `created_at`, `updated_at`.
4. **`charity_events`**: Events organized by charities (e.g., charity golf days).
   - Fields: `id`, `charity_id`, `title`, `description`, `event_date`, `created_at`.
5. **`user_charity_preferences`**: User-selected charity and contribution allocation.
   - Fields: `id`, `user_id`, `charity_id`, `contribution_percentage` (CHECK >= 10), `created_at`, `updated_at`.
6. **`scores`**: User Stableford golf scores.
   - Fields: `id`, `user_id`, `score` (CHECK 1 <= score <= 45), `score_date`, `created_at`, `updated_at`.
   - Constraints: `UNIQUE(user_id, score_date)`.
   - Logic: Pruned via rolling-5 FIFO in backend service.
7. **`draws`**: Monthly draw records.
   - Fields: `id`, `draw_month`, `draw_type ('RANDOM' | 'ALGORITHMIC')`, `status ('DRAFT' | 'SIMULATED' | 'PUBLISHED')`, `winning_numbers (int[])`, `prize_pool`, `published_at`, `created_at`.
8. **`draw_entries`**: User entries associated with each monthly draw.
   - Fields: `id`, `draw_id`, `user_id`, `selected_numbers (int[])`, `created_at`.
9. **`winners`**: Detected winners for published draws.
   - Fields: `id`, `draw_id`, `user_id`, `match_type (3 | 4 | 5)`, `prize_amount`, `proof_url`, `verification_status ('PENDING' | 'APPROVED' | 'REJECTED')`, `payout_status ('PENDING' | 'PAID')`, `verified_at`, `paid_at`, `created_at`.
10. **`payments`**: Payment audit history.
    - Fields: `id`, `user_id`, `stripe_payment_id`, `amount`, `currency`, `payment_type`, `status`, `created_at`.

---

## 3. Migration Workflow (Phase 1)

When Phase 1 begins:
1. SQL migration scripts will be located in `database/migrations/`.
2. Migrations can be applied directly using the Supabase SQL Editor or the Supabase CLI (`supabase db push`).
3. Seed data will be populated via `database/seed.sql`.
