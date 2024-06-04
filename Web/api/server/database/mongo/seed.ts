import dotenv from "dotenv"
import mongoose from "mongoose"

import { EmailUser } from "./db"

dotenv.config()

const DATABASE_URL = process.env.MONGO_DATABASE_URL ?? "mongodb://127.0.0.1:27017/videostreaming"

if (!DATABASE_URL) {
  throw new Error("Database URL required")
}

mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error}`);
  })

const emailData = {
  userEmail: "Video.Streaming@admin.mg",
  userPassword: "admin",
}

async function main() {
  const email = await EmailUser.create(emailData)

  console.log(`Email created with address: ${email.userEmail}`);
}

main()
  .then(async () => {
    await mongoose.disconnect()
  })
  .catch(async (e) => {
    console.error(e);
    await mongoose.disconnect()
    process.exit(1);
  });
