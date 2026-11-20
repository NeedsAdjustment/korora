const DEV_AUTH_SECRET = 'korora-development-only-secret-change-me-1234567890'
const DEV_AUTH_URL = 'http://localhost:5173'

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim())
}

export function getAuthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET?.trim()

  if (secret && secret.length >= 32) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('BETTER_AUTH_SECRET must be set to at least 32 characters in production')
  }

  console.warn('[auth] BETTER_AUTH_SECRET is missing; using a development-only fallback.')
  return DEV_AUTH_SECRET
}

export function getBaseUrl(): string {
  const url = process.env.BETTER_AUTH_URL?.trim()

  if (url) return url.replace(/\/$/, '')
  if (process.env.NODE_ENV === 'production') {
    throw new Error('BETTER_AUTH_URL must be set in production')
  }

  return DEV_AUTH_URL
}

export function getTrustedOrigins(): string[] {
  const baseUrl = getBaseUrl()
  const extraOrigins = (process.env.WEB_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  const origins = new Set([baseUrl, ...extraOrigins])

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:5173')
    origins.add('http://127.0.0.1:5173')
    origins.add('http://localhost:4173')
    origins.add('http://127.0.0.1:4173')
  }

  return Array.from(origins)
}
