"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const mkdirp_1 = require("mkdirp");
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../database/postgre/db"));
const generate_thumbnail_1 = require("../lib/generate-thumbnail");
const encode_1 = require("../lib/encode");
const utils_1 = require("../lib/utils");
const contentService = {};
contentService.carouselList = async (userId) => {
    const videoBuyed = {};
    const isBuyed = {};
    const allVideos = await db_1.default.videoContent.findMany({
        where: {
            isValid: true,
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
contentService.uploadVideo = async (formData) => {
    const { playlist, title, description, category, duration, price, userId } = formData[0];
    const { video } = formData[1];
    const filePath = video[0].filepath;
    const resolutions = ['720p'];
    let name = title[0];
    name = (0, utils_1.replaceSpecialChar)(name);
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const publication = `${date} ${time}`;
    const videoId = `${(0, uuid_1.v4)()}_${name}_${now.getTime()}`;
    const videoUrl = `/streams/${userId}/videos/${videoId}/${name}.m3u8`;
    const inPath = `./data/${userId}/${videoId}`;
    const impTemp = `./data/${userId}/videos/${videoId}/temp.jpg`;
    const thumbnail = `/data/${userId}/videos/${videoId}/${name}.jpg`;
    const videoPlaylist = await db_1.default.videoPlaylist.findUnique({
        where: { playlistId: playlist[0] }
    });
    await db_1.default.videoContent.create({
        data: {
            videoId: videoId,
            userId: userId[0],
            videoTitle: title[0],
            videoDescription: description[0],
            videoCategory: category[0],
            videoPrice: price[0],
            videoThumbnail: thumbnail,
            videoUrl: videoUrl,
            videoDuration: duration[0],
            videoPlaylist: videoPlaylist?.playlistId,
        }
    });
    await db_1.default.videoCheck.create({
        data: { videoId: videoId }
    });
    mkdirp_1.mkdirp.sync(`./data/${userId}`);
    node_fs_1.default.renameSync(filePath, inPath);
    mkdirp_1.mkdirp.sync(`./data/${userId}/videos/${videoId}`);
    node_fs_1.default.accessSync(`./data/${userId}/videos/${videoId}`, node_fs_1.default.constants.W_OK);
    node_fs_1.default.appendFileSync(`./data/${userId}/videos/${videoId}/${name}.m3u8`, '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-INDEPENDENT-SEGMENTS\n');
    (0, generate_thumbnail_1.generateThumbnail)(inPath, impTemp, `./${thumbnail}`);
    (0, encode_1.encodeHls)(inPath, videoId, resolutions, userId[0], name);
};
contentService.programDirect = async (formData) => {
    const { title, description, date, time, duration, price, userId } = formData[0];
    const { image } = formData[1];
    const filePath = image[0].filepath;
    const name = (0, utils_1.replaceSpecialChar)(title[0]);
    const now = new Date();
    const directId = `${name}_${now.getTime()}`;
    const directUrl = `/streams/${userId}/direct/${directId}/index.m3u8`;
    const thumbnail = `/data/${userId}/direct/${directId}/${name}.jpg`;
    mkdirp_1.mkdirp.sync(`./data/${userId}/direct/${directId}`);
    node_fs_1.default.renameSync(filePath, `./${thumbnail}`);
    await db_1.default.directContent.create({
        data: {
            directId: directId,
            userId: userId[0],
            directTitle: title[0],
            directDescription: description[0],
            directDate: new Date(`${date[0]}T${time[0]}`),
            directPrice: price[0],
            directThumbnail: thumbnail,
            directUrl: directUrl,
            directDuration: duration[0],
            directKey: (0, utils_1.generateKey)(),
        }
    });
    await db_1.default.directCheck.create({
        data: { directId: directId }
    });
};
contentService.getVideo = async (videoId, userId) => {
    let isFree = false;
    let isBuyed = false;
    let isOwned = false;
    let video = await db_1.default.videoContent.findUnique({
        where: { videoId: videoId }
    });
    if (!video)
        throw new Error("Video not found");
    const buyed = await db_1.default.buyVideo.findFirst({
        where: {
            videoId: videoId,
            userId: userId,
        }
    });
    if (userId === video.userId)
        isOwned = true;
    else if (video.videoPrice === '0')
        isFree = true;
    else
        isBuyed = buyed ? true : false;
    return { isFree, isOwned, isBuyed, video };
};
exports.default = contentService;
