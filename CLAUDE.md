# Claude Code Instructions for Accounting System

## Important: Vite Dev Server

The Vite dev server runs in the background on port 4200. If you perform git operations that change files (e.g., `git checkout`, `git merge`, `git revert`), Vite's file watcher may crash.

**After any git operation that modifies working directory files, verify the server is still running:**
```bash
curl -s http://localhost:4200/frontend/ | head -1
```

**If no response, restart the server:**
```bash
cd /home/petter/snabel/accounting-system && pnpm run dev &
```

**Alternative approach for git operations (avoids crashing Vite):**
Instead of `git checkout main && git merge branch`, push directly to remote:
```bash
git push origin branch-name:main
```

## Project Overview

This is a React accounting system frontend built with:
- Vite + React 19
- Tailwind CSS v4 (use `@import "tailwindcss"` syntax, NOT old `@tailwind` directives)
- TypeScript
- React Router v7
- i18next for internationalization (Norwegian, English, Polish, Ukrainian)

## Key Configuration

- **Base path**: `/frontend/` - all routes and assets use this prefix
- **Dev port**: 4200
- **Backend proxy**: `/backend/api` → `http://localhost:8080/api`
- **nginx**: Reverse proxy at hostname `snabel`

## File Structure

```
src/
  App.tsx              # Main routing
  index.css            # Tailwind v4: @import "tailwindcss"
  components/          # Reusable components
  pages/               # Route pages
  i18n/config.ts       # All translations embedded
  services/api.ts      # Backend API client
```

## Testing

```bash
pnpm exec playwright test
```

## Backend

Quarkus backend runs separately at `/home/petter/snabel/snabel-backend` on port 8080.
