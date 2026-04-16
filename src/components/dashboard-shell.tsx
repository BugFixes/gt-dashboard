import { OrganizationSwitcher, Show } from '@clerk/tanstack-react-start'
import { Link, useLocation } from '@tanstack/react-router'
import { DashboardStateProvider } from '@/lib/dashboard-context'
import { dashboardNavItems, getActiveDashboardItem } from '@/lib/dashboard-navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReactNode } from 'react'
import ThemeToggle from './ThemeToggle'

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  })
  const activeItem = getActiveDashboardItem(pathname)

  return (
    <>
      <Show when="signed-out">
        <div className="page-wrap px-4 py-6 lg:px-6 lg:py-8">
          <Card className="mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                Use Clerk auth to access organization dashboard routes and Daphne-backed workspace data.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[var(--sea-ink-soft)]">
              Pick sign in or sign up from top bar. GitHub and Google appear when enabled in Clerk.
            </CardContent>
          </Card>
        </div>
      </Show>
      <Show when="signed-in">
        <DashboardStateProvider>
          <div className="page-wrap px-4 py-6 lg:px-6 lg:py-8">
            <div className="dashboard-grid min-h-[calc(100vh-9rem)] gap-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="dashboard-sidebar-panel space-y-5 rounded-[28px] border border-[var(--line)] p-5">
                <div className="space-y-4">
                  <Badge variant="default">gt-dashboard</Badge>
                  <div>
                    <h1 className="m-0 text-2xl font-semibold tracking-tight text-[var(--sea-ink)]">
                      Incident operations
                    </h1>
                    <p className="mt-2 mb-0 text-sm leading-6 text-[var(--sea-ink-soft)]">
                      Ticket routing, AI triage, notification delivery, and runtime credential control.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--line)] bg-white/60 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sea-ink-soft)]">
                      Organization
                    </p>
                    <OrganizationSwitcher hidePersonal />
                  </div>
                </div>

                <nav className="space-y-2" aria-label="Dashboard sections">
                  {dashboardNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        activeOptions={item.exact ? { exact: true } : undefined}
                        className="dashboard-section-link"
                        activeProps={{ className: 'dashboard-section-link is-active' }}
                      >
                        <span className="dashboard-section-icon">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 text-left">
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className="mt-1 block text-xs text-current/70">{item.description}</span>
                        </span>
                      </Link>
                    )
                  })}
                </nav>
              </aside>

              <section className="min-w-0 space-y-6">
                <div className="dashboard-top-panel rounded-[28px] border border-[var(--line)] px-6 py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sea-ink-soft)]">
                        Workspace
                      </p>
                      <h2 className="m-0 text-2xl font-semibold tracking-tight text-[var(--sea-ink)]">
                        {activeItem.label}
                      </h2>
                      <p className="mt-2 mb-0 text-sm text-[var(--sea-ink-soft)]">
                        {activeItem.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                {children}
              </section>
            </div>
          </div>
        </DashboardStateProvider>
      </Show>
    </>
  )
}
