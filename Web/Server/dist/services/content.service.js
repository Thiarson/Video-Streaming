"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/postgre/db"));
const contentService = {};
contentService.carouselList = async (userId) => {
    const videoBuyed = {};
    const isBuyed = {};
    const allVideos = await db_1.default.videoContent.findMany({
        where: {
            userId: {
                not: { equals: userId }
            }
        }
    });
    const buyedVideo = await db_1.default.buyVideo.findMany({
        where: { userId: userId }
    });
    buyedVideo.forEach((video) => {
        videoBuyed[video.videoId] = video;
    });
    allVideos.forEach((video) => {
        if (video.videoPrice === '0')
            isBuyed[video.videoId] = true;
        else if (videoBuyed[video.videoId] === undefined)
            isBuyed[video.videoId] = false;
        else
            isBuyed[video.videoId] = true;
    });
    return { videos: allVideos, isVideoBuyed: isBuyed };
};
contentService.allContent = async (userId) => {
    const videoBuyed = {};
    const isVideoBuyed = {};
    const directBuyed = {};
    const isDirectBuyed = {};
    const rediff = [];
    const users = {};
    const allVideos = await db_1.default.videoContent.findMany({
        where: {
            isValid: true,
            userId: { not: userId },
        }
    });
    const buyedVideo = await db_1.default.buyVideo.findMany({
        where: { userId: userId }
    });
    buyedVideo.forEach((video) => {
        videoBuyed[video.videoId] = video;
    });
    allVideos.forEach((video) => {
        if (video.videoPrice === '0')
            isVideoBuyed[video.videoId] = true;
        else if (videoBuyed[video.videoId] === undefined)
            isVideoBuyed[video.videoId] = false;
        else
            isVideoBuyed[video.videoId] = true;
    });
    const allDirect = await db_1.default.directContent.findMany({
        where: {
            isValid: true,
            userId: { not: userId },
            OR: [
                { directInProgress: null },
                { directInProgress: true },
            ]
        }
    });
    const buyedDirect = await db_1.default.assistDirect.findMany({
        where: { userId: userId }
    });
    buyedDirect.forEach((direct) => {
        directBuyed[direct.directId] = direct;
    });
    allDirect.forEach((direct) => {
        if (direct.directPrice === '0')
            isDirectBuyed[direct.directId] = true;
        else if (directBuyed[direct.directId] === undefined)
            isDirectBuyed[direct.directId] = false;
        else
            isDirectBuyed[direct.directId] = true;
    });
    const allRediff = await db_1.default.rediffusionContent.findMany({
        include: { direct: true }
    });
    allRediff.forEach(({ direct }) => {
        if (direct.userId !== userId)
            rediff.push(direct);
    });
    const allUser = await db_1.default.userInfo.findMany({
        where: {
            userId: { not: userId }
        }
    });
    allUser.forEach((user) => {
        users[user.userId] = user;
    });
    const playlists = await db_1.default.videoPlaylist.findMany();
    return {
        videos: allVideos,
        direct: allDirect,
        rediffusion: rediff,
        isVideoBuyed,
        isDirectBuyed,
        users,
        playlists,
    };
};
exports.default = contentService;
