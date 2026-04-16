import { createFileRoute } from '@tanstack/react-router'
import { Bot, Shield, Ticket, Webhook } from 'lucide-react'
import { ErrorBanner, Field, IntegrationStatus, SecretCard, SuccessBanner } from '@/components/dashboard-shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useDashboardState, resolveAiMode } from '@/lib/dashboard-context'

export const Route = createFileRoute('/_dashboard/integrations')({
  component: DashboardIntegrationsRoute,
})

function DashboardIntegrationsRoute() {
  const {
    provisioning,
    latestAgent,
    currentAccountId,
    agentName,
    setAgentName,
    submitAgent,
    creatingAgent,
    agentError,
    agentSuccess,
  } = useDashboardState()

  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Integration posture</CardTitle>
          <CardDescription>Current state from last provisioned account in this browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <IntegrationStatus label="Ticketing" value={provisioning?.account.ticket_provider || 'not configured'} icon={Ticket} />
          <IntegrationStatus label="AI" value={resolveAiMode(provisioning)} icon={Bot} />
          <IntegrationStatus label="Notifications" value={provisioning?.account.notification_provider || 'not configured'} icon={Webhook} />
          <IntegrationStatus label="Agent" value={latestAgent?.name || 'not created'} icon={Shield} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Runtime agent</CardTitle>
          <CardDescription>Create agent credential pair for `go-bugfixes` and similar senders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end" onSubmit={(event) => void submitAgent(event)}>
            <Field label="Agent name">
              <Input value={agentName} onChange={(event) => setAgentName(event.target.value)} required />
            </Field>
            <Field label="Target account id">
              <Input value={currentAccountId} readOnly disabled={!currentAccountId} />
            </Field>
            <Button type="submit" disabled={creatingAgent || !currentAccountId}>
              {creatingAgent ? 'Creating...' : 'Create agent'}
            </Button>
          </form>

          {agentError ? <ErrorBanner message={agentError} /> : null}
          {agentSuccess ? <SuccessBanner message={agentSuccess} /> : null}

          {latestAgent ? (
            <SecretCard
              title="Latest agent credential"
              fields={[
                ['Agent key', latestAgent.api_key],
                ['Agent secret', latestAgent.api_secret],
              ]}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/45 p-5 text-sm text-[var(--sea-ink-soft)]">
              No agent issued yet. Provision workspace first, then create agent credential.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
