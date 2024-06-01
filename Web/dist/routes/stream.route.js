"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stream_service_1 = __importDefault(require("../services/stream.service"));
const streamRouter = (0, express_1.Router)();
streamRouter.get("*", async function (req, res) {
    const content = await stream_service_1.default.getContent(req.url);
    res.send(content);
});
exports.default = streamRouter;
