import { PrismaClient } from '@generated'
import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from 'redis'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const redis = createClient({ url: process.env.REDIS_URL })
export const prisma = new PrismaClient({ adapter })
export * from './Guild'
export * from './User'