import {
  OrganizationSwitcher,
  SignedIn,
  SignInButton,
  SignUpButton,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { clerkEnabled } from '#/lib/env'

export default function HeaderUser() {
  if (!clerkEnabled) {
    return (
      <Badge variant="outline" className="hidden sm:inline-flex">
        Clerk not configured
      </Badge>
    )
  }

  return (
    <>
      <SignedIn>
        <div className="hidden items-center gap-2 lg:flex">
          <OrganizationSwitcher
            hidePersonal={false}
            afterCreateOrganizationUrl="/"
            afterLeaveOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
          />
        </div>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <div className="hidden items-center gap-2 sm:flex">
          <SignInButton forceRedirectUrl="/">
            <Button type="button" variant="ghost" asChild>
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </SignInButton>
          <SignUpButton forceRedirectUrl="/">
            <Button type="button" asChild>
              <Link to="/sign-up">Create account</Link>
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </>
  )
}
