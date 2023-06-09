import * as z from 'zod'

export const rsvpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  RSVP: z.enum(['true', 'false']).transform((value) => value === 'true'),
  RSVPOthersYes: z.string().nullable(),
  RSVPOthersNo: z.string().nullable(),
  RSVPDate: z.date(),
})
export type IRSVP = z.infer<typeof rsvpSchema>
