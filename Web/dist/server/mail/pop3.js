"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_net_1 = __importDefault(require("node:net"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
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
const PORT = 110;
const initialeState = {
    isAuthenticated: false,
    user: null,
    uid: {},
};
const commands = {
    CAPA: handleCapa,
    USER: handleUser,
    PASS: handlePass,
    STAT: handleStat,
    UIDL: handleUidl,
    TOP: handleTop,
    LIST: handleList,
    RETR: handleRetr,
    DELE: handleDele,
    QUIT: handleQuit,
};
function handleCapa(state, params, callback) {
    const capabilities = [
        "USER",
        "UIDL",
        "TOP",
        "PIPELINING",
        "RESP-CODES",
        "AUTH-RESP-CODE",
    ];
    const response = `+OK Capability list follows\r\n${capabilities.join("\r\n")}\r\n.`;
    callback(response);
}
function extractHeaders(emailBody) {
    const endOfHeadersIndex = emailBody.indexOf("\r\n\r\n");
    return emailBody.substring(0, endOfHeadersIndex);
}
function extractBody(emailBody) {
    const endOfHeadersIndex = emailBody.indexOf("\r\n\r\n");
    return emailBody.substring(endOfHeadersIndex + 4);
}
async function handleUser(state, params, callback) {
    if (params.length !== 1)
        return callback("-ERR invalid USER command");
    const user = await db_1.EmailUser.findOne({ userEmail: params[0] });
    if (!user)
        return callback("-ERR User not found");
    state.user = user;
    callback("+OK User accepted");
}
async function handlePass(state, params, callback) {
    if (params.length !== 1 || !state.user)
        return callback("-ERR [AUTH] Invalid PASS command");
    const user = await db_1.EmailUser.findOne({ userEmail: state.user.userEmail });
    if (!user || user.userPassword !== params[0])
        return callback("-ERR [AUTH] Authentication failed");
    state.isAuthenticated = true;
    callback("+OK Authentication successful");
}
async function handleStat(state, params, callback) {
    if (!state.isAuthenticated)
        return callback("-ERR Not authenticated");
    const emails = await db_1.Email.find({
        emailReceiver: state.user?.id,
        emailDeleted: false,
    });
    const count = emails.length;
    const octets = emails.reduce((acc, email) => acc + email.emailBody.length, 0);
    callback(`+OK ${count} ${octets}`);
}
async function handleUidl(state, paramas, callback) {
    if (!state.isAuthenticated)
        return callback("-ERR Not authenticated");
    const emails = await db_1.Email.find({
        emailReceiver: state.user?.id,
        emailDeleted: false,
    });
    const response = emails.map((email, index) => {
        state.uid[index + 1] = email.id;
        return `${index + 1} ${email.id}`;
    }).join("\r\n");
    callback(`+OK ${emails.length} messages\r\n${response}\r\n.`);
}
async function handleTop(state, params, callback) {
    if (!state.isAuthenticated || params.length !== 2)
        return callback("-ERR Invalid TOP command");
    const emailId = parseInt(params[0], 10);
    const numberOfLines = parseInt(params[1], 10);
    const email = await db_1.Email.findOne({
        _id: emailId,
        emailReceiver: state.user?.id,
        emailDeleted: false,
    });
    if (!email)
        return callback("-ERR No such message");
    const headers = extractHeaders(email.emailBody);
    const body = extractBody(email.emailBody).split("\n").slice(0, numberOfLines).join("\n");
    callback(`+OK\r\n${headers}\r\n${body}\r\n.`);
}
async function handleList(state, params, callback) {
    if (!state.isAuthenticated)
        return callback("-ERR Not authenticated");
    const emails = await db_1.Email.find({
        emailReceiver: state.user?.id,
        emailDeleted: false,
    });
    const response = emails.map((email, index) => `${index + 1} ${email.emailBody.length}`).join("\r\n");
    callback(`+OK ${emails.length} messages\r\n${response}\r\n.`);
}
async function handleRetr(state, params, callback) {
    if (!state.isAuthenticated || params.length !== 1)
        return callback("-ERR Invalid RETR Command");
    const emailId = state.uid[params[0]];
    const email = await db_1.Email.findOne({ _id: emailId });
    const emailSender = await db_1.EmailUser.findOne({ _id: email?.emailSender });
    if (!email || !emailSender)
        return callback("-ERR No such message");
    const response = `From: ${emailSender.userEmail}\r\n` +
        `Subject: ${email.emailSubject}\r\n\r\n` +
        `${email.emailBody}`;
    callback(`+OK ${response.length} octets\r\n${response}\r\n.`);
}
async function handleDele(state, params, callback) {
    if (!state.isAuthenticated || params.length !== 1)
        return callback("-ERR Invalid DELE command");
    const emailId = parseInt(params[0], 10);
    const email = await db_1.Email.updateOne({ _id: emailId }, { emailDeleted: true });
    if (!email)
        return callback("-ERR No such message");
    callback("-OK Message deleted");
}
function handleQuit(state, params, callback) {
    callback("+OK Goodbye", true);
}
const server = node_net_1.default.createServer((socket) => {
    const state = { ...initialeState };
    socket.write("+OK POP3 Server ready \r\n");
    socket.on("data", (data) => {
        const messages = data.toString("utf-8").trim().split("\r\n");
        for (const message of messages) {
            const [command, ...params] = message.split(" ");
            const handler = commands[command.toUpperCase()] || ((_, __, callback) => callback("-ERR Unknown command"));
            handler(state, params, (response, shouldClose) => {
                console.log(message, response);
                socket.write(`${response}\r\n`);
                if (shouldClose)
                    socket.end();
            });
        }
    });
    socket.on("error", (err) => {
        console.error("Socket error: ", err);
    });
    socket.on("close", (hadError) => {
        if (hadError)
            console.error("Connection closed by error");
        console.log("Connection closed");
    });
});
server.listen(PORT, () => {
    console.log(`POP3 server listening on port ${PORT}`);
});
