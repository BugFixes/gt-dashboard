import { createFileRoute } from '@tanstack/react-router'
import { BellRing, Bot, CheckCircle2, ChevronRight, GitBranch, Shield, Ticket, Waypoints } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  ConfigBlock,
  ErrorBanner,
  Field,
  FlowStep,
  MetaRow,
  StatusRow,
  SuccessBanner,
} from '@/components/dashboard-shared'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboardState, resolveAiMode } from '@/lib/dashboard-context'

export const Route = createFileRoute('/_dashboard/setup')({
  component: DashboardSetupRoute,
})

type SetupStepId = 'organization' | 'structure' | 'ticketing' | 'ai' | 'notifications' | 'review'

const setupSteps: Array<{
  id: SetupStepId
  label: string
  description: string
}> = [
  {
    id: 'organization',
    label: 'Organization',
    description: 'Auto-provision selected Clerk org in Daphne.',
  },
  {
    id: 'structure',
    label: 'Structure',
    description: 'Define project, subproject, environment.',
  },
  {
    id: 'ticketing',
    label: 'Ticketing',
    description: 'Choose ticket provider and credential.',
  },
  {
    id: 'ai',
    label: 'AI',
    description: 'Choose managed or customer AI mode.',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Route delivery and severity threshold.',
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Check payload then provision workspace.',
  },
]

