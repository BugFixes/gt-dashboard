import { SignUp } from '@clerk/clerk-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import ClerkSetupCard from '#/components/panel/clerk-setup-card'
import { Button } from '#/components/ui/button'
import { clerkEnabled } from '#/lib/env'

export const Route = createFileRoute('/sign-up')({
  component: SignUpRoute,
})

function SignUpRoute() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[0_22px_48px_rgba(7,28,33,0.1)] sm:p-10">
        <p className="island-kicker mb-2">Authentication</p>
        <h1 className="display-title mb-4 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Create your panel account
        </h1>
        <p className="max-w-2xl text-base text-[var(--sea-ink-soft)]">
          New users can join through GitHub or email/password now, then create a
          Clerk organization for their team workspace.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 text-sm leading-7 text-[var(--sea-ink-soft)]">
            <p>
              This route shares the same redirect target as sign-in, so newly
              created users land on the dashboard shell immediately.
            </p>
            <Button asChild variant="outline">
              <Link to="/sign-in">Already have an account?</Link>
            </Button>
          </div>

          <div className="flex min-h-96 items-center justify-center rounded-[1.5rem] border border-[var(--line)] bg-white/50 p-4 dark:bg-white/3">
            {clerkEnabled ? (
              <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                forceRedirectUrl="/"
                fallbackRedirectUrl="/"
              />
            ) : (
              <ClerkSetupCard />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
