"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeHls = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_child_process_1 = require("node:child_process");
const mkdirp_1 = require("mkdirp");
const encoding = (inPath, name, resolution, userId, title) => {
    let outPath = `./data/${userId}/videos/${name}/${resolution}`;
    let argv = ['-y', '-i', inPath];
    let scale = '';
    let maxrate = 0;
    let bufsize = 0;
    if (resolution === '720p') {
        scale = '1280x720';
        maxrate = 3500000;
        bufsize = 7000000;
        Array.prototype.push.apply(argv, ['-c:v', 'copy']);
        Array.prototype.push.apply(argv, ['-c:a', 'copy']);
    }
    else if (resolution === '480p') {
        scale = '854x480';
        maxrate = 1000000;
        bufsize = 2000000;
        Array.prototype.push.apply(argv, ['-c:v', 'libx264']);
        Array.prototype.push.apply(argv, ['-c:a', 'aac']);
        Array.prototype.push.apply(argv, ['-s', scale]);
        Array.prototype.push.apply(argv, ['-b:v', maxrate]);
        Array.prototype.push.apply(argv, ['-maxrate', maxrate]);
        Array.prototype.push.apply(argv, ['-bufsize', bufsize]);
        Array.prototype.push.apply(argv, ['-b:a', '128k']);
    }
    mkdirp_1.mkdirp.sync(outPath);
    node_fs_1.default.accessSync(outPath, node_fs_1.default.constants.W_OK);
    outPath += `/${title}.m3u8`;
    Array.prototype.push.apply(argv, ['-f', 'tee', '-map', '0:a?', '-map', '0:v?', '[hls_time=6:hls_list_size=0]' + outPath]);
    argv = argv.filter((n) => { return n; });
    node_fs_1.default.appendFileSync(`./data/${userId}/videos/${name}/${title}.m3u8`, `#EXT-X-STREAM-INF:BANDWIDTH=${maxrate}, RESOLUTION=${scale}\n${resolution}/${title}.m3u8\n`);
    const ffmpeg_exec = (0, node_child_process_1.spawn)('C:/Program Files/ffmpeg/bin/ffmpeg.exe', argv);
    ffmpeg_exec.on('close', () => {
        console.log(`Encodage ${resolution} terminé !`);
    });
    return ffmpeg_exec;
};
const encodeHls = (inPath, name, resolutions, userId, title) => {
    let ffmpeg_exec;
    resolutions.forEach((resolution) => {
        ffmpeg_exec = encoding(inPath, name, resolution, userId, title);
    });
    if (!ffmpeg_exec)
        throw new Error("Encoding error");
    ffmpeg_exec.on('close', () => {
        setTimeout(() => {
            node_fs_1.default.rmSync(inPath);
        }, 5000);
    });
};
exports.encodeHls = encodeHls;
