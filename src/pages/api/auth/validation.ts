import * as z from 'zod'
export const loginSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
})
export type ILogin = z.infer<typeof loginSchema>
