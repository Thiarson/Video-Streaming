"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_service_1 = __importDefault(require("../services/profile.service"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const formidable_1 = __importDefault(require("formidable"));
const profileRouter = (0, express_1.Router)();
profileRouter.get("/profile-content", auth_1.default, async function (req, res) {
    try {
        const { data } = req.body;
        const contents = await profile_service_1.default.profileContent(data);
        res.json({
            success: true,
            data: {
                videos: contents.videos,
                direct: contents.direct,
                rediffusion: contents.rediffusion,
                videoBuyed: contents.videoBuyed,
                directBuyed: contents.directBuyed,
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
profileRouter.post("/create-playlist", auth_1.default, async function (req, res) {
    try {
        const { data, title, description } = req.body;
        await profile_service_1.default.createPlaylist(data, title, description);
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
profileRouter.put("/add-money", auth_1.default, async function (req, res) {
    try {
        const { data, amount } = req.body;
        const user = await profile_service_1.default.addMoney(data, amount);
        res.json({
            success: true,
            data: user,
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
profileRouter.put("/change-photo", auth_1.default, async function (req, res) {
    try {
        const form = (0, formidable_1.default)();
        const formData = await form.parse(req);
        const photo = await profile_service_1.default.changePhoto(formData);
        res.json({
            success: true,
            data: photo,
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
profileRouter.put("/profile-modif", auth_1.default, async function (req, res) {
    try {
        const { data, photo, pseudo, bio } = req.body;
        const user = await profile_service_1.default.profileModif(data, photo, pseudo, bio);
        res.json({
            success: true,
            data: user,
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
profileRouter.get("/other-profile/:profileId", auth_1.default, async function (req, res) {
    try {
        const { data } = req.body;
        const { profileId } = req.params;
        const user = await profile_service_1.default.otherProfile(data, profileId);
        res.json({
            success: true,
            data: user,
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
exports.default = profileRouter;
