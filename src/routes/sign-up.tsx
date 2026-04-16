import { SignUp } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/sign-up')({ component: SignUpPage })

function SignUpPage() {
  return (
    <main className="page-wrap px-4 py-10 sm:py-16">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Use email/password or enabled social identity providers.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/" />
        </CardContent>
      </Card>
    </main>
  )
}
