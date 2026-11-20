import 'dotenv/config'
import { createAuth } from '../server/auth'
import { getPrisma } from '../server/db'
import { DEMO_DEFAULTS } from '../src/shared/demo'
import { toDemoEmail } from '../src/shared/identity'

const prisma = getPrisma()
const auth = createAuth()

const firstName = process.env.VITE_DEMO_FIRST_NAME ?? DEMO_DEFAULTS.firstName
const lastName = process.env.VITE_DEMO_LAST_NAME ?? DEMO_DEFAULTS.lastName
const password = process.env.VITE_DEMO_PASSWORD ?? DEMO_DEFAULTS.password

type Guest = {
  firstName: string
  lastName: string
  dinner?: boolean
  bridalParty?: boolean
  rsvp?: boolean | null
  rsvpOthersYes?: string | null
  rsvpOthersNo?: string | null
  rsvpDate?: Date | null
}

const guests: Guest[] = [
  {
    firstName,
    lastName,
    dinner: true,
    rsvp: null,
  },
  {
    firstName: 'Sam',
    lastName: 'Patel',
    dinner: true,
    rsvp: true,
    rsvpOthersYes: 'Priya Patel',
    rsvpDate: new Date('2026-08-14T09:22:00Z'),
  },
  {
    firstName: 'Mia',
    lastName: 'Chen',
    rsvp: false,
    rsvpDate: new Date('2026-08-20T18:41:00Z'),
  },
  {
    firstName: 'Noah',
    lastName: 'Williams',
    dinner: true,
    rsvp: true,
    rsvpDate: new Date('2026-09-02T02:12:00Z'),
  },
  {
    firstName: 'Isla',
    lastName: 'Thompson',
    rsvp: true,
    rsvpOthersNo: 'Jack Thompson',
    rsvpDate: new Date('2026-09-04T07:05:00Z'),
  },
  {
    firstName: 'Leo',
    lastName: 'Ngata',
    bridalParty: true,
    dinner: true,
    rsvp: true,
    rsvpDate: new Date('2026-07-29T21:15:00Z'),
  },
]

const gifts = [
  {
    name: 'Everyday dinnerware set',
    price: 220,
    link: 'https://www.fatherrabbit.com/',
  },
  {
    name: 'Espresso machine',
    price: 349,
    link: 'https://www.breville.com/nz/en/products/coffee-machines.html',
  },
  {
    name: 'Linen bedding set',
    price: 280,
    link: 'https://www.bedbathandbeyond.co.nz/',
  },
  {
    name: 'Garden tool kit',
    price: 145,
    link: 'https://www.kings.co.nz/',
  },
  {
    name: 'Honeymoon dinner',
    price: 180,
    link: null,
  },
  {
    name: 'Record player',
    price: 399,
    link: 'https://www.realgroovy.co.nz/',
  },
]

async function main() {
  console.log('Resetting demo data...')

  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.gift.deleteMany()
  await prisma.user.deleteMany()

  const email = toDemoEmail(firstName, lastName)

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      dinner: true,
      bridalParty: false,
    },
  })

  const otherGuests = guests.filter(
    (guest) => guest.firstName !== firstName || guest.lastName !== lastName,
  )

  const createdGuests = new Map<string, string>()

  for (const guest of otherGuests) {
    const guestEmail = toDemoEmail(guest.firstName, guest.lastName)
    const user = await prisma.user.create({
      data: {
        email: guestEmail,
        name: `${guest.firstName} ${guest.lastName}`,
        firstName: guest.firstName,
        lastName: guest.lastName,
        dinner: guest.dinner ?? false,
        bridalParty: guest.bridalParty ?? false,
        rsvp: guest.rsvp ?? null,
        rsvpOthersYes: guest.rsvpOthersYes ?? null,
        rsvpOthersNo: guest.rsvpOthersNo ?? null,
        rsvpDate: guest.rsvpDate ?? null,
      },
      select: { id: true },
    })

    createdGuests.set(`${guest.firstName} ${guest.lastName}`, user.id)
  }

  const samId = createdGuests.get('Sam Patel')

  for (const [index, gift] of gifts.entries()) {
    await prisma.gift.create({
      data: {
        name: gift.name,
        price: gift.price,
        link: gift.link,
        // One gift starts reserved so the demo shows both states.
        userId: index === 1 ? samId : null,
      },
    })
  }

  console.log(`Demo ready. Log in as ${firstName} ${lastName} / ${password}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
