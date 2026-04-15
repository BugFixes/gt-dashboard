# Panel

TanStack Start panel app bootstrapped with bun, Clerk authentication, Tailwind CSS, and shadcn/ui.

## Stack status

- Tailwind CSS: configured in `src/styles.css` and `vite.config.ts`
- shadcn/ui: configured via `components.json` with generated components in `src/components/ui`
- Clerk: wired into the app shell with safe fallback behavior when the key is missing
- Daphne API: wired through `src/lib/daphne.ts` using a TanStack Start server function

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_CLERK_PUBLISHABLE_KEY`.
3. Point `VITE_DAPHNE_API_URL` at the Rust Daphne server.
4. Run `bun install`.
5. Run `bun --bun run dev`.

Example `.env.local`:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_DAPHNE_API_URL=http://127.0.0.1:8000
VITE_DAPHNE_HEALTH_PATH=/health
VITE_DAPHNE_TIMEOUT_MS=5000
```

## Clerk configuration

Enable these items in the Clerk dashboard:

- GitHub OAuth now
- Email/password now
- Organizations now
- Google later, without panel code changes

The app uses dedicated `/sign-in` and `/sign-up` routes so the auth flow stays stable as providers change.

## Scripts

```bash
bun --bun run dev
bun --bun run build
bun --bun run test
```

## Key files

- `src/routes/index.tsx`: panel landing page and integration status
- `src/routes/sign-in.tsx`: Clerk sign-in route
- `src/routes/sign-up.tsx`: Clerk sign-up route
- `src/lib/env.ts`: runtime env parsing
- `src/lib/daphne.ts`: Daphne health bridge
