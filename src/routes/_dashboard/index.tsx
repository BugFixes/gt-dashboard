import { Show, SignInButton, SignUpButton } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'
import { BellRing, Bot, KeyRound, ServerCrash, Ticket } from 'lucide-react'
import { ErrorBanner, MetricCard, SignalTile, StatusRow } from '@/components/dashboard-shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardState, resolveAiMode } from '@/lib/dashboard-context'
import { getDaphneBaseUrl } from '@/lib/daphne'

export const Route = createFileRoute('/_dashboard/')({
  component: DashboardOverviewRoute,
})

function DashboardOverviewRoute() {
  const {
    authLoaded,
    userLoaded,
    hasOrgSelected,
    organizationName,
    health,
    orgStatus,
    orgError,
    backendOrg,
    bugs,
    criticalBugCount,
    activeSystemKeys,
    provisioning,
    latestAgent,
    canManageOrg,
    syncingOrg,
    connectOrganization,
  } = useDashboardState()

  return (
    <>
      <Show when="signed-out">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="dashboard-hero overflow-hidden border-none text-white">
            <CardHeader className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/14 text-white shadow-none">Control plane</Badge>
                <Badge className="bg-white/10 text-white shadow-none">Hosted incident ops</Badge>
              </div>
              <div className="space-y-4">
                <CardTitle className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Professional incident dashboard, not landing page.
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7 text-slate-100/88">
                  Sign in, pick org, connect Daphne, provision workspace, issue runtime creds,
                  review bug intake.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SignalTile icon={Ticket} label="Ticketing" value="Jira, GitHub, Linear" />
              <SignalTile icon={Bot} label="AI" value="Managed or customer key" />
              <SignalTile icon={BellRing} label="Notifications" value="Slack, Teams, Resend" />
              <SignalTile icon={KeyRound} label="Runtime auth" value="Agents and API keys" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Clerk handles email/password, orgs, GitHub SSO, Google SSO.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4 text-sm text-[var(--sea-ink-soft)]">
                Enable GitHub and Google in Clerk dashboard. Hosted auth components pick them up.
              </div>
              <div className="flex flex-wrap gap-3">
                <SignInButton mode="modal">
                  <Button>Sign in</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="secondary">Create account</Button>
                </SignUpButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </Show>

      <section className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-4">
          <MetricCard label="Critical bugs" value={String(criticalBugCount)} description="Current visible critical cluster count." tone="critical" />
          <MetricCard label="Bug clusters" value={String(bugs.length)} description="Rows from Daphne bug inbox." tone="neutral" />
          <MetricCard label="System keys" value={String(activeSystemKeys)} description="Active org-level automation keys." tone="good" />
          <MetricCard label="Workspace ready" value={provisioning ? 'yes' : 'no'} description="Project and account provisioned." tone={provisioning ? 'good' : 'warn'} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="dashboard-hero overflow-hidden border-none text-white">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/14 text-white shadow-none">Live intake</Badge>
                <Badge className="bg-white/10 text-white shadow-none">{getDaphneBaseUrl()}</Badge>
              </div>
              <CardTitle className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Real dashboard shell around live Daphne workflow.
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7 text-slate-100/88">
                Current backend supports org sync, project stack provisioning, agents, API keys,
                bug inbox. Provider collection APIs still pending in Daphne.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SignalTile icon={Ticket} label="Ticket provider" value={provisioning?.account.ticket_provider || 'not set'} />
              <SignalTile icon={Bot} label="AI mode" value={resolveAiMode(provisioning)} />
              <SignalTile icon={BellRing} label="Notification provider" value={provisioning?.account.notification_provider || 'not set'} />
              <SignalTile icon={ServerCrash} label="Latest agent" value={latestAgent?.name || 'not created'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization sync</CardTitle>
              <CardDescription>Clerk org must exist in Daphne before setup flow works.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusRow label="Dashboard auth" value={authLoaded && userLoaded ? 'signed in' : 'loading'} tone="good" />
              <StatusRow label="Selected Clerk org" value={organizationName || 'none'} tone={hasOrgSelected ? 'good' : 'neutral'} />
              <StatusRow label="Backend org" value={backendOrg?.organization.name || 'not connected'} tone={backendOrg ? 'good' : orgStatus === 'missing' ? 'warn' : 'neutral'} />
              <StatusRow label="Backend" value={health === 'up' ? 'online' : health === 'down' ? 'offline' : 'checking'} tone={health === 'up' ? 'good' : health === 'down' ? 'critical' : 'neutral'} />
              {syncingOrg ? (
                <div className="rounded-2xl border border-sky-200 bg-sky-50/85 p-4 text-sm text-sky-950">
                  <p className="m-0 font-semibold">Auto-creating Daphne org.</p>
                  <p className="mt-1 mb-0">Selected Clerk organization is being provisioned in backend.</p>
                </div>
              ) : null}
              {orgStatus === 'missing' ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/85 p-4 text-sm text-amber-900">
                  <p className="m-0 font-semibold">Selected Clerk org not provisioned in Daphne.</p>
                  <p className="mt-1 mb-3">Auto-create only runs for Clerk org owners/admins.</p>
                  <Button onClick={() => void connectOrganization()} disabled={syncingOrg || !canManageOrg}>
                    Retry org create
                  </Button>
                </div>
              ) : null}
              {orgError ? <ErrorBanner message={orgError} /> : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
