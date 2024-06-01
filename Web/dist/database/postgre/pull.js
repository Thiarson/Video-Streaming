"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
if (!process.env.POSTGRE_DATABASE_URL)
    throw new Error("Database URL is undefined");
const DATABASE_URL = process.env.POSTGRE_DATABASE_URL;
const databaseUrl = new URL(DATABASE_URL);
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: databaseUrl.toString(),
        },
    },
});
async function main() {
    console.log(`Start pulling ...`);
    await prisma.$executeRaw `
    DO $$ DECLARE
      tables_name RECORD;
    BEGIN
      FOR tables_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_type = 'BASE TABLE' AND table_name != '_prisma_migrations') LOOP
        EXECUTE 'DROP TABLE IF EXISTS' || quote_ident(tables_name.table_name) || ' CASCADE';
      END LOOP;
    END $$;
  `;
    await prisma.$executeRaw `DROP TABLE IF EXISTS _prisma_migrations`;
    const database = node_path_1.default.dirname(__dirname);
    const src = node_path_1.default.dirname(database);
    const root = node_path_1.default.dirname(src);
    const migrations = node_path_1.default.resolve(root, 'prisma/migrations');
    node_fs_1.default.rm(migrations, { recursive: true, force: true }, (success) => {
        console.log('Removing migrations directory...');
    });
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
