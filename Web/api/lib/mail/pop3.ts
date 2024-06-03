import net from "node:net"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import type { EmailUser } from "@prisma/client"

type DynamicObject<K extends string | number | symbol, V> = {
 [key in K]: V
}

type State = {
  isAuthenticated: boolean,
  user: EmailUser | null,
  uid: DynamicObject<string, number>,
}

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

const PORT = 110

// Etat initial de chaque session de connexion
const initialeState: State = {
  isAuthenticated: false,
  user: null,
  uid: {},
}

// Commande POP3
const commands: DynamicObject<string, Function> = {
  CAPA: handleCapa, // Liste des fonctionnalités prises en charge. Répond avec une liste des capacité sur une ligne distincte, Termine avec une ligne contenant un seul point
  USER: handleUser,
  PASS: handlePass,
  STAT: handleStat, // Répond avec le nombre de message et la taille en octets
  UIDL: handleUidl, // Pour obtenir les identifiants uniques des emails
  TOP: handleTop, // Permet au client de récupérer uniquement l'en-tête d'un message et un certain nombre de lignes du corps du message
  LIST: handleList, // Répond avec la liste des messsages et leurs tailles, Termine avec une ligne contenant un seul point
  RETR: handleRetr, // Répond avec le contenu du messsage demandé, Termine avec une ligne contenant un seul point
  DELE: handleDele, // Marque le message pour suppression
  QUIT: handleQuit,
}

function handleCapa(state: State, params: string[], callback: Function) {
  const capabilities = [
    "USER",
    "UIDL",
    "TOP",
    "PIPELINING", // Permet au client d'envoyer plusieurs commandes sans attendre les réponses intermédiaires du serveur
    "RESP-CODES", // Le serveur peut retourner des codes de réponse détaillés
    "AUTH-RESP-CODE", // Pour indiquer des codes de réponse spécifique aux commandes d'authentification
  ]
  const response = `+OK Capability list follows\r\n${capabilities.join("\r\n")}\r\n.`
  callback(response)
}

function extractHeaders(emailBody: string): string {
  const endOfHeadersIndex = emailBody.indexOf("\r\n\r\n")
  return emailBody.substring(0, endOfHeadersIndex)
}

function extractBody(emailBody: string): string {
  const endOfHeadersIndex = emailBody.indexOf("\r\n\r\n")
  return emailBody.substring(endOfHeadersIndex + 4) // Skip the \r\n\r\n sequence
}

 /**
  * client: USER <username>
  */
async function handleUser(state: State, params: string[], callback: Function) {
  if (params.length !== 1)
    return callback("-ERR invalid USER command")

  // Chercher l'utilisateur dans la base de données
  const user = await prisma.emailUser.findUnique({
    where: { userEmail: params[0] }
  })

  if (!user)
    return callback("-ERR User not found")

  state.user = user
  callback("+OK User accepted")
}

 /**
  * client: PASS <password>
  */
async function handlePass(state: State, params: string[], callback: Function) {
  if (params.length !== 1 || !state.user)
    return callback("-ERR [AUTH] Invalid PASS command")

    // Verifier le mot de passe dans la base de données
    const user = await prisma.emailUser.findUnique({
      where: { userEmail: state.user.userEmail },
      select: { userPassword: true }
    })

    if (!user || user.userPassword !== params[0])
      return callback("-ERR [AUTH] Authentication failed")

  state.isAuthenticated = true
  callback("+OK Authentication successful")
}

 /**
  * client: STAT
  * server: <message_count> <total_size>
  */
async function handleStat(state: State, params: string[], callback: Function) {
  if (!state.isAuthenticated)
    return callback("-ERR Not authenticated")

  // Chercher le message dans la base de données
  const emails = await prisma.email.findMany({
    where: {
      emailReceiverId: state.user?.userId,
      emailDeleted: false,
    }
  })
  
  const count = emails.length
  const octets = emails.reduce((acc, email) => acc + email.emailBody.length, 0)

  callback(`+OK ${count} ${octets}`)
}

/**
 * client: UIDL
 */
