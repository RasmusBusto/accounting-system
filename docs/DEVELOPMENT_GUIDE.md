# Development Guide

## Getting Started

### Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/shell access

### First Time Setup

1. **Clone or navigate to the repository**:
   ```bash
   cd /home/petter/dev/snabel/accounting-system
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start all services**:
   ```bash
   ./startme.sh
   ```

4. **Open in browser**:
   - Navigate to http://localhost:4200

5. **Verify everything works**:
   - Click through all navigation links
   - Check that all pages load

## Development Workflow

### Daily Workflow

```bash
# Morning - Start your services
./startme.sh

# During day - Make changes
# Edit files in apps/ or packages/
# Browser will auto-refresh for most changes

# Evening - Stop services
./stopme.sh
```

### Making Changes

#### Editing an MFE

1. **Navigate to the MFE**:
   ```bash
   cd apps/dashboard
   ```

2. **Edit the component**:
   ```typescript
   // apps/dashboard/src/App.tsx
   function App() {
     return (
       <div>
         <h1>My Changes</h1>
         {/* Add your code here */}
       </div>
     );
   }
   ```

3. **Save the file**:
   - Vite HMR will auto-reload (usually)
   - If not, manually refresh browser

4. **Test your changes**:
   - Navigate to http://localhost:4201 (direct MFE)
   - Or http://localhost:4200 (through shell)

#### Editing Shared Components

1. **Add a new component**:
   ```bash
   cd packages/design-system/src
   touch NewComponent.tsx
   ```

2. **Implement the component**:
   ```typescript
   // packages/design-system/src/NewComponent.tsx
   export function NewComponent() {
     return <div>New Component</div>;
   }
   ```

3. **Export it**:
   ```typescript
   // packages/design-system/src/index.ts
   export { Button } from './Button';
   export { Card } from './Card';
   export { Input } from './Input';
   export { NewComponent } from './NewComponent'; // Add this
   ```

4. **Use it in an app**:
   ```typescript
   import { NewComponent } from '@accounting-system/design-system';
   ```

## Common Tasks

### Adding a New Page to an MFE

Example: Adding an invoice detail page

1. **Create the component**:
   ```bash
   cd apps/invoicing/src
   mkdir pages
   touch pages/InvoiceDetail.tsx
   ```

2. **Implement the page**:
   ```typescript
   // apps/invoicing/src/pages/InvoiceDetail.tsx
   import { useParams } from 'react-router-dom';

   export function InvoiceDetail() {
     const { id } = useParams();

     return (
       <div className="p-6">
         <h1 className="text-2xl font-bold">Invoice #{id}</h1>
         {/* Invoice details here */}
       </div>
     );
   }
   ```

3. **Add the route**:
   ```typescript
   // apps/invoicing/src/App.tsx
   import { Routes, Route } from 'react-router-dom';
   import { InvoiceDetail } from './pages/InvoiceDetail';

   export default function App() {
     return (
       <Routes>
         <Route index element={<InvoiceList />} />
         <Route path=":id" element={<InvoiceDetail />} />
       </Routes>
     );
   }
   ```

4. **Test the route**:
   - Navigate to http://localhost:4200/invoices/123

### Adding API Integration

Example: Fetching invoices from an API

1. **Create an API client**:
   ```bash
   cd apps/invoicing/src
   mkdir services
   touch services/api.ts
   ```

2. **Implement the client**:
   ```typescript
   // apps/invoicing/src/services/api.ts
   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

   export async function getInvoices() {
     const response = await fetch(`${API_BASE}/invoices`);
     if (!response.ok) throw new Error('Failed to fetch invoices');
     return response.json();
   }

   export async function getInvoice(id: string) {
     const response = await fetch(`${API_BASE}/invoices/${id}`);
     if (!response.ok) throw new Error('Failed to fetch invoice');
     return response.json();
   }
   ```

3. **Use in component**:
   ```typescript
   import { useState, useEffect } from 'react';
   import { getInvoices } from './services/api';

   function InvoiceList() {
     const [invoices, setInvoices] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       getInvoices()
         .then(setInvoices)
         .finally(() => setLoading(false));
     }, []);

     if (loading) return <div>Loading...</div>;

     return (
       <div>
         {invoices.map(invoice => (
           <div key={invoice.id}>{invoice.number}</div>
         ))}
       </div>
     );
   }
   ```

### Adding Environment Variables

1. **Create .env file**:
   ```bash
   cd apps/invoicing
   touch .env.local
   ```

2. **Add variables** (prefix with VITE_):
   ```bash
   # apps/invoicing/.env.local
   VITE_API_URL=http://localhost:3000
   VITE_FEATURE_FLAG_X=true
   ```

3. **Use in code**:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   const featureEnabled = import.meta.env.VITE_FEATURE_FLAG_X === 'true';
   ```

