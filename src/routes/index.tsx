import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Cable, LayoutPanelTop, ShieldCheck } from 'lucide-react'
import ClerkSetupCard from '#/components/panel/clerk-setup-card'
import DaphneStatusCard from '#/components/panel/daphne-status-card'
import OrganizationCard from '#/components/panel/organization-card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { clerkEnabled } from '#/lib/env'

export const Route = createFileRoute('/')({ component: App })

const platformHighlights: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: 'Panel shell',
    description:
      'A responsive home route, setup guide, and auth routes are ready to extend.',
    icon: LayoutPanelTop,
  },
  {
    title: 'Clerk auth',
    description:
      'Hosted sign-in and sign-up flows support GitHub, email/password, and organizations.',
    icon: ShieldCheck,
  },
  {
    title: 'Daphne bridge',
    description:
      'The panel pings Daphne from a TanStack Start server function to avoid browser CORS surprises.',
    icon: Cable,
  },
  {
    title: 'Reusable UI',
    description:
      'Tailwind and shadcn are configured so new screens can stay consistent.',
    icon: ArrowRight,
  },
]

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary">TanStack Start</Badge>
          <Badge variant="secondary">Clerk auth</Badge>
          <Badge variant="secondary">Daphne API</Badge>
          <Badge variant="secondary">shadcn/ui</Badge>
        </div>
        <p className="island-kicker mb-3">Panel control surface</p>
        <h1 className="display-title mb-5 max-w-4xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          UI, authentication, and Daphne integration in one place.
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          The panel now boots with bun, ships on TanStack Start, supports Clerk
          organizations, and validates connectivity to the Rust Daphne API over a
          same-origin server bridge.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/sign-in">
              Open sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/about">Review setup guide</Link>
          </Button>
        </div>
      </section>

      {!clerkEnabled ? (
        <section className="mt-8">
          <ClerkSetupCard />
        </section>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformHighlights.map(({ title, description, icon: Icon }, index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <Icon className="mb-4 h-5 w-5 text-[var(--lagoon-deep)]" />
            <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
              {title}
            </h2>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
              {description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <DaphneStatusCard />
        <OrganizationCard />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <AuthReadiness />
        <IntegrationNotes />
      </section>
    </main>
  )
}

function AuthReadiness() {
  return (
    <Card className="border-[var(--line)] bg-[var(--surface-strong)] shadow-[0_18px_40px_rgba(7,28,33,0.08)]">
      <CardHeader>
        <CardTitle className="text-xl text-[var(--sea-ink)]">Authentication flows</CardTitle>
        <CardDescription className="text-[var(--sea-ink-soft)]">
          Clerk routes are configured for a staged rollout of identity providers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <FlowStep label="Now" title="GitHub OAuth" />
          <FlowStep label="Now" title="Email/password" />
          <FlowStep label="Later" title="Google OAuth" />
        </div>
        <Separator />
        {clerkEnabled ? (
          <>
            <SignedOut>
              <p className="text-sm text-[var(--sea-ink-soft)]">
                Sign in or create an account to test the live Clerk flows.
              </p>
            </SignedOut>
            <SignedIn>
              <p className="text-sm text-[var(--sea-ink-soft)]">
                The panel is ready for authenticated organization-aware routes.
              </p>
            </SignedIn>
          </>
        ) : (
          <p className="text-sm text-[var(--sea-ink-soft)]">
            Add a Clerk publishable key locally to exercise the auth routes.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function IntegrationNotes() {
  return (
    <Card className="border-[var(--line)] bg-[var(--surface-strong)] shadow-[0_18px_40px_rgba(7,28,33,0.08)]">
      <CardHeader>
        <CardTitle className="text-xl text-[var(--sea-ink)]">What ships in this scaffold</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-7 text-[var(--sea-ink-soft)]">
        <p>
          <code>src/lib/env.ts</code> centralizes the Clerk and Daphne runtime
          configuration.
        </p>
        <p>
          <code>src/lib/daphne.ts</code> exposes a typed server function the UI
          can reuse for health checks and later API calls.
        </p>
        <p>
          Header sign-in, sign-up, user, and organization affordances are in
          place without hard-crashing when Clerk keys are still missing.
        </p>
      </CardContent>
    </Card>
  )
}

function FlowStep({ label, title }: { label: string; title: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/50 p-4 dark:bg-white/3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sea-ink-soft)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--sea-ink)]">{title}</p>
    </div>
  )
}
