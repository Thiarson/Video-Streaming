import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient
}

dotenv.config()

let prisma: PrismaClient

const prismaClientSingleton = () => {
  const DATABASE_URL = process.env.POSTGRE_DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error("Database URL required")
  }

  const databaseUrl = new URL(DATABASE_URL)

  if(!prisma) {
    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl.toString(),
        },
      },
    })
  } 

  return prisma
}

prisma  = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production')
  globalThis.prisma = prisma
