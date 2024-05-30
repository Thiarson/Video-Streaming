"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
let prisma;
const prismaClientSingleton = () => {
    const DATABASE_URL = process.env.POSTGRE_DATABASE_URL;
    if (!DATABASE_URL) {
        throw new Error("Database URL required");
    }
    const databaseUrl = new URL(DATABASE_URL);
    if (!prisma) {
        return new client_1.PrismaClient({
            datasources: {
                db: {
                    url: databaseUrl.toString(),
                },
            },
        });
    }
    return prisma;
};
prisma = globalThis.prisma ?? prismaClientSingleton();
exports.default = prisma;
if (process.env.NODE_ENV !== 'production')
    globalThis.prisma = prisma;
