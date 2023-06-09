import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../../../prisma'
import { loginSchema } from './validation'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        firstName: { label: 'First Name', type: 'text', placeholder: 'Amélie' },
        lastName: { label: 'Last Name', type: 'text', placeholder: 'LaCroix' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const creds = await loginSchema.parseAsync(credentials)
        const user = await prisma.user.findUnique({
          where: {
            fullName: {
              firstName: creds.firstName,
              lastName: creds.lastName,
            },
          },
        })
        if (!user) {
          return null
        }

        if (process.env.PASSWORD !== creds.password) {
          return Promise.resolve(null)
        }
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          dinner: user.dinner,
          bridalParty: user.bridalParty,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 15 * 24 * 60 * 60, // 15 days
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.firstName + ' ' + user.lastName
        token.dinner = user.dinner
      }
      return token
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.name = token.name
        session.user.dinner = token.dinner as boolean
      }
      return session
    },
  },
})
