"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pattern = exports.signupSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const pattern = {
    sex: joi_1.default.string().equal('M', 'F'),
    pseudo: joi_1.default.string().min(3).max(30),
    birth: joi_1.default.date(),
    password: joi_1.default.string().min(6),
    phone: joi_1.default.string().pattern(new RegExp(/^\d{10}$/)),
    email: joi_1.default.string().pattern(new RegExp(/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i)),
};
exports.pattern = pattern;
const loginSchema = joi_1.default.object({
    phone: pattern.phone.optional(),
    email: pattern.email.optional(),
    password: pattern.password.required(),
}).xor("phone", "email");
exports.loginSchema = loginSchema;
const signupSchema = joi_1.default.object({
    sex: pattern.sex.required(),
    pseudo: pattern.pseudo.required(),
    phone: pattern.phone.required(),
    email: pattern.email.required(),
    birth: pattern.birth.required(),
    password: pattern.password.required(),
});
exports.signupSchema = signupSchema;
