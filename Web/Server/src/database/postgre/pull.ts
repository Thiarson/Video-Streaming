import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config()

if (!process.env.POSTGRE_DATABASE_URL)
  throw new Error("Database URL is undefined")

const DATABASE_URL = process.env.POSTGRE_DATABASE_URL
const databaseUrl = new URL(DATABASE_URL)

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl.toString(),
    },
  },
});

async function main() {
  console.log(`Start pulling ...`);

  await prisma.$executeRaw`
    DO $$ DECLARE
      tables_name RECORD;
    BEGIN
      FOR tables_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_type = 'BASE TABLE' AND table_name != '_prisma_migrations') LOOP
        EXECUTE 'DROP TABLE IF EXISTS' || quote_ident(tables_name.table_name) || ' CASCADE';
      END LOOP;
    END $$;
  `

  await prisma.$executeRaw`DROP TABLE IF EXISTS _prisma_migrations`

  const database = path.dirname(__dirname)
  const src = path.dirname(database)
  const root = path.dirname(src)
  const migrations = path.resolve(root, 'prisma/migrations')

  fs.rm(migrations, { recursive: true, force: true }, (success) => {
    console.log('Removing migrations directory...');
  })

  console.log(`All table droped`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
