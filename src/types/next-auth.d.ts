import { DefaultUser } from 'next-auth'
declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & { firstName: string; lastName: string }
    id: any
  }
  interface User extends DefaultUser {
    firstName: string
    lastName: string
  }
}
