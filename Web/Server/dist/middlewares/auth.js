"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_server_1 = require("../lib/jwt-server");
const auth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const authorization = req.headers.authorization.split(" ");
            const token = authorization[1];
            const { payload } = (0, jwt_server_1.decodeJwtToken)(token);
            if (payload) {
                req.body.data = payload;
                return next();
            }
            throw new Error("Token or payload is undefined");
        }
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
};
exports.default = auth;
