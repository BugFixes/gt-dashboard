import { createFileRoute } from '@tanstack/react-router'
import { RefreshCcw } from 'lucide-react'
import { ErrorBanner, MetricCard, formatDate, toneVariant } from '@/components/dashboard-shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDashboardState } from '@/lib/dashboard-context'

export const Route = createFileRoute('/_dashboard/bugs')({
  component: DashboardBugsRoute,
})

function DashboardBugsRoute() {
  const { bugs, criticalBugCount, bugsError, refreshBugs } = useDashboardState()

  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard label="Visible bug clusters" value={String(bugs.length)} description="Returned by `/api/dashboard/bugs`." tone="neutral" />
        <MetricCard label="Critical clusters" value={String(criticalBugCount)} description="Severity mapped from Daphne tone." tone="critical" />
        <MetricCard label="Open integrations" value={String(bugs.filter((bug) => bug.ticket_status !== 'none').length)} description="Clusters with ticket workflow state." tone="good" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Bug inbox</CardTitle>
              <CardDescription>Live bugs from Daphne dashboard API.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => void refreshBugs()}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {bugsError ? <ErrorBanner message={bugsError} /> : null}
          {bugs.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bug</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Occurrences</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Notify</TableHead>
                  <TableHead>Last seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bugs.slice(0, 12).map((bug) => (
                  <TableRow key={bug.id}>
                    <TableCell>
                      <div>
                        <p className="m-0 font-semibold">{bug.title}</p>
                        <p className="mt-1 mb-0 text-xs text-[var(--sea-ink-soft)]">
                          Account {bug.account_name} • Agent {bug.agent_name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={toneVariant(bug.tone)}>{bug.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{bug.language}</Badge>
                    </TableCell>
                    <TableCell className="text-[var(--sea-ink-soft)]">{bug.occurrence_count}</TableCell>
                    <TableCell className="text-[var(--sea-ink-soft)]">{bug.ticket_status}</TableCell>
                    <TableCell className="text-[var(--sea-ink-soft)]">{bug.notification_status}</TableCell>
                    <TableCell className="text-[var(--sea-ink-soft)]">{formatDate(bug.last_seen_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/45 p-5 text-sm text-[var(--sea-ink-soft)]">
              No bugs visible for selected org yet.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
