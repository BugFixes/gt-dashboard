/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import {
  OrganizationSwitcher,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  ClerkProvider,
} from '@clerk/tanstack-react-start'

import { Button } from '@/components/ui/button'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Bugfixes Panel',
      },
      {
        name: 'description',
        content: 'TanStack Start dashboard for Clerk-authenticated Daphne control plane access.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  component: () => <Outlet />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border/60 bg-background/90 backdrop-blur">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    Bugfixes Panel
                  </p>
                  <h1 className="text-lg font-semibold">Daphne dashboard</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Show when="signed-out">
                    <Button asChild variant="ghost" size="sm">
                      <SignInButton>Sign in</SignInButton>
                    </Button>
                    <Button asChild size="sm">
                      <SignUpButton>Get started</SignUpButton>
                    </Button>
                  </Show>
                  <Show when="signed-in">
                    <OrganizationSwitcher hidePersonal appearance={{ elements: { rootBox: 'hidden sm:flex' } }} />
                    <UserButton />
                  </Show>
                </div>
              </div>
            </header>
            {children}
          </div>
        </ClerkProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
