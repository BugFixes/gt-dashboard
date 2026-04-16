import { createFileRoute } from '@tanstack/react-router'
import { RefreshCcw } from 'lucide-react'
import { ErrorBanner, Field, SecretCard, SuccessBanner, formatDate } from '@/components/dashboard-shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDashboardState } from '@/lib/dashboard-context'

export const Route = createFileRoute('/_dashboard/access')({
  component: DashboardAccessRoute,
})

function DashboardAccessRoute() {
  const {
    keyForm,
    setKeyForm,
    submitApiKey,
    creatingKey,
    keyCreateError,
    keyCreateSuccess,
    latestApiKey,
    apiKeys,
    keysError,
    revokingKeyId,
    revokeKey,
    refreshKeys,
    orgStatus,
  } = useDashboardState()

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>API key issuance</CardTitle>
          <CardDescription>System keys for automation. Dev keys tied to one account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={(event) => void submitApiKey(event)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input value={keyForm.name} onChange={(event) => setKeyForm((current) => ({ ...current, name: event.target.value }))} required />
              </Field>
              <Field label="Type">
                <Select value={keyForm.keyType} onValueChange={(value) => setKeyForm((current) => ({ ...current, keyType: value as typeof current.keyType }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose key type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="dev">Dev</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Scope">
                <Select value={keyForm.scope} onValueChange={(value) => setKeyForm((current) => ({ ...current, scope: value as typeof current.scope }))} disabled={keyForm.keyType !== 'system'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingest">Ingest</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Expires on">
                <Input type="date" value={keyForm.expiresAt} onChange={(event) => setKeyForm((current) => ({ ...current, expiresAt: event.target.value }))} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account id for dev key">
                <Input value={keyForm.accountId} onChange={(event) => setKeyForm((current) => ({ ...current, accountId: event.target.value }))} disabled={keyForm.keyType !== 'dev'} placeholder="Required for dev keys" />
              </Field>
              <Field label="Environment tag">
                <Input value={keyForm.environment} onChange={(event) => setKeyForm((current) => ({ ...current, environment: event.target.value }))} placeholder="production" />
              </Field>
            </div>

            {keyCreateError ? <ErrorBanner message={keyCreateError} /> : null}
            {keyCreateSuccess ? <SuccessBanner message={keyCreateSuccess} /> : null}

            <Button type="submit" disabled={creatingKey || orgStatus !== 'connected'}>
              {creatingKey ? 'Creating...' : 'Create API key'}
            </Button>
          </form>

          {latestApiKey ? (
            <SecretCard
              title="Latest API key"
              fields={[
                ['API key', latestApiKey.api_key],
                ['API secret', latestApiKey.api_secret],
              ]}
            />
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Issued keys</CardTitle>
              <CardDescription>Current org key inventory from Daphne.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => void refreshKeys()}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {keysError ? <ErrorBanner message={keysError} /> : null}
          {apiKeys.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div>
                        <p className="m-0 font-semibold">{key.name}</p>
                        <p className="mt-1 mb-0 text-xs text-[var(--sea-ink-soft)]">{key.api_key}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.revoked_at ? 'neutral' : key.key_type === 'system' ? 'good' : 'warn'}>{key.key_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{key.scope}</Badge>
                    </TableCell>
                    <TableCell className="text-[var(--sea-ink-soft)]">{key.environment || '—'}</TableCell>
                    <TableCell className="text-[var(--sea-ink-soft)]">{formatDate(key.expires_at)}</TableCell>
                    <TableCell className="text-[var(--sea-ink-soft)]">
                      {key.revoked_at ? `revoked ${formatDate(key.revoked_at)}` : 'active'}
                    </TableCell>
                    <TableCell className="text-right">
                      {!key.revoked_at ? (
                        <Button variant="destructive" size="sm" onClick={() => void revokeKey(key.id)} disabled={revokingKeyId === key.id}>
                          {revokingKeyId === key.id ? 'Revoking...' : 'Revoke'}
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/45 p-5 text-sm text-[var(--sea-ink-soft)]">
              No API keys issued for current org yet.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
