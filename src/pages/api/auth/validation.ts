import * as z from 'zod'

const trimString = (u: unknown) => (typeof u === 'string' ? u.trim() : u)
export const loginSchema = z.object({
  firstName: z.preprocess(trimString, z.string()),
  lastName: z.preprocess(trimString, z.string()),
  password: z.string(),
})
export type ILogin = z.infer<typeof loginSchema>
