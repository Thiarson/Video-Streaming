"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./db");
dotenv_1.default.config();
const DATABASE_URL = process.env.MONGO_DATABASE_URL ?? "mongodb://127.0.0.1:27017/videostreaming";
if (!DATABASE_URL) {
    throw new Error("Database URL required");
}
mongoose_1.default.connect(DATABASE_URL)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error}`);
});
const emailData = {
    userEmail: "Video.Streaming@admin.mg",
    userPassword: "admin",
};
async function main() {
    const email = await db_1.EmailUser.create(emailData);
    console.log(`Email created with address: ${email.userEmail}`);
}
main()
    .then(async () => {
    await mongoose_1.default.disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await mongoose_1.default.disconnect();
    process.exit(1);
});
