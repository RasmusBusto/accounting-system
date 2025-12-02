# Accounting System - Architecture

## Overview

Simple React single-page application for accounting/bookkeeping. Built with Vite, Tailwind CSS v4, and TypeScript.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         nginx                                │
│                     (reverse proxy)                          │
├─────────────────────────────────────────────────────────────┤
│  /frontend/*  →  Vite Dev Server (port 4200)                │
│  /backend/*   →  Quarkus Backend (port 8080)                │
│  /            →  Redirect to /frontend/                      │
└─────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           ▼                                      ▼
┌─────────────────────┐              ┌─────────────────────┐
│   React Frontend    │              │   Quarkus Backend   │
│   (this project)    │              │   (snabel-backend)  │
│                     │              │                     │
│  - Vite + React 19  │    REST      │  - Java/Kotlin      │
│  - Tailwind CSS v4  │◄────────────►│  - PostgreSQL       │
│  - React Router v7  │    API       │  - REST endpoints   │
│  - i18next          │              │                     │
└─────────────────────┘              └─────────────────────┘
```

## Frontend Structure

```
src/
├── App.tsx                 # Main app component with routing
├── main.tsx                # React entry point
├── index.css               # Tailwind v4 import (@import "tailwindcss")
│
├── components/             # Reusable UI components
│   ├── LanguageSwitcher.tsx
│   ├── DepartmentForm.tsx
│   ├── DepartmentList.tsx
│   ├── ProjectForm.tsx
│   ├── ProjectList.tsx
│   ├── GeneralLedger.tsx
│   └── JournalEntryTable.tsx
│
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
│
├── i18n/
│   └── config.ts           # i18next config with embedded translations
│                           # Supports: no (Norwegian), en, pl, uk
│
├── pages/                  # Route page components
│   ├── Dashboard.tsx
│   ├── Invoicing.tsx
│   ├── Expenses.tsx
│   ├── Reports.tsx
│   ├── Clients.tsx
│   └── Settings.tsx
│
├── services/
│   └── api.ts              # Backend API client (fetch wrapper)
│
├── types/
│   └── index.ts            # TypeScript interfaces
│
└── data/
    └── chartOfAccounts.ts  # Norwegian chart of accounts (NS 4102)
```

## Routing

All routes use `/frontend` as base path (configured in `vite.config.ts` and `App.tsx`).

| Route | Component | Description |
|-------|-----------|-------------|
| `/frontend/` | Dashboard | Overview and stats |
| `/frontend/invoices/*` | Invoicing | Invoice management |
| `/frontend/expenses/*` | Expenses | Expense tracking |
| `/frontend/reports/*` | Reports | Financial reports |
| `/frontend/clients/*` | Clients | Client management |
| `/frontend/settings/*` | Settings | Departments & Projects |

## Key Configuration Files

### vite.config.ts
```typescript
export default defineConfig({
  base: '/frontend/',           // Base path for all assets
  plugins: [react(), tailwindcss()],
  server: {
    port: 4200,
    allowedHosts: ['snabel', 'localhost'],
    hmr: {
      host: 'snabel',
      clientPort: 80,
      path: '/',                // WebSocket at root for nginx
    },
    proxy: {
      '/backend/api': {
        target: 'http://localhost:8080',
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
    },
  },
});
```

### Tailwind CSS v4
Uses new v4 syntax in `src/index.css`:
```css
@import "tailwindcss";
```

NOT the old v3 syntax (`@tailwind base; @tailwind components; @tailwind utilities;`).

## Internationalization

Four languages supported, configured in `src/i18n/config.ts`:
- Norwegian (no) - default
- English (en)
- Polish (pl)
- Ukrainian (uk)

Language switcher in top navigation. Selection persisted to localStorage.

## API Integration

Backend API accessed via `/backend/api/` prefix, proxied through Vite to port 8080.

### Departments API
- `GET /backend/api/departments` - List all
- `POST /backend/api/departments` - Create
- `PUT /backend/api/departments/{id}` - Update
- `DELETE /backend/api/departments/{id}` - Delete

### Projects API
- `GET /backend/api/projects` - List all
- `POST /backend/api/projects` - Create
- `PUT /backend/api/projects/{id}` - Update
- `DELETE /backend/api/projects/{id}` - Delete

## Testing

Playwright E2E tests in `tests/e2e/`:
- `settings-full-test.spec.ts` - Full CRUD operations
- `settings-language-switch.spec.ts` - Language switching
- `settings-all-languages.spec.ts` - All 4 languages
- `settings-css.spec.ts` - Tailwind styling verification

Run tests:
```bash
pnpm exec playwright test
```

## Development Workflow

1. Start backend (separate project):
   ```bash
   cd ../snabel-backend && ./start.sh
   ```

2. Start frontend:
   ```bash
   pnpm run dev
   ```

3. Access at http://localhost:4200/frontend/ or http://snabel/frontend/

## nginx Configuration

Located at `/etc/nginx/sites-enabled/snabel-projects`:
- Proxies `/frontend/` to Vite on port 4200
- Proxies `/backend/` to Quarkus on port 8080
- Includes WebSocket support for Vite HMR
