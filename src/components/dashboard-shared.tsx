import { Copy, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function MetricCard({
  label,
  value,
  description,
  tone,
}: {
  label: string
  value: string
  description: string
  tone: 'good' | 'warn' | 'critical' | 'neutral'
}) {
  return (
    <Card>
      <CardContent className="space-y-3 px-5 py-5">
        <Badge variant={tone}>{label}</Badge>
        <div>
          <p className="m-0 text-3xl font-semibold tracking-tight text-[var(--sea-ink)]">{value}</p>
          <p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ConfigBlock({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: LucideIcon
  children: ReactNode
}) {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-white/55 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--lagoon-deep)]" />
        <p className="m-0 font-semibold text-[var(--sea-ink)]">{title}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export function IntegrationStatus({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3">
      <span className="rounded-xl border border-[var(--line)] bg-white/70 p-2 text-[var(--lagoon-deep)]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">{label}</p>
        <p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">{value}</p>
      </div>
    </div>
  )
}

export function StatusRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'good' | 'warn' | 'critical' | 'neutral'
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3">
      <span className="text-[var(--sea-ink-soft)]">{label}</span>
      <Badge variant={tone}>{value}</Badge>
    </div>
  )
}

export function SignalTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <Icon className="mb-3 h-4 w-4 text-white/90" />
      <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/62">{label}</p>
      <p className="mt-2 mb-0 text-sm font-medium text-white">{value}</p>
    </div>
  )
}

export function FlowStep({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon
  title: string
  body: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/55 p-4">
      <Icon className="mt-0.5 h-4 w-4 text-[var(--lagoon-deep)]" />
      <div>
        <p className="m-0 font-semibold text-[var(--sea-ink)]">{title}</p>
        <p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">{body}</p>
      </div>
    </div>
  )
}

export function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-2xl border border-[var(--line)] bg-white/55 p-3 sm:grid-cols-[140px_1fr] sm:items-center">
      <dt className="text-[var(--sea-ink-soft)]">{label}</dt>
      <dd className="m-0 font-mono text-xs text-[var(--sea-ink)]">{value}</dd>
    </div>
  )
}

export function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--sea-ink-soft)]">{label}</span>
      <span className="font-medium text-[var(--sea-ink)]">{value}</span>
    </div>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <Alert className="border-rose-200 bg-rose-50/85 text-rose-900">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <Alert className="border-emerald-200 bg-emerald-50/85 text-emerald-900">
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export function SecretCard({ title, fields }: { title: string; fields: Array<[string, string]> }) {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-[#102127] p-4 text-white">
      <div className="mb-3 text-sm font-semibold">{title}</div>
      <div className="space-y-3">
        {fields.map(([label, value]) => (
          <div key={label}>
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/55">{label}</p>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <code className="flex-1 overflow-hidden border-0 bg-transparent p-0 text-xs text-white">{value}</code>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 border border-white/10 bg-white/5 px-2 text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => navigator.clipboard.writeText(value)}
                aria-label={`Copy ${label}`}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function toneVariant(tone: string): 'good' | 'warn' | 'critical' | 'neutral' {
  switch (tone) {
    case 'good':
      return 'good'
    case 'warn':
      return 'warn'
    case 'critical':
      return 'critical'
    default:
      return 'neutral'
  }
}
