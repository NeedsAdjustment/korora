import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../src/generated/prisma/client'

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('DATABASE_URL is not configured')
    this.name = 'DatabaseNotConfiguredError'
  }
}

type PrismaGlobal = {
  prisma?: PrismaClient
  pool?: Pool
}

const globalForPrisma = globalThis as unknown as PrismaGlobal

export function getPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL?.trim()

  if (!connectionString) throw new DatabaseNotConfiguredError()

  if (!globalForPrisma.prisma) {
    const pool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    })

    const adapter = new PrismaPg(pool)

    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
    globalForPrisma.pool = pool
  }

  return globalForPrisma.prisma
}
