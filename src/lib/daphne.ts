import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'

type DaphneStatus = {
  baseUrl: string | null
  configured: boolean
  authForwarded: boolean
  reachable: boolean
  statusCode: number | null
  summary: string
}

function getDaphneApiUrl() {
  return process.env.DAPHNE_API_URL ?? process.env.VITE_DAPHNE_API_URL ?? null
}

export const getDaphneStatus = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DaphneStatus> => {
    const baseUrl = getDaphneApiUrl()

    if (!baseUrl) {
      return {
        baseUrl: null,
        configured: false,
        authForwarded: false,
        reachable: false,
        statusCode: null,
        summary: 'Set DAPHNE_API_URL to enable panel-to-Daphne calls.',
      }
    }

    const { getToken } = await auth()
    const token = await getToken()

    try {
      const healthUrl = new URL('/health', baseUrl)
      const response = await fetch(healthUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      return {
        baseUrl,
        configured: true,
        authForwarded: Boolean(token),
        reachable: response.ok,
        statusCode: response.status,
        summary: response.ok
          ? 'Daphne responded to /health successfully.'
          : `Daphne responded with HTTP ${response.status}.`,
      }
    } catch (error) {
      return {
        baseUrl,
        configured: true,
        authForwarded: Boolean(token),
        reachable: false,
        statusCode: null,
        summary:
          error instanceof Error
            ? error.message
            : 'Unknown error contacting Daphne.',
      }
    }
  },
)
