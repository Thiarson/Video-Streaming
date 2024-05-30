"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_service_1 = __importDefault(require("../services/content.service"));
const contentRouter = (0, express_1.Router)();
contentRouter.post("/carousel-list", async function (req, res) {
    try {
        const { userId } = req.body;
        const { videos, videoBuyed } = await content_service_1.default.carouselList(userId);
        res.json({
            success: true,
            data: {
                videos: videos,
                videoBuyed: videoBuyed,
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
exports.default = contentRouter;
