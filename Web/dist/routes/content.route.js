"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const formidable_1 = require("formidable");
const content_service_1 = __importDefault(require("../services/content.service"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const contentRouter = (0, express_1.Router)();
contentRouter.get("/carousel-list", auth_1.default, async function (req, res) {
    try {
        const { data } = req.body;
        const { videos, isVideoBuyed } = await content_service_1.default.carouselList(data);
        res.json({
            success: true,
            data: {
                videos: videos,
                isVideoBuyed: isVideoBuyed,
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
contentRouter.get("/all-content", auth_1.default, async function (req, res) {
    try {
        const { data } = req.body;
        const contents = await content_service_1.default.allContent(data);
        res.json({
            success: true,
            data: {
                videos: contents.videos,
                direct: contents.direct,
                rediffusion: contents.rediffusion,
                isVideoBuyed: contents.isVideoBuyed,
                isDirectBuyed: contents.isDirectBuyed,
                users: contents.users,
                playlists: contents.playlists,
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
contentRouter.post("/upload-video", auth_1.default, async function (req, res) {
    try {
        const maxFileSize = 500 * 1024 * 1024;
        const form = (0, formidable_1.formidable)({ maxFileSize: maxFileSize });
        const formData = await form.parse(req);
        await content_service_1.default.uploadVideo(formData);
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
contentRouter.post("/program-direct", auth_1.default, async function (req, res) {
    try {
        const form = (0, formidable_1.formidable)();
        const formData = await form.parse(req);
        await content_service_1.default.programDirect(formData);
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
contentRouter.get("/get-video/:videoId", auth_1.default, async function (req, res) {
    try {
        const { data } = req.body;
        const { videoId } = req.params;
        const { isFree, isOwned, isBuyed, video } = await content_service_1.default.getVideo(videoId, data);
        res.json({
            success: true,
            data: {
                video: video,
                isFree: isFree,
                isBuyed: isBuyed,
                isOwned: isOwned,
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
contentRouter.get("/get-direct/:directId", auth_1.default, async function (req, res) {
    try {
        const { data } = req.body;
        const { directId } = req.params;
        const { isFree, isOwned, isBuyed, direct } = await content_service_1.default.getDirect(directId, data);
        res.json({
            success: true,
            data: {
                direct: direct,
                isFree: isFree,
                isBuyed: isBuyed,
                isOwned: isOwned,
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
contentRouter.put("/buy-video", auth_1.default, async function (req, res) {
    try {
        const { data, contentId } = req.body;
        await content_service_1.default.buyVideo(contentId, data);
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
contentRouter.put("/assist-direct", auth_1.default, async function (req, res) {
    try {
        const { data, contentId } = req.body;
        await content_service_1.default.assistDirect(contentId, data);
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
exports.default = contentRouter;
