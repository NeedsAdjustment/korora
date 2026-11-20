import { z } from 'zod'

const name = z.string().trim().min(1, 'Required').max(80)

export const loginSchema = z.object({
  firstName: name,
  lastName: name,
  password: z.string().min(1, 'Required').max(200),
})

export type LoginValues = z.infer<typeof loginSchema>

export const rsvpFormSchema = z.object({
  attending: z.string().min(1, 'Please confirm your attendance'),
  othersAttending: z.string().trim().max(300),
  othersNotAttending: z.string().trim().max(300),
})

export type RsvpFormValues = z.infer<typeof rsvpFormSchema>

export const rsvpApiSchema = z.object({
  attending: z.boolean(),
  othersAttending: z.string().trim().max(300).nullish(),
  othersNotAttending: z.string().trim().max(300).nullish(),
})

export type RsvpInput = z.infer<typeof rsvpApiSchema>

export const giftUpdateSchema = z.object({
  reserved: z.boolean(),
})

export type GiftUpdateInput = z.infer<typeof giftUpdateSchema>
