# Testing & Verification Guide

*Digital Heroes Test Plan — Phase 0 Foundation*

This document defines the verification strategy, test execution commands, and edge-case testing checklist for Digital Heroes.

---

## 1. Phase 0 Verification Checklist

| Item | Verification Step | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **Root Workspaces** | Run `npm install` from root | Installs dependencies for root, frontend, and backend | ✅ |
| **Backend Types** | Run `npm run check-types --workspace=backend` | Zero TypeScript errors | ✅ |
| **Frontend Types** | Run `npm run check-types --workspace=frontend` | Zero TypeScript errors | ✅ |
| **Monorepo Build** | Run `npm run build` | Clean production build of both workspaces | ✅ |
| **Backend Health** | Send `GET http://localhost:5000/api/health` | Returns HTTP 200 with `{ status: "ok", ... }` | ✅ |
| **Proxy Communication** | Open frontend in browser, verify health card | Displays connected state with uptime & environment | ✅ |
| **Secret Protection** | Inspect git status & tracked files | No `.env` or sensitive credentials tracked | ✅ |

---

## 2. Phase 4 Verification Matrix: Subscriptions & Stripe Payments

All 20 automated test cases executed against live Supabase PostgreSQL and Express backend:

| # | Test Case Description | Method & Target | Expected Result | Result |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Auth guard on `GET /subscriptions/me` | `GET /api/subscriptions/me` | HTTP 401 Unauthorized | ✅ PASS |
| **2** | Auth guard on `POST /subscriptions/checkout` | `POST /api/subscriptions/checkout` | HTTP 401 Unauthorized | ✅ PASS |
| **3** | Input validation on `planType` | `POST /api/subscriptions/checkout` (bad plan) | HTTP 400 Bad Request | ✅ PASS |
| **4** | Auth guard on `POST /subscriptions/cancel` | `POST /api/subscriptions/cancel` | HTTP 401 Unauthorized | ✅ PASS |
| **5** | Auth guard on `POST /subscriptions/portal` | `POST /api/subscriptions/portal` | HTTP 401 Unauthorized | ✅ PASS |
| **6** | Subscription gating on scores (unsubscribed member) | `GET /api/scores` | HTTP 403 `SUBSCRIPTION_REQUIRED` | ✅ PASS |
| **7** | Admin bypass on non-gated routes without subscription | `GET /api/auth/me` | HTTP 200 OK | ✅ PASS |
| **8** | Webhook missing Stripe signature | `POST /api/payments/webhook` | HTTP 400 Bad Request | ✅ PASS |
| **9** | Webhook forged / invalid Stripe signature | `POST /api/payments/webhook` | HTTP 400 Bad Request | ✅ PASS |
| **10** | Webhook `customer.subscription.created` | `POST /api/payments/webhook` | Active subscription created in DB | ✅ PASS |
| **11** | Subscription gating on scores (active subscriber) | `GET /api/scores` | HTTP 200 OK | ✅ PASS |
| **12** | Subscription status reflection | `GET /api/subscriptions/me` | `isActive: true`, `status: 'active'` | ✅ PASS |
| **13** | Payment persistence on `invoice.paid` | `POST /api/payments/webhook` | Payment record created in `payments` | ✅ PASS |
| **14** | Charity allocation snapshot | `POST /api/payments/webhook` | $3.80 allocated (20% of $19) | ✅ PASS |
| **15** | Webhook idempotency guard | `POST /api/payments/webhook` (duplicate) | No duplicate payment inserted | ✅ PASS |
| **16** | Cancellation scheduling via API | `POST /api/subscriptions/cancel` | `cancel_at_period_end: true` | ✅ PASS |
| **17** | Access retention during cancellation period | `GET /api/scores` | HTTP 200 OK | ✅ PASS |
| **18** | Cancellation reversal via API | `POST /api/subscriptions/reactivate` | `cancel_at_period_end: false` | ✅ PASS |
| **19** | Subscription lifecycle cancellation | `POST /api/payments/webhook` (`sub.deleted`) | Subscription marked `cancelled` | ✅ PASS |
| **20** | Score access re-gating after cancellation | `GET /api/scores` | HTTP 403 `SUBSCRIPTION_REQUIRED` | ✅ PASS |

### How to Run Automated Phase 4 Tests
```bash
node C:\Users\sabit\.gemini\antigravity-ide\brain\e6f192fe-05ae-49c2-93ac-ca7caafa60fe\scratch\test_phase4_full.cjs
```

---

## 3. Browser UI Verification Matrix (Phase 4)

- **Desktop Viewport (1920x945):**
  - Membership & Billing page renders active subscription plan ($19.00 USD/mo).
  - Next billing cycle date, status pill, and action buttons display cleanly.
  - "Cancel Membership at Period End" modal warns that access is retained until period end. Dismisses safely via "Keep My Membership" button.
  - Score logging unlocks automatically once member has active status.
- **Mobile Viewport (375x812):**
  - Layout reflows into single column without horizontal scrollbars.
  - Buttons and interactive cards fit the screen with full touch target compliance.

---

## 4. Planned Test Scenarios for Future Phases

### Draw Engine & Prize Pool (Phase 5 & 6)
- [ ] Random mode draws 5 distinct numbers between 1 and 45.
- [ ] Algorithmic mode weights selection by subscriber score frequencies.
- [ ] 5-match jackpot rollover when no 5-match winner exists.
- [ ] Multiple winners in same tier split tier share evenly.
- [ ] Prevent re-publishing an already published draw.

### Winner Verification & Payouts (Phase 6)
- [ ] Authenticated winner uploads image proof.
- [ ] Non-winner upload rejected.
- [ ] Admin approves proof → status changes to Pending payout.
- [ ] Admin marks payout completed → status changes to Paid.

