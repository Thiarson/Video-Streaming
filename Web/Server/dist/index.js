"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_https_1 = __importDefault(require("node:https"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const { httpsOptions } = require("./config/server-config");
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
const server = node_https_1.default.createServer(httpsOptions, app_1.default);
server.on('request', (req, res) => {
    console.log(`${req.method} ${req.url}`);
});
server.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`);
});
exports.default = server;
