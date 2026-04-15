import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchDaphneHealth } from './daphne'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchDaphneHealth', () => {
  it('returns a healthy result for successful JSON responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        }),
      ),
    )

    const result = await fetchDaphneHealth()

    expect(result.ok).toBe(true)
    expect(result.status).toBe(200)
    expect(result.payload).toContain('"status": "ok"')
    expect(result.url).toBe('http://127.0.0.1:8000/health')
  })

  it('returns an error result when fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('connection refused')
      }),
    )

    const result = await fetchDaphneHealth()

    expect(result.ok).toBe(false)
    expect(result.status).toBeNull()
    expect(result.error).toContain('connection refused')
  })
})
