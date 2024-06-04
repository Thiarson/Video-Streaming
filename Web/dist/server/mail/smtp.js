"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const smtp_server_1 = require("smtp-server");
const mailparser_1 = require("mailparser");
const db_1 = require("../database/mongo/db");
dotenv_1.default.config();
const DATABASE_URL = process.env.MONGO_DATABASE_URL ?? "mongodb://127.0.0.1:27017/videostreaming";
if (!DATABASE_URL) {
    throw new Error("Database URL required");
}
mongoose_1.default.connect(DATABASE_URL)
    .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error}`);
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
        const user = await db_1.EmailUser.findOne({ userEmail: username });
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
            let sender = await db_1.EmailUser.findOneAndUpdate({ userEmail: parsed.from.value[0].address }, { $setOnInsert: { userEmail: parsed.from.value[0].address, userPassword: "default" } }, { upsert: true, new: true });
            const destination = parsed.to;
            if (!destination.value[0].address)
                throw new Error("Receiver is undefined");
            let receiver = await db_1.EmailUser.findOneAndUpdate({ userEmail: destination.value[0].address }, { $setOnInsert: { userEmail: destination.value[0].address, userPassword: "default" } }, { upsert: true, new: true });
            if (!parsed.subject || !parsed.text)
                throw new Error("Email subject or body is undefined");
            await db_1.Email.create({
                emailSubject: parsed.subject,
                emailBody: parsed.text,
                emailSender: sender.id,
                emailReceiver: receiver.id,
            });
            callback(null);
        });
    },
    onClose(session, callback) {
        console.log(`Client disconnected: ${session.localAddress}`);
    },
});
server.on("error", (err) => {
    console.error(err);
});
server.listen(PORT, () => {
    console.log(`SMTP server is running on port ${PORT}`);
});
