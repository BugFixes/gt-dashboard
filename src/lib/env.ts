function parseTimeout(value: string | undefined, fallback: number) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

export const env = {
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim() ?? '',
  daphneApiUrl:
    import.meta.env.VITE_DAPHNE_API_URL?.trim() ?? 'http://127.0.0.1:8000',
  daphneHealthPath:
    import.meta.env.VITE_DAPHNE_HEALTH_PATH?.trim() ?? '/health',
  daphneTimeoutMs: parseTimeout(
    import.meta.env.VITE_DAPHNE_TIMEOUT_MS,
    5000,
  ),
}

export const clerkEnabled = env.clerkPublishableKey.length > 0
