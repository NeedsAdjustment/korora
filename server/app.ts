import { Hono, type Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { getAuth } from './auth'
import { DatabaseNotConfiguredError, getPrisma } from './db'
import { requireSession, type Variables } from './middleware'
import { giftUpdateSchema, rsvpApiSchema } from '../src/shared/schemas'
import type { DashboardUser, Gift, Rsvp } from '../src/shared/types'

const app = new Hono<{ Variables: Variables }>().basePath('/api')

app.use('*', secureHeaders())
app.use('*', async (c, next) => {
  c.header('Cache-Control', 'no-store')
  await next()
})
if (process.env.NODE_ENV !== 'production') app.use('*', logger())

const DATABASE_UNAVAILABLE_MESSAGE =
  'The demo database is not connected. Please check back shortly.'

function databaseUnavailable(c: Context<{ Variables: Variables }>) {
  console.warn('[api] DATABASE_URL is not configured')
  return c.json({ error: DATABASE_UNAVAILABLE_MESSAGE }, 503)
}

function isDatabaseUnavailable(error: unknown): boolean {
  return error instanceof DatabaseNotConfiguredError
}

function cleanText(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function toRsvp(user: {
  rsvp: boolean | null
  rsvpOthersYes: string | null
  rsvpOthersNo: string | null
  rsvpDate: Date | null
}): Rsvp {
  return {
    attending: user.rsvp,
    othersAttending: user.rsvpOthersYes,
    othersNotAttending: user.rsvpOthersNo,
    updatedAt: user.rsvpDate?.toISOString() ?? null,
  }
}

function toDashboardUser(user: {
  id: string
  firstName: string
  lastName: string
  dinner: boolean
  bridalParty: boolean
  rsvp: boolean | null
  rsvpOthersYes: string | null
  rsvpOthersNo: string | null
  rsvpDate: Date | null
}): DashboardUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    dinner: user.dinner,
    bridalParty: user.bridalParty,
    rsvp: toRsvp(user),
  }
}

app.get('/health', async (c) => {
  if (!process.env.DATABASE_URL) {
    return c.json({ ok: false, database: false }, 503)
  }

  try {
    await getPrisma().$queryRaw`SELECT 1`
    return c.json({ ok: true, database: true })
  } catch {
    return c.json({ ok: false, database: false }, 503)
  }
})

// Accounts are seeded for the demo. Do not expose public registration.
app.post('/auth/sign-up/*', (c) => {
  return c.json({ error: 'Sign-up is disabled on this demo.' }, 403)
})

app.all('/auth/*', async (c) => {
  try {
    return await getAuth().handler(c.req.raw)
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailable(c)
    throw error
  }
})

app.get('/me', requireSession, async (c) => {
  const sessionUser = c.get('user')
  const user = await getPrisma().user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dinner: true,
      bridalParty: true,
      rsvp: true,
      rsvpOthersYes: true,
      rsvpOthersNo: true,
      rsvpDate: true,
    },
  })

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' })
  }

  return c.json({ user: toDashboardUser(user) })
})

app.put('/rsvp', requireSession, async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = rsvpApiSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Please check your RSVP details and try again.' }, 422)
  }

  const sessionUser = c.get('user')
  const { attending, othersAttending, othersNotAttending } = parsed.data

  const updated = await getPrisma().user.update({
    where: { id: sessionUser.id },
    data: {
      rsvp: attending,
      rsvpOthersYes: attending ? cleanText(othersAttending) : null,
      rsvpOthersNo: attending ? cleanText(othersNotAttending) : null,
      rsvpDate: new Date(),
    },
    select: {
      rsvp: true,
      rsvpOthersYes: true,
      rsvpOthersNo: true,
      rsvpDate: true,
    },
  })

  return c.json({ rsvp: toRsvp(updated) })
})

app.get('/gifts', requireSession, async (c) => {
  const sessionUser = c.get('user')
  const gifts = await getPrisma().gift.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      link: true,
      price: true,
      userId: true,
    },
  })

  const response: Gift[] = gifts.map((gift) => ({
    id: gift.id,
    name: gift.name,
    link: gift.link,
    price: gift.price,
    reserved: gift.userId !== null,
    reservedByMe: gift.userId === sessionUser.id,
  }))

  return c.json({ gifts: response })
})

app.patch('/gifts/:id', requireSession, async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = giftUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid gift update.' }, 422)
  }

  const sessionUser = c.get('user')
  const giftId = c.req.param('id')
  const prisma = getPrisma()
  const gift = await prisma.gift.findUnique({
    where: { id: giftId },
    select: { id: true, userId: true },
  })

  if (!gift) {
    return c.json({ error: 'Gift not found.' }, 404)
  }

  if (parsed.data.reserved) {
    if (gift.userId && gift.userId !== sessionUser.id) {
      return c.json({ error: 'That gift has already been reserved.' }, 409)
    }

    const result = await prisma.gift.updateMany({
      where: {
        id: giftId,
        OR: [{ userId: null }, { userId: sessionUser.id }],
      },
      data: { userId: sessionUser.id },
    })

    if (result.count === 0) {
      return c.json({ error: 'That gift has already been reserved.' }, 409)
    }
  } else {
    const result = await prisma.gift.updateMany({
      where: { id: giftId, userId: sessionUser.id },
      data: { userId: null },
    })

    if (result.count === 0) {
      return c.json({ error: 'You can only release your own reservation.' }, 409)
    }
  }

  return c.json({
    gift: {
      id: giftId,
      reserved: parsed.data.reserved,
      reservedByMe: parsed.data.reserved,
    },
  })
})

app.notFound((c) => c.json({ error: 'Not found.' }, 404))

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ error: error.message || 'Request failed.' }, error.status)
  }

  if (isDatabaseUnavailable(error)) {
    return databaseUnavailable(c)
  }

  console.error('[api] Unhandled error:', error)
  return c.json({ error: 'Something went wrong.' }, 500)
})

export default app
