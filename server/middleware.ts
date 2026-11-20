import type { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { getAuth, type Session, type SessionUser } from './auth'

export type Variables = {
  user: SessionUser
  session: Session
}

export async function requireSession(c: Context<{ Variables: Variables }>, next: Next) {
  const session = await getAuth().api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  c.set('user', session.user)
  c.set('session', session.session)
  await next()
}
