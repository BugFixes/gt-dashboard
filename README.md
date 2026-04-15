# Bugfixes Panel

TanStack Start dashboard for the Bugfixes panel. The app uses Tailwind CSS, a minimal `shadcn/ui` component set, Clerk authentication, and a server-side Daphne API health check.

## Environment

Copy `.env.example` to `.env` and set:

- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DAPHNE_API_URL`

Clerk should keep email/password enabled and can enable GitHub now plus Google later without code changes. The UI also exposes Clerk organization switching for multi-tenant access.

## Commands

```bash
bun install
bun run dev
bun run build
bun test
```
