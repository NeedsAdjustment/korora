import * as z from 'zod'
export const loginSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
})
export type ILogin = z.infer<typeof loginSchema>
