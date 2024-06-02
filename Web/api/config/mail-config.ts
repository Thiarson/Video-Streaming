import nodemailer from "nodemailer"
import dotenv from "dotenv"
import type { MailOptions } from "nodemailer/lib/json-transport"

dotenv.config()

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com", // Serveur SMTP du fourniseur
//   port: 587, // Port du serveur SMTP, 587 pour TLS
//   secure: false, // true pour le port 465, false pour les autres ports
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   }
// })

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 25,
  secure: false,  // Ne pas utiliser SSL/TLS
  ignoreTLS: true, // Ignorer les erreurs de certificat
})

const mailOptions: MailOptions = {
  from: "Video.Streaming@admin.mg",
}

export { transporter, mailOptions }