function DashboardSetupRoute() {
  const {
    organizationName,
    hasOrgSelected,
    canManageOrg,
    orgStatus,
    backendOrg,
    orgError,
    syncingOrg,
    connectOrganization,
    setupForm,
    setSetupForm,
    submitSetup,
    setupError,
    setupSuccess,
    submittingSetup,
    provisioning,
  } = useDashboardState()
  const [activeStep, setActiveStep] = useState<SetupStepId>('organization')

  const currentStepIndex = setupSteps.findIndex((step) => step.id === activeStep)
  const canGoNext = useMemo(() => {
    switch (activeStep) {
      case 'organization':
        return orgStatus === 'connected'
      case 'structure':
        return Boolean(
          setupForm.projectName.trim() &&
            setupForm.subprojectName.trim() &&
            setupForm.environmentName.trim(),
        )
      case 'ticketing':
        return !setupForm.createTickets || setupForm.ticketProvider === 'none' || Boolean(setupForm.ticketingApiKey.trim())
      case 'ai':
        return setupForm.aiMode !== 'customer' || Boolean(setupForm.aiApiKey.trim())
      case 'notifications':
        return setupForm.notificationProvider === 'none' || Boolean(setupForm.notificationApiKey.trim())
      case 'review':
        return false
      default:
        return false
    }
  }, [activeStep, orgStatus, setupForm])

  function goNext() {
    if (!canGoNext || currentStepIndex === setupSteps.length - 1) {
      return
    }
    setActiveStep(setupSteps[currentStepIndex + 1]?.id ?? 'review')
  }

  function goBack() {
    if (currentStepIndex <= 0) {
      return
    }
    setActiveStep(setupSteps[currentStepIndex - 1]?.id ?? 'organization')
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <Card>
        <CardHeader>
          <CardTitle>Setup steps</CardTitle>
          <CardDescription>One workspace part per step. No giant setup slab.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {setupSteps.map((step, index) => {
            const active = step.id === activeStep
            const complete = index < currentStepIndex

            return (
              <Button
                key={step.id}
                type="button"
                variant="ghost"
                className={`${buttonVariants({ variant: 'ghost' })} dashboard-section-link ${active ? 'is-active' : ''}`}
                onClick={() => setActiveStep(step.id)}
              >
                <span className="dashboard-section-icon">
                  {complete ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-semibold">{index + 1}</span>}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-semibold">{step.label}</span>
                  <span className="mt-1 block text-xs text-current/70">{step.description}</span>
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            )
          })}

          <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4 text-sm text-[var(--sea-ink-soft)]">
            Daphne still provisions ticketing, AI, notifications through one environment request.
            Wizard only spreads capture across steps.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{setupSteps[currentStepIndex]?.label}</CardTitle>
              <CardDescription>{setupSteps[currentStepIndex]?.description}</CardDescription>
            </div>
            <Badge variant="default">Step {currentStepIndex + 1} of {setupSteps.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {activeStep === 'organization' ? (
            <div className="space-y-4">
              <StatusRow label="Selected Clerk org" value={organizationName || 'none'} tone={hasOrgSelected ? 'good' : 'neutral'} />
              <StatusRow label="Backend org" value={backendOrg?.organization.name || 'not connected'} tone={backendOrg ? 'good' : orgStatus === 'missing' ? 'warn' : 'neutral'} />
              <StatusRow label="Sync status" value={orgStatus} tone={orgStatus === 'connected' ? 'good' : orgStatus === 'missing' ? 'warn' : orgStatus === 'error' ? 'critical' : 'neutral'} />

              {syncingOrg ? (
                <div className="rounded-2xl border border-sky-200 bg-sky-50/85 p-4 text-sm text-sky-950">
                  <p className="m-0 font-semibold">Auto-provisioning org.</p>
                  <p className="mt-1 mb-0">Clerk org is being created in Daphne now.</p>
                </div>
              ) : null}

              {orgStatus !== 'connected' && !syncingOrg ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/85 p-4 text-sm text-amber-900">
                  <p className="m-0 font-semibold">Workspace setup starts with org sync.</p>
                  <p className="mt-1 mb-3">Auto-create works for Clerk org admins/owners. Retry if needed.</p>
                  <Button onClick={() => void connectOrganization()} disabled={syncingOrg || !canManageOrg || !hasOrgSelected}>
                    Retry org create
                  </Button>
                </div>
              ) : null}

              {orgStatus === 'connected' ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/85 p-4 text-sm text-emerald-900">
                  <p className="m-0 font-semibold">Organization connected.</p>
                  <p className="mt-1 mb-0">Proceed to workspace structure.</p>
                </div>
              ) : null}

              {orgError ? <ErrorBanner message={orgError} /> : null}
            </div>
          ) : null}

          {activeStep === 'structure' ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Project name">
                  <Input value={setupForm.projectName} onChange={(event) => setSetupForm((current) => ({ ...current, projectName: event.target.value }))} required />
                </Field>
                <Field label="Subproject name">
                  <Input value={setupForm.subprojectName} onChange={(event) => setSetupForm((current) => ({ ...current, subprojectName: event.target.value }))} required />
                </Field>
                <Field label="Environment name">
                  <Input value={setupForm.environmentName} onChange={(event) => setSetupForm((current) => ({ ...current, environmentName: event.target.value }))} required />
                </Field>
              </div>

              <div className="space-y-4 text-sm">
                <FlowStep icon={GitBranch} title="Project" body="Top-level product or workspace grouping." />
                <FlowStep icon={Waypoints} title="Subproject" body="Service or codebase inside project." />
                <FlowStep icon={Shield} title="Environment" body="Provisioned Daphne account for runtime intake." />
              </div>
            </div>
          ) : null}

          {activeStep === 'ticketing' ? (
            <ConfigBlock title="Ticketing" icon={Ticket}>
              <label className="flex items-center gap-2 text-sm text-[var(--sea-ink-soft)]">
                <Checkbox checked={setupForm.createTickets} onCheckedChange={(checked) => setSetupForm((current) => ({ ...current, createTickets: checked === true }))} />
                Create ticket on qualifying bug
              </label>
              <Field label="Provider">
                <Select value={setupForm.ticketProvider} onValueChange={(value) => setSetupForm((current) => ({ ...current, ticketProvider: value as typeof current.ticketProvider }))} disabled={!setupForm.createTickets}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jira">Jira</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="tracklines">Tracklines</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Credential">
                <Input type="password" placeholder="Token or API key" value={setupForm.ticketingApiKey} onChange={(event) => setSetupForm((current) => ({ ...current, ticketingApiKey: event.target.value }))} disabled={!setupForm.createTickets || setupForm.ticketProvider === 'none'} />
              </Field>
            </ConfigBlock>
          ) : null}

          {activeStep === 'ai' ? (
            <ConfigBlock title="AI" icon={Bot}>
              <Field label="Mode">
                <Select value={setupForm.aiMode} onValueChange={(value) => setSetupForm((current) => ({ ...current, aiMode: value as typeof current.aiMode }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose AI mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="managed">Managed AI</SelectItem>
                    <SelectItem value="customer">Customer-managed key</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Customer key">
                <Input type="password" placeholder="Bring your own AI key" value={setupForm.aiApiKey} onChange={(event) => setSetupForm((current) => ({ ...current, aiApiKey: event.target.value }))} disabled={setupForm.aiMode !== 'customer'} />
              </Field>
              <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
                Managed mode uses Daphne-managed advisor. Customer mode stores one customer API key.
              </p>
            </ConfigBlock>
          ) : null}

          {activeStep === 'notifications' ? (
            <ConfigBlock title="Notifications" icon={BellRing}>
              <Field label="Provider">
                <Select value={setupForm.notificationProvider} onValueChange={(value) => setSetupForm((current) => ({ ...current, notificationProvider: value as typeof current.notificationProvider }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="teams">Teams</SelectItem>
                    <SelectItem value="resend">Resend</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Credential">
                <Input type="password" placeholder="Webhook or API key" value={setupForm.notificationApiKey} onChange={(event) => setSetupForm((current) => ({ ...current, notificationApiKey: event.target.value }))} disabled={setupForm.notificationProvider === 'none'} />
              </Field>
              <Field label="Minimum severity">
                <Select value={setupForm.notifyMinLevel} onValueChange={(value) => setSetupForm((current) => ({ ...current, notifyMinLevel: value as typeof current.notifyMinLevel }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warn</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="fatal">Fatal</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Rapid occurrence window (minutes)">
                  <Input type="number" min="1" value={setupForm.rapidOccurrenceWindowMinutes} onChange={(event) => setSetupForm((current) => ({ ...current, rapidOccurrenceWindowMinutes: event.target.value }))} required />
                </Field>
                <Field label="Rapid occurrence threshold">
                  <Input type="number" min="1" value={setupForm.rapidOccurrenceThreshold} onChange={(event) => setSetupForm((current) => ({ ...current, rapidOccurrenceThreshold: event.target.value }))} required />
                </Field>
              </div>
            </ConfigBlock>
          ) : null}

          {activeStep === 'review' ? (
            <form className="space-y-6" onSubmit={(event) => void submitSetup(event)}>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">Structure</p>
                  <MetaRow label="Project" value={setupForm.projectName || '—'} />
                  <MetaRow label="Subproject" value={setupForm.subprojectName || '—'} />
                  <MetaRow label="Environment" value={setupForm.environmentName || '—'} />
                </div>

                <div className="space-y-3">
                  <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">Workflow</p>
                  <MetaRow label="Ticketing" value={setupForm.createTickets ? setupForm.ticketProvider : 'disabled'} />
                  <MetaRow label="AI" value={setupForm.aiMode} />
                  <MetaRow label="Notifications" value={setupForm.notificationProvider} />
                  <MetaRow label="Notify level" value={setupForm.notifyMinLevel} />
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4 text-sm text-[var(--sea-ink-soft)]">
                Final provision call creates project, subproject, environment, backing account in Daphne.
              </div>

              {setupError ? <ErrorBanner message={setupError} /> : null}
              {setupSuccess ? <SuccessBanner message={setupSuccess} /> : null}

              <Button type="submit" disabled={submittingSetup || orgStatus !== 'connected'}>
                {submittingSetup ? 'Provisioning...' : 'Provision workspace'}
              </Button>

              {provisioning ? (
                <div className="space-y-3 pt-4">
                  <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">Latest provisioning</p>
                  <MetaRow label="Account" value={provisioning.account.id} />
                  <MetaRow label="Environment" value={provisioning.environment.name} />
                  <MetaRow label="Ticketing" value={provisioning.account.ticket_provider} />
                  <MetaRow label="Notifications" value={provisioning.account.notification_provider} />
                  <MetaRow label="AI" value={resolveAiMode(provisioning)} />
                </div>
              ) : null}
            </form>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
            <Button type="button" variant="outline" onClick={goBack} disabled={currentStepIndex === 0}>
              Back
            </Button>
            <Button type="button" onClick={goNext} disabled={!canGoNext || activeStep === 'review'}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
