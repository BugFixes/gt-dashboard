import { useEffect, useState, useTransition } from 'react'
import { AlertCircle, CheckCircle2, RefreshCcw, TimerReset } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
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
import { Skeleton } from '#/components/ui/skeleton'
import { getDaphneHealth } from '#/lib/daphne'
import type { DaphneHealthStatus } from '#/lib/daphne'

export default function DaphneStatusCard() {
  const [status, setStatus] = useState<DaphneHealthStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function refresh() {
    startTransition(async () => {
      setError(null)

      try {
        const nextStatus = await getDaphneHealth()
        setStatus(nextStatus)
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Unable to reach Daphne')
      }
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  const showSkeleton = isPending && status === null
  const currentError = error ?? status?.error ?? null

  return (
    <Card className="border-[var(--line)] bg-[var(--surface-strong)] shadow-[0_18px_40px_rgba(7,28,33,0.08)]">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl text-[var(--sea-ink)]">
            Daphne API bridge
            <Badge
              variant="outline"
              className={status?.ok ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : ''}
            >
              {status?.ok ? 'online' : status ? 'attention' : 'checking'}
            </Badge>
          </CardTitle>
          <CardDescription className="text-[var(--sea-ink-soft)]">
            Same-origin server function proxy for the Rust Daphne service.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={refresh}
          disabled={isPending}
        >
          <RefreshCcw className={isPending ? 'animate-spin' : ''} />
          Refresh status
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSkeleton ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : null}

        {!showSkeleton && currentError ? (
          <Alert variant="destructive" className="border-red-500/25 bg-red-500/8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Daphne needs attention</AlertTitle>
            <AlertDescription>{currentError}</AlertDescription>
          </Alert>
        ) : null}

        {!showSkeleton && status ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Endpoint" value={status.url} />
              <Metric
                label="HTTP status"
                value={status.status === null ? 'No response' : String(status.status)}
              />
              <Metric label="Latency" value={`${status.latencyMs} ms`} />
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--sea-ink)]">Latest payload</p>
              <pre className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[#10202a] p-4 text-xs leading-6 text-slate-100">
                <code>{status.payload ?? 'No payload returned.'}</code>
              </pre>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--sea-ink-soft)]">
              <span className="inline-flex items-center gap-1.5">
                {status.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
                {status.ok
                  ? 'Panel can reach Daphne through the configured health endpoint.'
                  : 'Panel reached Daphne, but the service did not return a healthy response.'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <TimerReset className="h-4 w-4" />
                Checked {new Date(status.checkedAt).toLocaleTimeString()}
              </span>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/50 p-4 dark:bg-white/3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sea-ink-soft)]">
        {label}
      </p>
      <p className="mt-2 break-all text-sm font-medium text-[var(--sea-ink)]">{value}</p>
    </div>
  )
}
