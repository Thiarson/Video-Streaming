"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailOptions = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: "localhost",
    port: 25,
    secure: false,
    ignoreTLS: true,
});
exports.transporter = transporter;
const mailOptions = {
    from: "Video.Streaming@admin.mg",
};
exports.mailOptions = mailOptions;