4. **Add to .gitignore** (already done):
   ```
   .env.local
   .env.*.local
   ```

### Styling with Tailwind

#### Using Utility Classes

```tsx
<div className="p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900 mb-4">
    Title
  </h2>
  <p className="text-gray-600">
    Description
  </p>
</div>
```

#### Responsive Design

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Columns adapt to screen size */}
</div>
```

#### Hover States

```tsx
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Click me
</button>
```

#### Custom Classes (if needed)

```css
/* apps/invoicing/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded;
  }
}
```

## Testing

### Manual Testing

1. **Start all services**:
   ```bash
   ./startme.sh
   ```

2. **Test each MFE individually**:
   - Dashboard: http://localhost:4201
   - Invoicing: http://localhost:4202
   - Expenses: http://localhost:4203
   - Reports: http://localhost:4204
   - Clients: http://localhost:4205

3. **Test through shell**:
   - Navigate to http://localhost:4200
   - Click all navigation links
   - Verify each MFE loads correctly

4. **Test navigation**:
   - Use browser back/forward buttons
   - Verify URLs update correctly

### Adding Unit Tests

1. **Create test file**:
   ```bash
   touch apps/dashboard/src/App.test.tsx
   ```

2. **Write test**:
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { render, screen } from '@testing-library/react';
   import App from './App';

   describe('Dashboard App', () => {
     it('renders dashboard title', () => {
       render(<App />);
       expect(screen.getByText('Dashboard')).toBeInTheDocument();
     });
   });
   ```

3. **Run tests**:
   ```bash
   cd apps/dashboard
   pnpm test
   ```

## Debugging

### Browser DevTools

1. **Open DevTools**: F12 or Right-click → Inspect

2. **Check Console** for errors and logs

3. **Network Tab** to see Module Federation requests:
   - Look for `remoteEntry.js` requests
   - Verify they return 200 status

4. **React DevTools** to inspect component tree:
   - Install browser extension
   - View props, state, and context

### Vite DevTools

1. **Check terminal** where services are running

2. **View logs**:
   ```bash
   # Shell logs
   tail -f .pids/shell.log

   # MFE logs
   tail -f .pids/dashboard.log
   ```

3. **Common warnings**:
   - HMR connection errors: Usually harmless, reload page
   - Module not found: Check import paths
   - Port in use: Another process using the port

### Module Federation Issues

#### MFE not loading

**Symptom**: Blank page or loading spinner stuck

**Debug steps**:
1. Check if MFE is running: `curl http://localhost:4201`
2. Check browser console for errors
3. Check Network tab for failed requests
4. Verify MFE port in shell's vite.config.ts

**Solution**:
```bash
# Restart the MFE
./stopme.sh
./startme.sh
```

#### TypeScript errors

**Symptom**: `Cannot find module 'dashboard/Module'`

**Solution**: Check `apps/shell/src/remotes.d.ts`:
```typescript
declare module 'dashboard/Module' {
  const Module: React.ComponentType;
  export default Module;
}
```

#### Version conflicts

**Symptom**: React hooks errors, duplicate React warnings

**Solution**: Ensure all apps use same React version:
```bash
# Check versions
pnpm list react -r

# Update if needed
pnpm update react react-dom -r
```

## Git Workflow

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/add-invoice-form
   ```

2. **Make your changes**:
   - Edit files
   - Test locally

3. **Stage changes**:
   ```bash
   git add .
   ```

4. **Commit**:
   ```bash
   git commit -m "Add invoice creation form

   - Created InvoiceForm component
   - Added form validation
   - Integrated with API endpoint

   🤖 Generated with Claude Code

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

5. **Push** (when ready):
   ```bash
   git push origin feature/add-invoice-form
   ```

### Commit Message Guidelines

**Format**:
```
<type>: <short summary>

<detailed description>

<optional footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/config changes

**Example**:
```
feat: Add invoice PDF export

- Implemented PDF generation using jsPDF
- Added download button to invoice detail page
- Styled PDF to match brand guidelines

Closes #123
```

## Performance Tips

### Development Performance

1. **Use HMR effectively**:
   - Keep components small
   - Avoid full page refreshes

2. **Lazy load heavy dependencies**:
   ```typescript
   const HeavyChart = lazy(() => import('./HeavyChart'));
   ```

3. **Profile with React DevTools**:
   - Check for unnecessary re-renders
   - Use React.memo() where appropriate

### Build Performance

1. **Analyze bundle size**:
   ```bash
   cd apps/dashboard
   pnpm run build
   # Check dist/ folder size
   ```

2. **Code splitting**:
   ```typescript
   // Split by route
   const InvoiceDetail = lazy(() => import('./pages/InvoiceDetail'));
   ```

3. **Tree shaking**:
   ```typescript
   // Import only what you need
   import { Button } from '@accounting-system/design-system';
   // Not: import * as Components from '@accounting-system/design-system';
   ```

## Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :4200

# Kill the process
kill -9 <PID>

# Or use the stop script
./stopme.sh
```

### pnpm install fails

```bash
# Clear cache
pnpm store prune

# Remove node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Clean install
pnpm install
```

### Build fails

```bash
# Check for TypeScript errors
cd apps/dashboard
pnpm run build

# Common issues:
# - Type errors: Fix TypeScript issues
# - Missing dependencies: pnpm install
# - Port in use: Stop other processes
```

### HMR not working

```bash
# Restart dev server
./stopme.sh
./startme.sh

# Or restart individual MFE
cd apps/dashboard
pnpm run dev
```

## Code Style

### TypeScript Guidelines

1. **Use explicit types**:
   ```typescript
   // Good
   function getInvoice(id: string): Promise<Invoice> {
     return fetch(`/api/invoices/${id}`).then(r => r.json());
   }

   // Avoid
   function getInvoice(id) {
     return fetch(`/api/invoices/${id}`).then(r => r.json());
   }
   ```

2. **Use interfaces for objects**:
   ```typescript
   interface Invoice {
     id: string;
     number: string;
     amount: number;
     date: Date;
   }
   ```

3. **Use type for unions**:
   ```typescript
   type Status = 'draft' | 'sent' | 'paid' | 'overdue';
   ```

### React Guidelines

1. **Use functional components**:
   ```typescript
   // Good
   function MyComponent({ name }: Props) {
     return <div>{name}</div>;
   }

   // Avoid class components
   ```

2. **Use hooks**:
   ```typescript
   const [count, setCount] = useState(0);
   useEffect(() => {
     // Side effect
   }, []);
   ```

3. **Destructure props**:
   ```typescript
   // Good
   function Card({ title, children }: CardProps) {
     return <div>{title}{children}</div>;
   }

   // Avoid
   function Card(props: CardProps) {
     return <div>{props.title}{props.children}</div>;
   }
   ```

### Tailwind Guidelines

1. **Use utility classes**:
   ```tsx
   <div className="p-4 bg-white rounded shadow">
   ```

2. **Group related utilities**:
   ```tsx
   <div className="
     p-4 m-2
     bg-white text-gray-900
     rounded shadow
     hover:shadow-lg
   ">
   ```

3. **Use responsive modifiers**:
   ```tsx
   <div className="text-sm md:text-base lg:text-lg">
   ```

## Best Practices

### Component Organization

```
apps/invoicing/src/
├── components/          # Reusable components
│   ├── InvoiceCard.tsx
│   └── InvoiceForm.tsx
├── pages/              # Route components
│   ├── InvoiceList.tsx
│   └── InvoiceDetail.tsx
├── services/           # API clients
│   └── api.ts
├── types/              # TypeScript types
│   └── invoice.ts
├── utils/              # Utility functions
│   └── formatters.ts
├── App.tsx             # Main component
└── main.tsx            # Entry point
```

### Naming Conventions

- **Components**: PascalCase (`InvoiceCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useInvoices.ts`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Types**: PascalCase (`Invoice.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Error Handling

```typescript
async function fetchInvoices() {
  try {
    const response = await fetch('/api/invoices');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    throw error; // Re-throw for caller to handle
  }
}
```

## Resources

### Documentation
- React: https://react.dev
- Vite: https://vitejs.dev
- React Router: https://reactrouter.com
- Tailwind: https://tailwindcss.com
- Module Federation: https://module-federation.io

### Tools
- VS Code Extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - TypeScript Vue Plugin (Volar)

### Getting Help

1. Check this documentation
2. Read error messages carefully
3. Check browser console
4. Check service logs in `.pids/*.log`
5. Search GitHub issues
6. Ask team members

---

**Last Updated**: November 9, 2025
**Maintainer**: Development Team
