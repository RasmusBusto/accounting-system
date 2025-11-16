import { createRoot } from 'react-dom/client'
import './index.css'

// Use App.dev.tsx in development for better DX (direct imports, full HMR)
// Use App.tsx in production (module federation)
const isDev = import.meta.env.DEV;
const AppModule = isDev
  ? await import('./App.dev.tsx')
  : await import('./App.tsx');

const App = AppModule.default;

createRoot(document.getElementById('root')!).render(<App />)
