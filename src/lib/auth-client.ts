import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import type { Auth } from '../../server/auth'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<Auth>(),
  ],
})

export const { signIn, signOut, useSession } = authClient
