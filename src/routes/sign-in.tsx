import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const getViewer = createServerFn({ method: 'GET' }).handler(async () => {
  const { isAuthenticated } = await auth()
  return { isAuthenticated }
})

export const Route = createFileRoute('/sign-in')({
  beforeLoad: async () => {
    const { isAuthenticated } = await getViewer()

    if (isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: SignInPage,
})

function SignInPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center justify-center px-6 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Bugfixes Panel</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <SignIn forceRedirectUrl="/" signUpUrl="/sign-up" />
        </CardContent>
      </Card>
    </main>
  )
}
