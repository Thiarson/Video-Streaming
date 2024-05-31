"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = require("express");
const uuid_1 = require("uuid");
const auth_service_1 = __importDefault(require("../services/auth.service"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const authRouter = (0, express_1.Router)();
const saltRounds = 10;
const salt = bcrypt_1.default.genSaltSync(saltRounds);
authRouter.post("/signup", async function (req, res) {
    try {
        const userData = {
            userId: `${(0, uuid_1.v4)()}_${req.body.pseudo}_${new Date().getTime()}`,
            userPseudo: req.body.pseudo,
            userBirthDate: new Date(req.body.birth),
            userSex: req.body.sex,
            userPhone: req.body.phone,
            userEmail: req.body.email,
            userPassword: bcrypt_1.default.hashSync(req.body.password, salt),
        };
        const code = await auth_service_1.default.addUser(userData);
        res.json({
            success: true,
            data: {
                code: code,
                email: userData.userEmail,
            }
        });
    }
    catch (e) {
        if (e instanceof Error)
            console.error(e.message);
        else
            console.error(`Unepected error: ${e}`);
        res.json({
            success: false,
            data: null,
        });
    }
});
authRouter.post("/code-valid", async function (req, res) {
    try {
        const { email, code } = req.body;
        const { user, token } = await auth_service_1.default.codeValidation({ email, code });
        res.json({
            success: true,
            token: token,
            data: {
                userId: user.userId,
                userPseudo: user.userPseudo,
                userEmail: user.userEmail,
                userWallet: user.userWallet,
                userBio: user.userBio,
                userPhoto: user.userPhoto,
                userPassword: user.userPassword,
            },
        });
    }
    catch (e) {
        if (e instanceof Error)
            console.error(e.message);
        else
            console.error(`Unepected error: ${e}`);
        res.json({
            success: false,
            data: null,
        });
    }
});
authRouter.post("/login", async function (req, res) {
    try {
        const userData = {
            userPassword: req.body.password
        };
        if (/^\d{10}$/.test(req.body.login)) {
            userData.userPhone = req.body.login;
        }
        else if (/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i.test(req.body.login)) {
            userData.userEmail = req.body.login;
        }
        const { user, token } = await auth_service_1.default.verifyUser(userData);
        res.json({
            success: true,
            token: token,
            data: {
                userId: user.userId,
                userPseudo: user.userPseudo,
                userEmail: user.userEmail,
                userWallet: user.userWallet,
                userBio: user.userBio,
                userPhoto: user.userPhoto,
                userPassword: user.userPassword,
            },
        });
    }
    catch (e) {
        if (e instanceof Error)
            console.error(e.message);
        else
            console.error(`Unepected error: ${e}`);
        res.json({
            success: false,
            data: null,
        });
    }
});
authRouter.get("/session-verif", auth_1.default, async function (req, res) {
    try {
        const { data } = req.body;
        const user = await auth_service_1.default.verifySession(data);
        res.json({
            success: true,
            data: {
                userId: user.userId,
                userPseudo: user.userPseudo,
                userEmail: user.userEmail,
                userWallet: user.userWallet,
                userBio: user.userBio,
                userPhoto: user.userPhoto,
                userPassword: user.userPassword,
            }
        });
    }
    catch (e) {
        if (e instanceof Error)
            console.error(e.message);
        else
            console.error(`Unepected error: ${e}`);
        res.json({
            success: false,
            data: null,
        });
    }
});
authRouter.post("/forget-password", async function (req, res) {
    try {
        const { email } = req.body;
        const code = await auth_service_1.default.forgetPassword(email);
        res.json({
            success: true,
            data: {
                code: code,
                email: email,
            }
        });
    }
    catch (e) {
        if (e instanceof Error)
            console.error(e.message);
        else
            console.error(`Unepected error: ${e}`);
        res.json({
            success: false,
            data: null
        });
    }
});
authRouter.post("/reset-password", async function (req, res) {
    try {
        const { email, password } = req.body;
        const userData = {
            userEmail: email,
            userPassword: bcrypt_1.default.hashSync(password, salt),
        };
        await auth_service_1.default.resetPassword(userData);
        res.json({
            success: true,
            data: null,
        });
    }
    catch (e) {
        if (e instanceof Error)
            console.error(e.message);
        else
            console.error(`Unepected error: ${e}`);
        res.json({
            success: false,
            data: null,
        });
    }
});
exports.default = authRouter;
