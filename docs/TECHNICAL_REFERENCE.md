# Technical Reference

## Module Federation Implementation

### How Module Federation Works

Module Federation allows JavaScript applications to dynamically load code from other applications at runtime. In this project:

1. **Shell (Host)** declares remote applications
2. **MFEs (Remotes)** expose their modules
3. At runtime, shell loads MFE code on-demand
4. Shared dependencies are loaded once and reused

### Configuration Deep Dive

#### Shell Configuration (`apps/shell/vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',                    // Application name
      remotes: {                        // Remote applications to load
        dashboard: 'http://localhost:4201/assets/remoteEntry.js',
        invoicing: 'http://localhost:4202/assets/remoteEntry.js',
        expenses: 'http://localhost:4203/assets/remoteEntry.js',
        reports: 'http://localhost:4204/assets/remoteEntry.js',
        clients: 'http://localhost:4205/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 4200,
    strictPort: true,                   // Fail if port is in use
  },
  preview: {
    port: 4200,
  },
  build: {
    target: 'esnext',
    minify: false,                      // Easier debugging
    cssCodeSplit: false                 // Single CSS file
  }
})
```

#### MFE Configuration (`apps/dashboard/vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'dashboard',                // Application name
      filename: 'remoteEntry.js',       // Entry point filename
      exposes: {                        // What this app exposes
        './Module': './src/App.tsx',    // Expose main component
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 4201,
    strictPort: true,
  },
  preview: {
    port: 4201,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
```

### Loading Remotes in Shell

#### Dynamic Import Pattern

```typescript
// apps/shell/src/App.tsx
import { lazy, Suspense } from 'react';

// Lazy load remote modules
const Dashboard = lazy(() => import('dashboard/Module'));
const Invoicing = lazy(() => import('invoicing/Module'));
// ... etc

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices/*" element={<Invoicing />} />
        {/* ... etc */}
      </Routes>
    </Suspense>
  );
}
```

#### TypeScript Declarations

```typescript
// apps/shell/src/remotes.d.ts
declare module 'dashboard/Module' {
  const Module: React.ComponentType;
  export default Module;
}
// ... repeat for each remote
```

## Routing Architecture

### Shell-Level Routing

The shell handles top-level routing and lazy-loads MFEs:

```typescript
<BrowserRouter>
  <Layout>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices/*" element={<Invoicing />} />
        <Route path="/expenses/*" element={<Expenses />} />
        <Route path="/reports/*" element={<Reports />} />
        <Route path="/clients/*" element={<Clients />} />
      </Routes>
    </Suspense>
  </Layout>
</BrowserRouter>
```

**Key Points**:
- Wildcard routes (`/*`) allow MFEs to handle sub-routes
- Suspense boundary provides loading state
- Layout component wraps all routes

### MFE-Level Routing

Each MFE handles its own internal routes:

```typescript
// apps/invoicing/src/App.tsx
import { Routes, Route } from 'react-router-dom';

export function App() {
  return (
    <Routes>
      <Route index element={<InvoiceList />} />
      <Route path="new" element={<CreateInvoice />} />
      <Route path=":id" element={<InvoiceDetail />} />
      <Route path=":id/edit" element={<EditInvoice />} />
    </Routes>
  );
}
```

**URL Examples**:
- `/invoices` → InvoiceList
- `/invoices/new` → CreateInvoice
- `/invoices/123` → InvoiceDetail
- `/invoices/123/edit` → EditInvoice

## Authentication Architecture

### AuthContext Implementation

```typescript
// apps/shell/src/contexts/AuthContext.tsx
import { createContext, useState, type ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  login: (credentials: Credentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    return { id: 1, name: 'Demo User', email: 'demo@example.com' };
  });

  const login = (credentials: Credentials) => {
    console.log('Login attempt:', credentials.email);
    setUser({ id: 1, name: 'Demo User', email: credentials.email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

### Using Auth in MFEs

MFEs can access auth context (once it's properly shared):

```typescript
import { useContext } from 'react';
import { AuthContext } from 'shell/AuthContext';

function ProtectedComponent() {
  const auth = useContext(AuthContext);

  if (!auth?.isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome {auth.user?.name}</div>;
}
```

## Styling with Tailwind CSS

### Configuration

```javascript
// tailwind.config.js
export default {
  content: [
    "./apps/*/index.html",
    "./apps/*/src/**/*.{js,ts,jsx,tsx}",
    "./packages/*/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### PostCSS Setup

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### CSS Imports

Each app imports Tailwind directives:

```css
/* apps/*/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  min-height: 100vh;
}
```

### Using Tailwind in Components

```tsx
function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Card Title
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Design System

### Button Component

```tsx
// packages/design-system/src/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Card Component

```tsx
// packages/design-system/src/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
```

### Input Component

```tsx
// packages/design-system/src/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
        {...props}
      />
    </div>
  );
}
```

## Process Management

### startme.sh Script Flow

```
1. Create .pids directory
   ↓
2. Start dashboard MFE (port 4201)
   - Run: cd apps/dashboard && pnpm run dev
   - Save PID to .pids/dashboard.pid
   - Log output to .pids/dashboard.log
   ↓
3. Repeat for all MFEs (invoicing, expenses, reports, clients)
   ↓
4. Wait 5 seconds for MFEs to initialize
   ↓
5. Start shell app (port 4200)
   - Run: cd apps/shell && pnpm run dev
   - Save PID to .pids/shell.pid
   - Log output to .pids/shell.log
   ↓
6. Display status and service URLs
```

### stopme.sh Script Flow

