import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Setup guide</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          What the panel expects locally.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          The scaffold is ready to run without secrets, but Clerk and Daphne
          become fully interactive once you provide the local environment values.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-[var(--line)] bg-[var(--surface-strong)]">
          <CardHeader>
            <CardTitle>Environment</CardTitle>
            <CardDescription>Copy the values into `.env.local`.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-[var(--sea-ink-soft)]">
            <p>
              <code>VITE_CLERK_PUBLISHABLE_KEY</code>: Clerk frontend key.
            </p>
            <p>
              <code>VITE_DAPHNE_API_URL</code>: Base URL for the Rust Daphne API.
            </p>
            <p>
              <code>VITE_DAPHNE_HEALTH_PATH</code>: Health endpoint path, default
              is <code>/health</code>.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--line)] bg-[var(--surface-strong)]">
          <CardHeader>
            <CardTitle>Clerk dashboard</CardTitle>
            <CardDescription>
              Configure providers once, then the panel routes stay stable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-[var(--sea-ink-soft)]">
            <p>Enable GitHub OAuth now.</p>
            <p>Enable Email + Password now.</p>
            <p>Enable Organizations for workspace switching.</p>
            <p>Google can be turned on later with no code changes.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
