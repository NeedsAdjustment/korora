export type Rsvp = {
  attending: boolean | null
  othersAttending: string | null
  othersNotAttending: string | null
  updatedAt: string | null
}

export type DashboardUser = {
  id: string
  firstName: string
  lastName: string
  dinner: boolean
  bridalParty: boolean
  rsvp: Rsvp
}

export type Gift = {
  id: string
  name: string
  link: string | null
  price: number
  reserved: boolean
  reservedByMe: boolean
}

export type MeResponse = {
  user: DashboardUser
}

export type GiftsResponse = {
  gifts: Gift[]
}

export type HealthResponse = {
  ok: boolean
  database: boolean
}

export type ApiError = {
  error: string
}
