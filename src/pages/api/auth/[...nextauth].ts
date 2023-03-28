import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../../../prisma'
import { loginSchema } from './validation'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        firstname: { label: 'First Name', type: 'text', placeholder: 'Amélie' },
        lastName: { label: 'Last Name', type: 'text', placeholder: 'LaCroix' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const creds = await loginSchema.parseAsync(credentials)

        const user = await prisma.user.findFirst({
          where: { firstname: creds.firstname } && { lastname: creds.lastname },
        })
        if (!user) {
          return null
        }

        if (process.env.PASSWORD !== creds.password) {
          return Promise.resolve(null)
        }

        return {
          id: user.id,
          name: user.firstname + ' ' + user.lastname,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60,
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.name = user.firstname + ' ' + user.lastname
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id
      }

      return session
    },
  },
})
