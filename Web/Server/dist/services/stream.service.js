"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const streamService = {};
streamService.getContent = async (url) => {
    const src = node_path_1.default.dirname(__dirname);
    const root = node_path_1.default.dirname(src);
    const contentPath = node_path_1.default.join(root, 'data', url);
    const content = node_fs_1.default.readFileSync(contentPath);
    return content;
};
exports.default = streamService;
