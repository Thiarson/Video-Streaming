const dotenv = require('dotenv')
const { PrismaClient } = require('@prisma/client')

dotenv.config()

let prisma

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

module.exports = prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
