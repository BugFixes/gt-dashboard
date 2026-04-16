import {
  OrganizationSwitcher,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/tanstack-react-start'
import { Link } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-xl">
      <nav className="page-wrap flex items-center gap-3 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <ShieldCheck className="h-4 w-4 text-[var(--lagoon-deep)]" />
            gt-dashboard
          </Link>
        </h2>

        <div className="hidden min-w-0 flex-1 lg:block">
          <p className="truncate text-sm text-[var(--sea-ink-soft)]">
            Incident operations dashboard for ticketing, AI triage, notifications, runtime keys.
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Show when="signed-in">
            <div className="hidden sm:block">
              <OrganizationSwitcher hidePersonal />
            </div>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">Sign in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Start free</Button>
            </SignUpButton>
          </Show>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