async function handleUidl(state: State, paramas: string[], callback: Function) {
  if (!state.isAuthenticated)
    return callback("-ERR Not authenticated")

  const emails = await prisma.email.findMany({
    where: {
      emailReceiverId: state.user?.userId,
      emailDeleted: false,
    }
  })
  const response = emails.map((email, index) => {
    state.uid[index + 1] = email.emailId
    return `${index + 1} ${email.emailId}`
  }).join("\r\n")

  callback(`+OK ${emails.length} messages\r\n${response}\r\n.`)
}

/**
 * client: TOP <message_number> <number_of_lines>
 * server: <email_headers>
 * <specified_number_of_lines_from_body>
 */
async function handleTop(state: State, params: string[], callback: Function) {
  if (!state.isAuthenticated || params.length !== 2)
    return callback("-ERR Invalid TOP command")

  const emailId = parseInt(params[0], 10)
  const numberOfLines = parseInt(params[1], 10)
  const email = await prisma.email.findUnique({
    where: {
      emailId: emailId,
      emailReceiverId: state.user?.userId,
      emailDeleted: false,
    }
  })

  if (!email)
    return callback("-ERR No such message")

  const headers = extractHeaders(email.emailBody)
  const body = extractBody(email.emailBody).split("\n").slice(0, numberOfLines).join("\n")

  callback(`+OK\r\n${headers}\r\n${body}\r\n.`)
}

 /**
  * client: LIST
  * server: <message_count> messages
  * <siz_of_message_1>
  * <siz_of_message_2>
  */
async function handleList(state: State, params: string[], callback: Function) {
  if (!state.isAuthenticated)
    return callback("-ERR Not authenticated")

  // Recuperer la liste des messages dans la base de données
  const emails = await prisma.email.findMany({
    where: {
      emailReceiverId: state.user?.userId,
      emailDeleted: false,
    }
  })

  const response = emails.map((email, index) => `${index + 1} ${email.emailBody.length}`).join("\r\n")
  callback(`+OK ${emails.length} messages\r\n${response}\r\n.`)
}

 /**
  * client: RETR <message_number>
  * server: <siz_of_message> octets
  * <message_content>
  */
async function handleRetr(state: State, params: string[], callback: Function) {
  if (!state.isAuthenticated || params.length !== 1)
    return callback("-ERR Invalid RETR Command")

  const emailId = state.uid[params[0]]
  const email = await prisma.email.findUnique({
    where: {
      emailId: emailId,
    },
    include: {
      emailSender: true
    }
  })

  if (!email)
    return callback("-ERR No such message")

  const response = 
    `From: ${email.emailSender.userEmail}\r\n` +
    `Subject: ${email.emailSubject}\r\n\r\n` +
    `${email.emailBody}`

  callback(`+OK ${response.length} octets\r\n${response}\r\n.`)
}

 /**
  * client: DELE <message_number>
  */
async function handleDele(state: State, params: string[], callback: Function) {
  if (!state.isAuthenticated || params.length !== 1)
    return callback("-ERR Invalid DELE command")

  const emailId = parseInt(params[0], 10)
  const email = await prisma.email.update({
    where: {
      emailId: emailId,
    },
    data: {
      emailDeleted: true,
    }
  })

  if (!email)
    return callback("-ERR No such message")

  callback("-OK Message deleted")
}

function handleQuit(state: State, params: string[], callback: Function) {
  callback("+OK Goodbye", true)
}

const server = net.createServer((socket) => {  
  const state: State = { ...initialeState }

  // Quand le client se connecte au serveur, il attend cette reponse
  socket.write("+OK POP3 Server ready \r\n")

  socket.on("data", (data) => {
    const messages = data.toString("utf-8").trim().split("\r\n")

    for (const message of messages) {
      const [command, ...params] = message.split(" ")
      const handler = commands[command.toUpperCase()] || ((_: State, __: string[], callback: Function) => callback("-ERR Unknown command"))

      handler(state, params, (response: string, shouldClose: boolean) => {
        console.log(message, response);
        socket.write(`${response}\r\n`)
        if (shouldClose)
          socket.end()
      })
    }
  })

  socket.on("error", (err) => {
    console.error("Socket error: ", err);
  })

  socket.on("close", (hadError) => {
    if (hadError)
      console.error("Connection closed by error");
      
    console.log("Connection closed");
  })
})

server.listen(PORT, () => {
  console.log(`POP3 server listening on port ${PORT}`);
})
