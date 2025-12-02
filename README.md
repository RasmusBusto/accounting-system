# Accounting System

A React-based accounting system built with Vite, Tailwind CSS v4, and TypeScript.

## Architecture

```
/accounting-system
  /src
    /components         # Reusable UI components
    /contexts           # React contexts (Auth)
    /i18n               # Internationalization (no, en, pl, uk)
    /pages              # Page components
    /services           # API services
    /types              # TypeScript interfaces
  /tests
    /e2e                # Playwright end-to-end tests
  /docs                 # Documentation
```

## Features

- **Single Page Application**: Clean React app with React Router
- **Tailwind CSS v4**: Modern utility-first styling
- **Internationalization**: Support for Norwegian, English, Polish, Ukrainian
- **Vite Dev Server**: Fast HMR development experience
- **Playwright E2E Tests**: Comprehensive end-to-end testing
- **nginx Proxy**: Production-ready reverse proxy setup

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
cd accounting-system
pnpm install
```

### Development

```bash
pnpm run dev
```

The app runs on port 4200. Access via:
- Direct: http://localhost:4200/frontend/
- Via nginx: http://snabel/frontend/ (if nginx configured)

### Running Tests

```bash
# Run all e2e tests
pnpm exec playwright test

# Run with UI
pnpm exec playwright test --ui
```

### Production Build

```bash
pnpm run build
pnpm run preview
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Styling (`@import "tailwindcss"`)
- **i18next** - Internationalization
- **Playwright** - E2E testing
- **pnpm** - Package manager

## Project Structure

```
src/
  App.tsx              # Main app with routing
  main.tsx             # Entry point
  index.css            # Tailwind v4 import
  components/          # Shared components
    LanguageSwitcher.tsx
    DepartmentForm.tsx
    DepartmentList.tsx
    ProjectForm.tsx
    ProjectList.tsx
  contexts/
    AuthContext.tsx    # Authentication context
  i18n/
    config.ts          # i18n setup with all translations
  pages/
    Dashboard.tsx
    Invoicing.tsx
    Expenses.tsx
    Reports.tsx
    Clients.tsx
    Settings.tsx
  services/
    api.ts             # Backend API client
  types/
    index.ts           # TypeScript interfaces
```

## Configuration

### Vite Config (`vite.config.ts`)

Key settings:
- `base: '/frontend/'` - App served under /frontend/ path
- `server.port: 4200` - Dev server port
- `server.allowedHosts: ['snabel', 'localhost']` - Allowed hostnames
- `server.hmr` - WebSocket config for HMR through nginx
- `server.proxy` - Proxy /backend/api to Quarkus backend on port 8080

### nginx Setup

The app is designed to work behind nginx:
- `/frontend/` - Proxied to Vite on port 4200
- `/backend/` - Proxied to Quarkus on port 8080
- WebSocket support for Vite HMR

## Backend Integration

The frontend connects to a Quarkus backend at `/backend/api/`:
- `GET /backend/api/departments` - List departments
- `POST /backend/api/departments` - Create department
- `PUT /backend/api/departments/{id}` - Update department
- `DELETE /backend/api/departments/{id}` - Delete department
- Similar endpoints for projects

## Documentation

See `docs/` folder for additional documentation.

## License

ISC
