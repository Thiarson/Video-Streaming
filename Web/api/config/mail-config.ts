import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { MailOptions } from "nodemailer/lib/json-transport"

type Address = typeof mailOptions.to

dotenv.config()

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Serveur SMTP du fourniseur
  port: 587, // Port du serveur SMTP, 587 pour TLS
  secure: false, // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
})

const mailOptions: MailOptions = {
  from: "thiarsonantsa00@gmail.com", // Adresse e-mail de l'expéditeur
  to: "thiarsonantsa@gmail.com", // E-mail des destinataire
  subject: "Mail subject", // Sujet de l'email
  text: "Mail body in text !", // Corps de l'e-mail en text brut
}

const sendMail = (destination: Address, subject: string, text: string) => {
  const options = {
    ...mailOptions,
    to: destination,
    subject: subject,
    text: text,
  }

  // Envoyer l'email
  // await transporter.sendMail(options)

  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.error(error.message);
      return false
    }

    console.log(`Message envoyé de ${options.from} à ${options.to}`);
    console.log(`URL de prévisualisation : ${nodemailer.getTestMessageUrl(info)}`);

    return true
  })
}

export { sendMail }
