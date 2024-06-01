"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../database/postgre/db"));
const temp_storage_1 = __importDefault(require("../lib/temp-storage"));
const mail_config_1 = require("../config/mail-config");
const jwt_server_1 = require("../lib/jwt-server");
const data_validator_1 = require("../lib/data-validator");
const code_generator_1 = require("../lib/code-generator");
const authService = {};
authService.addUser = async (userData) => {
    const { error } = data_validator_1.signupSchema.validate({
        sex: userData.userSex,
        pseudo: userData.userPseudo,
        phone: userData.userPhone,
        email: userData.userEmail,
        birth: userData.userBirthDate,
        password: userData.userPassword,
    });
    if (error)
        throw new Error("Invalid data");
    let user = await db_1.default.userInfo.findFirst({
        where: {
            OR: [
                { userPhone: userData.userPhone },
                { userEmail: userData.userEmail },
            ]
        },
    });
    if (user)
        throw new Error("Email and phone must be unique");
    const code = (0, code_generator_1.generateVerifCode)();
    const subject = "Code de vérification";
    const textMessage = `Voici le code de vérification de votre compte: ${code}`;
    const sent = (0, mail_config_1.sendMail)(userData.userEmail, subject, textMessage);
    console.log(code);
    temp_storage_1.default.set(userData.userEmail, { code: code, userId: userData.userId }, 90);
    temp_storage_1.default.set(userData.userId, userData, 90);
    return code;
};
authService.codeValidation = async ({ email, code }) => {
    const { code: generateCode, userId } = temp_storage_1.default.get(email);
    if (code !== generateCode)
        throw new Error("Code verification is wrong");
    const userData = temp_storage_1.default.get(userId);
    const user = await db_1.default.userInfo.create({
        data: userData,
    });
    if (user) {
        const token = (0, jwt_server_1.generateJwtToken)(user.userId);
        temp_storage_1.default.del(email);
        temp_storage_1.default.del(userId);
        return { user, token };
    }
    throw new Error("Cannot add user to database");
};
authService.verifyUser = async (userData) => {
    const { error } = data_validator_1.loginSchema.validate({
        phone: userData.userPhone,
        email: userData.userEmail,
        password: userData.userPassword,
    });
    if (error)
        throw new Error("Invalid data");
    let user = await db_1.default.userInfo.findFirst({
        where: {
            OR: [
                { userPhone: userData.userPhone },
                { userEmail: userData.userEmail },
            ]
        },
    });
    if (user) {
        if (bcrypt_1.default.compareSync(userData.userPassword, user.userPassword)) {
            const token = (0, jwt_server_1.generateJwtToken)(user.userId);
            return { user: user, token };
        }
        throw new Error("Incorrect password");
    }
    throw new Error("User not found");
};
authService.verifySession = async (userId) => {
    let user = await db_1.default.userInfo.findUnique({
        where: { userId: userId }
    });
    if (user)
        return user;
    throw new Error("User not found");
};
authService.forgetPassword = async (email) => {
    const emailSchema = joi_1.default.object({ email: data_validator_1.pattern.email.required() });
    const { error } = emailSchema.validate({ email: email });
    if (error)
        throw new Error("Invalid data");
    let user = await db_1.default.userInfo.findUnique({
        where: { userEmail: email }
    });
    if (!user)
        throw new Error("Email not found");
    const code = (0, code_generator_1.generateVerifCode)();
    const subject = "Code de vérification";
    const textMessage = `Voici le code de vérification de votre compte: ${code}`;
    const sent = (0, mail_config_1.sendMail)(email, subject, textMessage);
    console.log(code);
    temp_storage_1.default.set(email, { code: code }, 90);
    return code;
};
authService.resetPassword = async (userData) => {
    const user = await db_1.default.userInfo.update({
        where: { userEmail: userData.userEmail },
        data: { userPassword: userData.userPassword },
    });
};
exports.default = authService;
