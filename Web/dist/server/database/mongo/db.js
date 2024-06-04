"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = exports.EmailUser = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const EmailUserSchema = new mongoose_1.Schema({
    userEmail: { type: String, unique: true, required: true, },
    userPassword: { type: String, required: true, },
    emailSent: [{ type: mongoose_1.Schema.ObjectId, ref: "Email" }],
    emailReceived: [{ type: mongoose_1.Schema.ObjectId, ref: "Email" }],
});
const EmailSchema = new mongoose_1.Schema({
    emailSubject: { type: String, required: true, },
    emailBody: { type: String, required: true, },
    emailSender: { type: mongoose_1.Schema.ObjectId, ref: "EmailUser", required: true, },
    emailReceiver: { type: mongoose_1.Schema.ObjectId, ref: "EmailUser", required: true, },
    emailCreatedAt: { type: Date, default: Date.now, },
    emailDeleted: { type: Boolean, default: false, }
});
const EmailUser = mongoose_1.default.model("EmailUser", EmailUserSchema);
exports.EmailUser = EmailUser;
const Email = mongoose_1.default.model("Email", EmailSchema);
exports.Email = Email;
