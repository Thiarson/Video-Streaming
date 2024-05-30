"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwtToken = exports.generateJwtToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const jwtSignSecret = process.env.JWT_SIGN_SECRET;
if (!jwtSignSecret)
    throw new Error("JWT secret is undefined");
const generateJwtToken = (payload) => {
    const tokenPayload = { payload: payload };
    const jwtOptions = {
        expiresIn: '1y',
    };
    return jsonwebtoken_1.default.sign(tokenPayload, jwtSignSecret, jwtOptions);
};
exports.generateJwtToken = generateJwtToken;
const decodeJwtToken = (token) => {
    return jsonwebtoken_1.default.verify(token, jwtSignSecret);
};
exports.decodeJwtToken = decodeJwtToken;
