import dotenv from "dotenv"
import mongoose from "mongoose"
import { SMTPServer } from "smtp-server"
import { simpleParser } from "mailparser"
import type { AddressObject } from "mailparser"

import { Email, EmailUser } from "../database/mongo/db"
import type { IEmailUser, IEmail  } from "../database/mongo/db"

dotenv.config()

const DATABASE_URL = process.env.MONGO_DATABASE_URL ?? "mongodb://127.0.0.1:27017/videostreaming"

if (!DATABASE_URL) {
  throw new Error("Database URL required")
}

mongoose.connect(DATABASE_URL)
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error}`);
  })

const PORT = 25

const server = new SMTPServer({
  secure: false,
  authOptional: true,
  allowInsecureAuth: true,
  allowHalfOpen: true,
  onConnect(session, callback) {
    console.log(`Client connected: ${session.localAddress}`);    
    callback(null)
  },
  async onAuth(auth, session, callback) {
    const { username, password } = auth
    console.log(`Authentication: ${username}`);

    // Verifier le mot de passe
    const user = await EmailUser.findOne({ userEmail: username }) as IEmailUser

    if (!user)
      return callback(new Error("User not found"))

    callback(null, { user: username })
  },
  onData(stream, session, callback) {
    console.log(`Data from: ${session.localAddress}`);
    
    simpleParser(stream, async (err, parsed) => {
      if (err)
        return callback(err)

      if (!parsed.from || !parsed.from.value[0].address)
        throw new Error("Sender is undefined")

      // Trouver ou créé l'utilisateur expéditeur
      let sender = await EmailUser.findOneAndUpdate(
        { userEmail: parsed.from.value[0].address },
        { $setOnInsert: { userEmail: parsed.from.value[0].address, userPassword: "default" } },
        { upsert: true, new: true },
      ) as IEmailUser

      const destination = parsed.to as AddressObject

      if (!destination.value[0].address)
        throw new Error("Receiver is undefined")

      // Trouver ou créé l'utilisateur destinataire
      let receiver = await EmailUser.findOneAndUpdate(
        { userEmail: destination.value[0].address },
        { $setOnInsert: { userEmail: destination.value[0].address, userPassword: "default" } },
        { upsert: true, new: true },
      ) as IEmailUser

      if (!parsed.subject || !parsed.text)
        throw new Error("Email subject or body is undefined")

      // Stocker l'email dans la base de données
      await Email.create({
        emailSubject: parsed.subject,
        emailBody: parsed.text,
        emailSender: sender.id,
        emailReceiver: receiver.id,
      } as IEmail)

      callback(null)
    }) 
  },
  onClose(session, callback) {
    console.log(`Client disconnected: ${session.localAddress}`);
    // callback(null)
  },
})

server.on("error", (err) => {
  console.error(err);
})

server.listen(PORT, () => {
  console.log(`SMTP server is running on port ${PORT}`);
})
