"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const auth_route_1 = __importDefault(require("./auth.route"));
const content_route_1 = __importDefault(require("./content.route"));
const stream_route_1 = __importDefault(require("./stream.route"));
const src = node_path_1.default.dirname(__dirname);
const root = node_path_1.default.dirname(src);
const client = node_path_1.default.join(root, 'public/client');
module.exports = (app) => {
    app.use("/api", auth_route_1.default);
    app.use("/api/", content_route_1.default);
    app.use("/streams/", stream_route_1.default);
    app.get("/data/*", (req, res) => {
        try {
            const format = [".jpg"];
            const extension = node_path_1.default.extname(req.url);
            if (format.indexOf(extension) === -1)
                throw new Error("Data or image format is invalid");
            const imagePath = node_path_1.default.join(root, req.url);
            const image = node_fs_1.default.readFileSync(imagePath);
            res.send(image);
        }
        catch (e) {
            if (e instanceof Error)
                console.error(e.message);
            else
                console.error(`Unepected error: ${e}`);
            res.sendFile(node_path_1.default.join(client, 'index.html'));
        }
    });
    app.get("/", (req, res) => {
        res.sendFile(node_path_1.default.join(client, 'index.html'));
    });
    app.get("/static/js/*", (req, res) => {
        try {
            const js = node_path_1.default.join(client, req.url);
            if (!node_fs_1.default.existsSync(js))
                throw new Error("This ressource is unavailabe");
            res.sendFile(js);
        }
        catch (e) {
            if (e instanceof Error)
                console.error(e.message);
            else
                console.error(`Unepected error: ${e}`);
            res.sendFile(node_path_1.default.join(client, 'index.html'));
        }
    });
    app.get("/static/css/*", (req, res) => {
        try {
            const css = node_path_1.default.join(client, req.url);
            if (!node_fs_1.default.existsSync(css))
                throw new Error("This ressource is unavailabe");
            res.sendFile(css);
        }
        catch (e) {
            if (e instanceof Error)
                console.error(e.message);
            else
                console.error(`Unepected error: ${e}`);
            res.sendFile(node_path_1.default.join(client, 'index.html'));
        }
    });
    app.get("/manifest.json", (req, res) => {
        res.sendFile(node_path_1.default.join(client, req.url));
    });
    app.get("/favicon.ico", (req, res) => {
        const faviconPath = node_path_1.default.join(client, req.url);
        const favicon = node_fs_1.default.readFileSync(faviconPath);
        res.send(favicon);
    });
    app.all("*", (req, res) => {
        res.sendFile(node_path_1.default.join(client, 'index.html'));
    });
};
