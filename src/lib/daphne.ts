import { createServerFn } from '@tanstack/react-start'
import { env } from './env'

export type DaphneHealthStatus = {
  ok: boolean
  url: string
  status: number | null
  checkedAt: string
  latencyMs: number
  payload: string | null
  error: string | null
}

function buildDaphneUrl() {
  return new URL(env.daphneHealthPath, env.daphneApiUrl).toString()
}

async function readPayload(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json(), null, 2)
  }

  const text = await response.text()

  return text.length > 0 ? text : null
}

export async function fetchDaphneHealth(): Promise<DaphneHealthStatus> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), env.daphneTimeoutMs)
  const url = buildDaphneUrl()
  const startedAt = Date.now()

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
      },
      signal: controller.signal,
    })

    const payload = await readPayload(response)
    const latencyMs = Date.now() - startedAt

    return {
      ok: response.ok,
      url,
      status: response.status,
      checkedAt: new Date().toISOString(),
      latencyMs,
      payload,
      error: response.ok ? null : `Daphne responded with HTTP ${response.status}`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    return {
      ok: false,
      url,
      status: null,
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      payload: null,
      error: message,
    }
  } finally {
    clearTimeout(timer)
  }
}

export const getDaphneHealth = createServerFn({ method: 'GET' }).handler(
  async () => {
    return fetchDaphneHealth()
  },
)
