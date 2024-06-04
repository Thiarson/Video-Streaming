"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const express_1 = require("express");
const stream_service_1 = __importDefault(require("../services/stream.service"));
const streamRouter = (0, express_1.Router)();
const api = node_path_1.default.dirname(__dirname);
const web = node_path_1.default.dirname(api);
const data = node_path_1.default.join(web, "data");
streamRouter.get("*", async function (req, res) {
    try {
        const format = [".m3u8", ".ts"];
        const extension = node_path_1.default.extname(req.url);
        if (format.indexOf(extension) === -1)
            throw new Error("Data format is invalid");
        const stream = node_path_1.default.join(data, req.url);
        if (!node_fs_1.default.existsSync(stream))
            throw new Error("This ressource is unavailabe");
        const content = await stream_service_1.default.getContent(req.url);
        res.send(content);
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
exports.default = streamRouter;
