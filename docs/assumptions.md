# Project Assumptions & Product Decisions

*Version: 1.0 (Phase 0 Foundation)*

This document formally records all operational, financial, and technical assumptions that resolve ambiguities in the Digital Heroes PRD. These assumptions are kept configurable and isolated from core architecture.

---

## 1. Subscription Pricing & Models

The PRD defines monthly and yearly plans with a discounted yearly rate, but does not dictate fixed currency amounts.

- **Proposed Baseline Prices:**
  - Monthly Plan: **$19.00 USD / month**
  - Yearly Plan: **$190.00 USD / year** (approx. 17% discount, representing 2 months free)
- **Lifecycle Rules:**
  - Subscription status values: `active`, `past_due`, `cancelled`, `incomplete`.
  - Only active subscribers can enter the monthly prize draw and record golf scores that count toward draw entries.

---

## 2. Prize Pool & Revenue Allocation

The PRD establishes that a fixed portion of subscriptions funds the prize pool, with distribution tiers of 40% (5-match), 35% (4-match), and 25% (3-match), plus rollover for unclaimed 5-match jackpots.

- **Configurable Prize Pool Contribution:**
  - Default: **50% of active monthly subscription revenue** is pooled for prizes.
  - Formula: `Prize_Pool = Active_Subscribers * Monthly_Equivalent_Fee * 0.50 + Unclaimed_5_Match_Rollover`
- **Rollover Mechanics:**
  - Unclaimed 5-match jackpot rolls over to the subsequent month's 5-match pool.
  - Unclaimed 4-match and 3-match shares do not roll over; they are retained as platform reserve/retained surplus.
- **Multiple Winners:**
  - Multiple winners within the same tier split that tier's allocated prize evenly.

---

## 3. Charity Contribution Model

The PRD states: "Users select a charity at signup; Minimum contribution: 10% of subscription fee; Users may voluntarily increase their charity percentage."

- **Configurable Contribution:**
  - `MIN_CHARITY_PERCENTAGE = 10`
  - Users may adjust their contribution percentage via their dashboard settings (between 10% and 50%).
  - Charitable donations are calculated and tracked per billing cycle based on the user's active preference.

---

## 4. Golf Scoring Mechanics (Stableford Format)

The PRD mandates:
- Scores between 1 and 45 points.
- Exactly one score permitted per user per date (`UNIQUE(user_id, score_date)`).
- Only the latest 5 scores are retained.
- When a 6th score is entered, the oldest score is pruned automatically (FIFO rolling-5).
- Scores display in reverse chronological order (newest first).

---

## 5. Draw Engine Mechanics

- **Cadence:** Monthly.
- **Numbers:** 5 unique numbers drawn from the range 1 to 45.
- **Modes:**
  - **Random Mode:** Uniform, unweighted random selection of 5 unique integers between 1 and 45.
  - **Algorithmic Mode:** Weighted probability selection derived from the frequency distribution of all active subscriber scores in the draw month.
- **Tiers:**
  - 5 matches: 40% of pool + rollover.
  - 4 matches: 35% of pool.
  - 3 matches: 25% of pool.
  - Less than 3 matches: No prize.

---

## 6. Security & Credential Isolation

- Frontend applications have access strictly to public/publishable credentials (`VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_API_BASE_URL`).
- All privileged operations (database mutations, administrative roles, draw simulations, Stripe checkout sessions, winner payouts) are strictly executed on the Express backend via verified server-side authentication.
