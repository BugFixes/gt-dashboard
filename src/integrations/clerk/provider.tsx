import { ClerkProvider } from '@clerk/clerk-react'
import { clerkEnabled, env } from '#/lib/env'

export default function AppClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  if (!clerkEnabled) {
    return children
  }

  return (
    <ClerkProvider
      publishableKey={env.clerkPublishableKey}
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}
