import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
} from '@clerk/clerk-react'
import { ArrowRight, Building2 } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { clerkEnabled } from '#/lib/env'

export default function OrganizationCard() {
  return (
    <Card className="border-[var(--line)] bg-[var(--surface-strong)] shadow-[0_18px_40px_rgba(7,28,33,0.08)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-[var(--sea-ink)]">
          <Building2 className="h-5 w-5 text-[var(--lagoon-deep)]" />
          Clerk organizations
        </CardTitle>
        <CardDescription className="text-[var(--sea-ink-soft)]">
          GitHub and email/password sign-in feed the same Clerk identity so the
          panel can attach users to organizations from day one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!clerkEnabled ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 p-4 text-sm text-[var(--sea-ink-soft)] dark:bg-white/3">
            Add `VITE_CLERK_PUBLISHABLE_KEY` to enable sign-in, sign-up, and
            organization switching.
          </div>
        ) : null}

        {clerkEnabled ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">GitHub now</Badge>
              <Badge variant="secondary">Email/password now</Badge>
              <Badge variant="outline">Google later without code changes</Badge>
            </div>

            <SignedIn>
              <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4 dark:bg-white/3">
                <p className="mb-3 text-sm text-[var(--sea-ink-soft)]">
                  Use the organization switcher to create a workspace or jump
                  between existing ones.
                </p>
                <OrganizationSwitcher
                  hidePersonal={false}
                  afterCreateOrganizationUrl="/"
                  afterLeaveOrganizationUrl="/"
                  afterSelectOrganizationUrl="/"
                />
              </div>
            </SignedIn>

            <SignedOut>
              <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4 dark:bg-white/3">
                <p className="mb-3 text-sm text-[var(--sea-ink-soft)]">
                  Sign in first, then Clerk will let you create or select an
                  organization for the panel workspace.
                </p>
                <SignInButton forceRedirectUrl="/">
                  <Button type="button" className="w-full sm:w-auto">
                    Sign in to manage organizations
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
