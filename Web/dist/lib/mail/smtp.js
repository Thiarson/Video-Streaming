"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const smtp_server_1 = require("smtp-server");
const mailparser_1 = require("mailparser");
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const DATABASE_URL = process.env.POSTGRE_DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("Database URL required");
}
const databaseUrl = new URL(DATABASE_URL);
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: databaseUrl.toString(),
        },
    },
});
const PORT = 25;
const server = new smtp_server_1.SMTPServer({
    secure: false,
    authOptional: true,
    allowInsecureAuth: true,
    allowHalfOpen: true,
    onConnect(session, callback) {
        console.log(`Client connected: ${session.localAddress}`);
        callback(null);
    },
    async onAuth(auth, session, callback) {
        const { username, password } = auth;
        console.log(`Authentication: ${username}`);
        const user = await prisma.emailUser.findUnique({
            where: {
                userEmail: username,
            }
        });
        if (!user)
            return callback(new Error("User not found"));
        callback(null, { user: username });
    },
    onData(stream, session, callback) {
        console.log(`Data from: ${session.localAddress}`);
        (0, mailparser_1.simpleParser)(stream, async (err, parsed) => {
            if (err)
                return callback(err);
            if (!parsed.from || !parsed.from.value[0].address)
                throw new Error("Sender is undefined");
            let sender = await prisma.emailUser.upsert({
                where: { userEmail: parsed.from.value[0].address },
                update: {},
                create: { userEmail: parsed.from.value[0].address, userPassword: "default" }
            });
            const destination = parsed.to;
            if (!destination.value[0].address)
                throw new Error("Receiver is undefined");
            let receiver = await prisma.emailUser.upsert({
                where: { userEmail: destination.value[0].address },
                update: {},
                create: { userEmail: destination.value[0].address, userPassword: "default" }
            });
            if (!parsed.subject || !parsed.text)
                throw new Error("Email subject or body is undefined");
            await prisma.email.create({
                data: {
                    emailSubject: parsed.subject,
                    emailBody: parsed.text,
                    emailSender: { connect: { userId: sender.userId } },
                    emailReceiver: { connect: { userId: receiver.userId } }
                }
            });
            callback(null);
        });
    },
    onClose(session, callback) {
        console.log(`Client disconnected: ${session.localAddress}`);
    },
});
function hello() {
    console.log("hello");
}
server.on("error", (err) => {
    console.error(err);
});
server.listen(PORT, () => {
    console.log(`SMTP server is running on port ${PORT}`);
});
