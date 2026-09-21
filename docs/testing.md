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

## 2. Planned Test Scenarios for Future Phases

### Score System (Phase 3)
- [ ] Record score between 1 and 45 (Valid).
- [ ] Attempt score < 1 or > 45 (Rejected with 400 Bad Request).
- [ ] Attempt duplicate score date for same user (Database constraint rejects).
- [ ] 5-score limit: Inserting a 6th score automatically prunes the oldest score.
- [ ] Deleting and editing existing scores.

### Draw Engine & Prize Pool (Phase 5)
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
