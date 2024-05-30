"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});
const mailOptions = {
    from: "thiarsonantsa00@gmail.com",
    to: "thiarsonantsa@gmail.com",
    subject: "Mail subject",
    text: "Mail body in text !",
};
const sendMail = (destination, subject, text) => {
    const options = {
        ...mailOptions,
        to: destination,
        subject: subject,
        text: text,
    };
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.error(error.message);
            return false;
        }
        console.log(`Message envoyé de ${options.from} à ${options.to}`);
        console.log(`URL de prévisualisation : ${nodemailer_1.default.getTestMessageUrl(info)}`);
        return true;
    });
};
exports.sendMail = sendMail;
