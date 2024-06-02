import dotenv from "dotenv"
import { SMTPServer } from "smtp-server"
import { simpleParser } from "mailparser"
import { PrismaClient } from "@prisma/client"
import type { AddressObject } from "mailparser"

dotenv.config()

const DATABASE_URL = process.env.POSTGRE_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Database URL required")
}

const databaseUrl = new URL(DATABASE_URL)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl.toString(),
    },
  },
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
    const user = await prisma.emailUser.findUnique({
      where: {
        userEmail: username,
      }
    })

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
      let sender = await prisma.emailUser.upsert({
        where: { userEmail: parsed.from.value[0].address },
        update: {},
        create: { userEmail: parsed.from.value[0].address, userPassword: "default"}
      })

      const destination = parsed.to as AddressObject

      if (!destination.value[0].address)
        throw new Error("Receiver is undefined")

      // Trouver ou créé l'utilisateur destinataire
      let receiver = await prisma.emailUser.upsert({
        where: { userEmail: destination.value[0].address },
        update: {},
        create: { userEmail: destination.value[0].address, userPassword: "default"}
      })

      if (!parsed.subject || !parsed.text)
        throw new Error("Email subject or body is undefined")

      // Stocker l'email dans la base de données
      await prisma.email.create({
        data: {
          emailSubject: parsed.subject,
          emailBody: parsed.text,
          emailSender: { connect: { userId: sender.userId } },
          emailReceiver: { connect: { userId: receiver.userId } }
        }
      })

      callback(null)
    })
  },
  onClose(session, callback) {
    console.log(`Client disconnected: ${session.localAddress}`);
    // callback(null)
  },
})

function hello() {
  console.log("hello");
}

server.on("error", (err) => {
  console.error(err);
})

server.listen(PORT, () => {
  console.log(`SMTP server is running on port ${PORT}`);
})
