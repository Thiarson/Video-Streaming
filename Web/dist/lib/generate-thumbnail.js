"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThumbnail = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_child_process_1 = require("node:child_process");
const sharp_1 = __importDefault(require("sharp"));
const generateThumbnail = (videoPath, tempPath, thumbnailPath) => {
    let argv = ['-y', '-i', videoPath];
    Array.prototype.push.apply(argv, ['-ss', '00:00:30']);
    Array.prototype.push.apply(argv, ['-vframes', '1']);
    Array.prototype.push.apply(argv, [tempPath]);
    const ffmpeg = (0, node_child_process_1.spawn)('C:/Program Files/ffmpeg/bin/ffmpeg.exe', argv);
    ffmpeg.on('close', () => {
        (0, sharp_1.default)(tempPath)
            .resize(1350, 760)
            .toFile(thumbnailPath, (err, info) => {
            node_fs_1.default.rmSync(tempPath);
        });
    });
};
exports.generateThumbnail = generateThumbnail;
