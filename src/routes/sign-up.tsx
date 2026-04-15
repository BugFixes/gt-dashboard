import { SignUp } from '@clerk/tanstack-react-start'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const getViewer = createServerFn({ method: 'GET' }).handler(async () => {
  const { isAuthenticated } = await auth()
  return { isAuthenticated }
})

export const Route = createFileRoute('/sign-up')({
  beforeLoad: async () => {
    const { isAuthenticated } = await getViewer()

    if (isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center justify-center px-6 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your Bugfixes Panel account</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <SignUp forceRedirectUrl="/" signInUrl="/sign-in" />
        </CardContent>
      </Card>
    </main>
  )
}