```
1. Stop shell app
   - Read PID from .pids/shell.pid
   - Send SIGTERM signal
   - Wait up to 5 seconds
   - Force kill if still running (SIGKILL)
   ↓
2. Repeat for all MFEs
   ↓
3. Clean up log files
   - Remove all .log files from .pids/
   ↓
4. Check for stray processes
   - Use lsof to find processes on ports 4200-4205
   - Kill any found processes
   ↓
5. Display completion status
```

## Build Process

### Development Build

```bash
# Each app runs Vite dev server
cd apps/dashboard
pnpm run dev
```

**Process**:
1. Vite starts dev server with HMR
2. Module Federation plugin configures runtime
3. Source maps are generated
4. Assets are served from memory

### Production Build

```bash
# Build for production
cd apps/dashboard
pnpm run build
```

**Process**:
1. TypeScript compilation (`tsc -b`)
2. Vite builds optimized bundles
3. Module Federation creates remoteEntry.js
4. Assets are hashed and output to dist/

**Output Structure**:
```
dist/
├── assets/
│   ├── index-[hash].js           # Main application code
│   ├── remoteEntry.js            # Module Federation entry
│   ├── __federation_*.js         # Shared chunks
│   └── style-[hash].css          # Styles
└── index.html                    # Entry HTML
```

## Network Communication

### Development Mode

```
┌──────────┐
│  Shell   │  Port 4200
│ (Host)   │
└────┬─────┘
     │
     ├─► http://localhost:4201/assets/remoteEntry.js (Dashboard)
     ├─► http://localhost:4202/assets/remoteEntry.js (Invoicing)
     ├─► http://localhost:4203/assets/remoteEntry.js (Expenses)
     ├─► http://localhost:4204/assets/remoteEntry.js (Reports)
     └─► http://localhost:4205/assets/remoteEntry.js (Clients)
```

### Request Flow

1. User visits http://localhost:4200
2. Shell loads and renders layout
3. User navigates to /invoices
4. React Router matches route
5. Lazy import triggers: `import('invoicing/Module')`
6. Module Federation requests remoteEntry.js from port 4202
7. Invoicing app code is downloaded and executed
8. Component renders in shell's route

## Error Handling

### Loading Errors

```tsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* ... routes */}
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

function ErrorFallback({ error }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded">
      <h2 className="text-xl font-bold text-red-800">
        Something went wrong
      </h2>
      <p className="text-red-600">{error.message}</p>
    </div>
  );
}
```

### Module Federation Errors

Common issues and solutions:

1. **Remote not available**
   - Error: Failed to fetch remote entry
   - Solution: Ensure MFE is running on expected port

2. **Version mismatch**
   - Error: Shared module version conflict
   - Solution: Align React versions across all apps

3. **TypeScript errors**
   - Error: Cannot find module 'remote/Module'
   - Solution: Add declarations in remotes.d.ts

## Performance Optimization

### Code Splitting

```tsx
// Lazy load within MFE
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Shared Dependencies

React, React-DOM, and React Router are loaded once:

```
Shell loads React → 566 KB
Dashboard uses same React → 0 KB additional
Invoicing uses same React → 0 KB additional
Total React download: 566 KB (not 2.8 MB)
```

### Caching Strategy

1. **Module Federation chunks**: Cached by hash
2. **Shared dependencies**: Cached across apps
3. **Static assets**: Versioned with hashes

## Security Considerations

### Current State (Demo)

- No real authentication
- No CSRF protection
- No XSS prevention beyond React defaults
- All traffic over HTTP (not HTTPS)

### Production Requirements

1. **Authentication**
   - JWT tokens in httpOnly cookies
   - Refresh token rotation
   - Secure token storage

2. **Authorization**
   - Role-based access control (RBAC)
   - Route guards in shell
   - API-level permission checks

3. **HTTPS**
   - All production traffic over HTTPS
   - HSTS headers
   - Secure cookies

4. **Content Security Policy**
   - Restrict script sources
   - Prevent XSS attacks
   - Frame options for clickjacking prevention

5. **Input Validation**
   - Sanitize all user inputs
   - Validate on client and server
   - Protect against injection attacks

## Deployment Architecture

### Recommended Setup

```
┌─────────────────────────────────────────┐
│          CDN / Load Balancer             │
│        (app.example.com)                 │
└───────────────┬─────────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
┌───▼────┐          ┌───────▼──────┐
│ Shell  │          │     MFEs     │
│ (Host) │          │  (Remotes)   │
│        │          │              │
│ Nginx  │          │  - dashboard │
│ Port   │          │  - invoicing │
│ 4200   │          │  - expenses  │
└────────┘          │  - reports   │
                    │  - clients   │
                    │              │
                    │  Nginx per   │
                    │  MFE or CDN  │
                    └──────────────┘
```

### Environment Variables

```bash
# .env.production (shell)
VITE_DASHBOARD_URL=https://dashboard.example.com
VITE_INVOICING_URL=https://invoicing.example.com
VITE_EXPENSES_URL=https://expenses.example.com
VITE_REPORTS_URL=https://reports.example.com
VITE_CLIENTS_URL=https://clients.example.com
```

## Monitoring & Debugging

### Development Tools

1. **React DevTools**: Inspect component tree
2. **Vite Inspector**: View module graph
3. **Network Tab**: Monitor Module Federation requests

### Logging

```typescript
// Add logging in Module Federation
const Dashboard = lazy(() => {
  console.log('Loading Dashboard MFE');
  return import('dashboard/Module');
});
```

### Performance Monitoring

```typescript
// Measure load time
const startTime = performance.now();
const Dashboard = lazy(() =>
  import('dashboard/Module').then(module => {
    const loadTime = performance.now() - startTime;
    console.log(`Dashboard loaded in ${loadTime}ms`);
    return module;
  })
);
```

---

**Last Updated**: November 9, 2025
**Version**: 1.0.0
