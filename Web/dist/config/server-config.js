"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ffmpegPath = exports.httpsOptions = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const certificates = {
    KEY: "certificates/streaming-video-key.pem",
    CERT: "certificates/streaming-video-cert.pem",
};
const src = node_path_1.default.dirname(__dirname);
const root = node_path_1.default.dirname(src);
const httpsOptions = {
    key: node_fs_1.default.readFileSync(node_path_1.default.join(root, certificates.KEY)),
    cert: node_fs_1.default.readFileSync(node_path_1.default.join(root, certificates.CERT)),
};
exports.httpsOptions = httpsOptions;
let ffmpegPath = "";
exports.ffmpegPath = ffmpegPath;
if (process.platform === "win32")
    exports.ffmpegPath = ffmpegPath = "C:/Program Files/ffmpeg/bin/ffmpeg.exe";
else if (process.platform === "linux")
    exports.ffmpegPath = ffmpegPath = "";
