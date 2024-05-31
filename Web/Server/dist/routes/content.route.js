"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
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
exports.default = contentRouter;
