import type { LucideIcon } from 'lucide-react'
import { Activity, Bot, Building2, KeyRound, ServerCrash } from 'lucide-react'

export type DashboardRoutePath = '/' | '/setup' | '/integrations' | '/access' | '/bugs'

export type DashboardNavItem = {
  to: DashboardRoutePath
  label: string
  description: string
  icon: LucideIcon
  exact?: boolean
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    to: '/',
    label: 'Overview',
    description: 'Org sync, health, intake posture.',
    icon: Activity,
    exact: true,
  },
  {
    to: '/setup',
    label: 'Workspace setup',
    description: 'Project, subproject, env, account.',
    icon: Building2,
  },
  {
    to: '/integrations',
    label: 'Integrations',
    description: 'Ticketing, AI, notifications, agent.',
    icon: Bot,
  },
  {
    to: '/access',
    label: 'Access',
    description: 'API keys and runtime credentials.',
    icon: KeyRound,
  },
  {
    to: '/bugs',
    label: 'Bug inbox',
    description: 'Live bug clusters from Daphne.',
    icon: ServerCrash,
  },
]

export function getActiveDashboardItem(pathname: string): DashboardNavItem {
  return (
    dashboardNavItems.find((item) =>
      item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`),
    ) ?? dashboardNavItems[0]
  )
}
