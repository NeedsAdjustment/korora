import { DefaultUser } from 'next-auth'
declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & { firstname: string; lastname: string }
    id: any
  }
  interface User extends DefaultUser {
    firstname: string
    lastname: string
  }
}
