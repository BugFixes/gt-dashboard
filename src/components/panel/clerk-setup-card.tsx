import { KeyRound } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'

export default function ClerkSetupCard() {
  return (
    <Alert className="border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)]">
      <KeyRound className="h-4 w-4" />
      <AlertTitle>Add your Clerk publishable key</AlertTitle>
      <AlertDescription>
        Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>.env.local</code>,
        then enable GitHub and Email/Password in the Clerk dashboard. Google can
        be enabled later without changing the panel code.
      </AlertDescription>
    </Alert>
  )
}
