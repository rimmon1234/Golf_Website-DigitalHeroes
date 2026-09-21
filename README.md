# Digital Heroes — Golf Performance, Charity Fundraising & Prize Draw Platform

Digital Heroes is an application combining Stableford golf score tracking, charity fundraising, and a monthly draw-based reward engine. Built with a modern, fintech-inspired aesthetic, the platform empowers golfers to log performance while directing monthly subscription portions to verified charitable organizations.

> **Status:** Phase 0 (Project Foundation) completed. Frontend and backend are decoupled, independently configured, and verified.

---

## 1. Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router DOM, Axios, Zod, React Hook Form, Lucide React, Recharts
- **Backend:** Node.js, Express, TypeScript, Zod, CORS, Helmet, Morgan, dotenv, tsx, nodemon
- **Database & Services (Planned Phase 1):** Supabase PostgreSQL, Supabase Auth, Supabase Storage
- **Payments (Planned Phase 3):** Stripe Checkout & Webhooks (Test Mode)

---

## 2. Project Structure

```
digital-heroes/
├── frontend/                     # Independent React + Vite application
│   ├── public/
│   ├── src/
│   │   ├── assets/               # Static assets & icons
│   │   ├── components/
│   │   │   ├── common/           # Generic shared UI components
│   │   │   ├── layout/           # Navbar, Footer, Sidebar, Layout wrappers
│   │   │   └── ui/               # Buttons, Inputs, Badges, Modals
│   │   ├── pages/
│   │   │   ├── public/           # Landing, Charities, How It Works
│   │   │   ├── auth/             # Login, Signup
│   │   │   ├── user/             # User dashboard, Score entry, Winnings
│   │   │   └── admin/            # Admin dashboard, User & Draw management
│   │   ├── routes/               # Public, Protected, and Admin route guards
│   │   ├── services/             # Centralized Axios API client & endpoints
│   │   ├── hooks/                # Custom React hooks
│   │   ├── context/              # Auth & notification context
│   │   ├── lib/                  # Utilities & 3rd party wrappers
│   │   ├── types/                # TypeScript interface definitions
│   │   ├── utils/                # Formatting & validation helpers
│   │   ├── App.tsx               # Phase 0 verification view
│   │   ├── main.tsx              # React DOM entrypoint
│   │   └── index.css             # Tailwind base & theme tokens
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
├── backend/                      # Independent Node.js + Express API
│   ├── src/
│   │   ├── config/               # Zod-validated environment config
│   │   ├── controllers/          # Request handling & HTTP status orchestration
│   │   ├── middleware/           # Auth, error handling, role checking
│   │   ├── routes/               # Express routing modules
│   │   ├── services/             # Business logic layer (scores, draws, prizes)
│   │   ├── repositories/         # Supabase database access layer
│   │   ├── validators/           # Zod schemas for request validation
│   │   ├── utils/                # Utility & math helpers
│   │   ├── types/                # Backend TypeScript types
│   │   ├── app.ts                # Express application setup
│   │   └── server.ts             # Server entrypoint (port 5000)
│   ├── package.json
│   ├── tsconfig.json
│   ├── nodemon.json
│   └── .env.example
├── database/                     # PostgreSQL migrations & seed files (Phase 1)
│   └── README.md
├── docs/                         # Technical architecture & project documentation
│   ├── architecture.md           # Layered system architecture & boundaries
│   ├── assumptions.md            # Documented business & product assumptions
│   ├── api.md                    # REST API specifications
│   └── testing.md                # Testing plan and verification checklist
├── package.json                  # Root monorepo workspace configuration
├── README.md
└── .gitignore
```

---

## 3. Quick Start (Local Development)

### Prerequisites
- Node.js >= 18.0.0 (Recommended: v20+ or v24)
- npm >= 9.0.0

### Installation
From the root directory:
```bash
npm install
```
This installs dependencies for root, frontend, and backend workspaces.

### Environment Setup
1. Backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Frontend:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

### Running the Project
- **Run both backend and frontend concurrently:**
  ```bash
  npm run dev
  ```
- **Run backend only (port 5000):**
  ```bash
  npm run dev:backend
  ```
- **Run frontend only (port 5173):**
  ```bash
  npm run dev:frontend
  ```

### Type Checking & Build
- **Check TypeScript types across the monorepo:**
  ```bash
  npm run check-types
  ```
- **Build production bundles:**
  ```bash
  npm run build
  ```

---

## 4. Phase 0 Verification

Backend health endpoint is live at:
```http
GET http://localhost:5000/api/health
```

Example response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-21T13:52:00.000Z",
  "uptime": 42,
  "environment": "development"
}
```

Vite dev proxy forwards `/api` requests to `http://localhost:5000`, allowing the frontend to call `apiClient.get('/api/health')` transparently without CORS friction.
