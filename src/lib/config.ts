import { z } from 'zod'
import { DEMO_DEFAULTS } from '@/shared/demo'

const coordinatePair = z.string().regex(/^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/)

const publicEnvSchema = z.object({
  VITE_SITE_URL: z.string().url().catch('https://korora.joshuasoong.studio'),
  VITE_VENUE: z.string().min(1).catch('Pohangina Heights'),
  VITE_LOCATION: z.string().min(1).catch('Manawatu, NZ'),
  VITE_DATE: z.string().min(1).catch('2023-11-25T13:00:00+13:00'),
  VITE_TIME_ZONE: z.string().min(1).catch('Pacific/Auckland'),
  VITE_MAPBOX_TOKEN: z.string().catch(''),
  VITE_MAP_STYLE: z
    .string()
    .min(1)
    .catch('mapbox://styles/spren/clikciyg5000001q447fchmm7'),
  VITE_COUNTRY_COORDS: coordinatePair.catch('-41,171.99949083100654'),
  VITE_MAP_COORDS: coordinatePair.catch('-40.26748033255471,175.70290299740222'),
  VITE_MARKER_COORDS: coordinatePair.catch('-40.184075598146144,175.86540903279976'),
  VITE_FB_LINKS: z.string().catch(''),
  VITE_INSTA_LINKS: z.string().catch(''),
  VITE_EMAIL: z.string().email().catch('hello@joshuasoong.studio'),
  VITE_FUND: z.string().catch('00-0000-0000000'),
  VITE_DEMO_MODE: z.enum(['true', 'false']).catch('true'),
  VITE_DEMO_FIRST_NAME: z.string().min(1).catch(DEMO_DEFAULTS.firstName),
  VITE_DEMO_LAST_NAME: z.string().min(1).catch(DEMO_DEFAULTS.lastName),
  VITE_DEMO_PASSWORD: z.string().min(1).catch(DEMO_DEFAULTS.password),
})

type Coordinates = {
  latitude: number
  longitude: number
}

function parseCoordinates(value: string): Coordinates {
  const [latitude, longitude] = value.split(',').map(Number)
  return { latitude, longitude }
}

function splitLinks(value: string): string[] {
  return value
    .split(/\s+/)
    .map((link) => link.trim())
    .filter(Boolean)
}

const rawEnv = {
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  VITE_VENUE: import.meta.env.VITE_VENUE,
  VITE_LOCATION: import.meta.env.VITE_LOCATION,
  VITE_DATE: import.meta.env.VITE_DATE,
  VITE_TIME_ZONE: import.meta.env.VITE_TIME_ZONE,
  VITE_MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN,
  VITE_MAP_STYLE: import.meta.env.VITE_MAP_STYLE,
  VITE_COUNTRY_COORDS: import.meta.env.VITE_COUNTRY_COORDS,
  VITE_MAP_COORDS: import.meta.env.VITE_MAP_COORDS,
  VITE_MARKER_COORDS: import.meta.env.VITE_MARKER_COORDS,
  VITE_FB_LINKS: import.meta.env.VITE_FB_LINKS,
  VITE_INSTA_LINKS: import.meta.env.VITE_INSTA_LINKS,
  VITE_EMAIL: import.meta.env.VITE_EMAIL,
  VITE_FUND: import.meta.env.VITE_FUND,
  VITE_DEMO_MODE: import.meta.env.VITE_DEMO_MODE,
  VITE_DEMO_FIRST_NAME: import.meta.env.VITE_DEMO_FIRST_NAME,
  VITE_DEMO_LAST_NAME: import.meta.env.VITE_DEMO_LAST_NAME,
  VITE_DEMO_PASSWORD: import.meta.env.VITE_DEMO_PASSWORD,
}

const env = publicEnvSchema.parse(rawEnv)
const parsedDate = new Date(env.VITE_DATE)
const weddingDate = Number.isNaN(parsedDate.getTime()) ? new Date('2023-11-25T13:00:00+13:00') : parsedDate

export const siteConfig = {
  siteUrl: env.VITE_SITE_URL.replace(/\/$/, ''),
  venue: env.VITE_VENUE,
  location: env.VITE_LOCATION,
  weddingDate,
  timeZone: env.VITE_TIME_ZONE,
  mapboxToken: env.VITE_MAPBOX_TOKEN,
  mapStyle: env.VITE_MAP_STYLE,
  countryCoords: parseCoordinates(env.VITE_COUNTRY_COORDS),
  mapCoords: parseCoordinates(env.VITE_MAP_COORDS),
  markerCoords: parseCoordinates(env.VITE_MARKER_COORDS),
  facebookLinks: splitLinks(env.VITE_FB_LINKS),
  instagramLinks: splitLinks(env.VITE_INSTA_LINKS),
  email: env.VITE_EMAIL,
  fund: env.VITE_FUND,
  demoMode: env.VITE_DEMO_MODE === 'true',
  demo: {
    firstName: env.VITE_DEMO_FIRST_NAME,
    lastName: env.VITE_DEMO_LAST_NAME,
    password: env.VITE_DEMO_PASSWORD,
  },
} as const

export type SiteConfig = typeof siteConfig
