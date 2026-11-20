import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { getPrisma } from './db'
import { getAuthSecret, getBaseUrl, getTrustedOrigins } from './env'

export function createAuth() {
  return betterAuth({
    appName: 'Korora',
    baseURL: getBaseUrl(),
    secret: getAuthSecret(),
    database: prismaAdapter(getPrisma(), {
      provider: 'postgresql',
    }),
    trustedOrigins: getTrustedOrigins(),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 4,
      maxPasswordLength: 128,
      autoSignIn: false,
    },
    user: {
      additionalFields: {
        firstName: {
          type: 'string',
          required: true,
          input: true,
        },
        lastName: {
          type: 'string',
          required: true,
          input: true,
        },
        dinner: {
          type: 'boolean',
          required: false,
          defaultValue: false,
          input: true,
        },
        bridalParty: {
          type: 'boolean',
          required: false,
          defaultValue: false,
          input: true,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    advanced: {
      database: {
        generateId: 'uuid',
      },
    },
  })
}

export type Auth = ReturnType<typeof createAuth>

let authInstance: Auth | undefined

export function getAuth(): Auth {
  if (!authInstance) authInstance = createAuth()
  return authInstance
}

export type SessionResult = Awaited<ReturnType<Auth['api']['getSession']>>
export type SessionUser = NonNullable<SessionResult>['user']
export type Session = NonNullable<SessionResult>['session']
