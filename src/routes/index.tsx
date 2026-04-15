import { auth } from '@clerk/tanstack-react-start/server'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ArrowRight, Building2, Github, KeyRound, ShieldCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getDaphneStatus } from '@/lib/daphne'

const getSessionState = createServerFn({ method: 'GET' }).handler(async () => {
  const { isAuthenticated, orgId, userId } = await auth()

  if (!isAuthenticated || !userId) {
    throw redirect({
      to: '/sign-in',
    })
  }

  return { orgId, userId }
})

export const Route = createFileRoute('/')({
  loader: async () => {
    const session = await getSessionState()
    const daphne = await getDaphneStatus()

    return { daphne, session }
  },
  component: App,
})

function App() {
  const { daphne, session } = Route.useLoaderData()
  const daphneVariant = daphne.reachable ? 'default' : 'secondary'

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader className="gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Clerk secured</Badge>
              <Badge variant={daphneVariant}>{daphne.reachable ? 'Daphne reachable' : 'Daphne needs attention'}</Badge>
            </div>
            <CardTitle className="text-4xl tracking-tight sm:text-5xl">
              Operate Daphne from a typed, authenticated panel.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              The panel now runs on TanStack Start, uses Tailwind plus shadcn/ui,
              authenticates with Clerk, and forwards auth when checking the Daphne API.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <StatusTile label="User" value={session.userId} />
            <StatusTile label="Organization" value={session.orgId ?? 'No org selected'} />
            <StatusTile label="API URL" value={daphne.baseUrl ?? 'Not configured'} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="size-5 text-primary" />
              Auth model
            </CardTitle>
            <CardDescription>
              Designed for Clerk organizations with provider mix managed in Clerk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <Capability icon={Github} title="GitHub now" copy="Works with Clerk social connections without hard-coding a GitHub-only path." />
            <Capability icon={KeyRound} title="Email/password" copy="Included through Clerk-hosted auth so org membership flows stay compatible." />
            <Capability icon={Building2} title="Org aware" copy="The header exposes an organization switcher for multi-tenant bugfixes usage." />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daphne connectivity</CardTitle>
            <CardDescription>
              Server-side health check against the Rust API using <code>DAPHNE_API_URL</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-4 py-3">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={daphneVariant}>{daphne.summary}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatusTile label="Configured" value={daphne.configured ? 'Yes' : 'No'} />
              <StatusTile label="Clerk token forwarded" value={daphne.authForwarded ? 'Yes' : 'No'} />
              <StatusTile label="HTTP status" value={daphne.statusCode ? String(daphne.statusCode) : 'n/a'} />
              <StatusTile label="Reachable" value={daphne.reachable ? 'Healthy' : 'Unavailable'} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next configuration</CardTitle>
            <CardDescription>
              The app is wired; remaining provider setup stays in Clerk and Daphne.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">1. Clerk dashboard</p>
              <p>Enable GitHub now, keep email/password enabled, and add Google later without changing app code.</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium text-foreground">2. Environment</p>
              <p>Set <code>CLERK_PUBLISHABLE_KEY</code>, <code>CLERK_SECRET_KEY</code>, and <code>DAPHNE_API_URL</code> from <code>.env.example</code>.</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium text-foreground">3. Daphne auth</p>
              <p>Accept Clerk bearer tokens on the Rust API so the panel can upgrade from health checks to authenticated API actions.</p>
            </div>
            <Button asChild className="w-fit">
              <a href="https://clerk.com/docs/quickstarts/tanstack-start" target="_blank" rel="noreferrer">
                Clerk Start docs
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/80 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 break-all text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

function Capability({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Github
  title: string
  copy: string
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border/70 bg-muted/30 p-4">
      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 leading-6">{copy}</p>
      </div>
    </div>
  )
}
