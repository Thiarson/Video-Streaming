"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/postgre/db"));
const contentService = {};
contentService.carouselList = async (userId) => {
    const temp = {};
    const buyed = {};
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
        temp[video.videoId] = video;
    });
    allVideos.forEach((video) => {
        if (video.videoPrice === '0')
            buyed[video.videoId] = true;
        else if (temp[video.videoId] === undefined)
            buyed[video.videoId] = false;
        else
            buyed[video.videoId] = true;
    });
    return { videos: allVideos, videoBuyed: buyed };
};
exports.default = contentService;
