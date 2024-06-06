"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const mkdirp_1 = require("mkdirp");
const db_1 = __importDefault(require("../database/postgre/db"));
const profileService = {};
profileService.profileContent = async (userId) => {
    const videoBuyed = {};
    const directBuyed = {};
    const playlists = {};
    const rediff = [];
    const allVideos = await db_1.default.videoContent.findMany({
        where: {
            isValid: true,
            userId: userId,
        }
    });
    const buyedVideo = await db_1.default.buyVideo.findMany({
        where: { userId: userId }
    });
    buyedVideo.forEach((video) => {
        videoBuyed[video.videoId] = video;
    });
    const allDirect = await db_1.default.directContent.findMany({
        where: {
            isValid: true,
            userId: userId,
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
    const allRediff = await db_1.default.rediffusionContent.findMany({
        include: { direct: true }
    });
    allRediff.forEach(({ direct }) => {
        if (direct.userId === userId)
            rediff.push(direct);
    });
    const myPlaylists = await db_1.default.videoPlaylist.findMany({
        where: { userId: userId }
    });
    myPlaylists.forEach((playlist) => {
        playlists[playlist.playlistTitle] = playlist;
    });
    return {
        videos: allVideos,
        direct: allDirect,
        rediffusion: rediff,
        videoBuyed,
        directBuyed,
        playlists,
    };
};
profileService.createPlaylist = async (userId, title, description) => {
    await db_1.default.videoPlaylist.create({
        data: {
            userId: userId,
            playlistTitle: title,
            playlistDescription: description,
        }
    });
};
profileService.addMoney = async (userId, amount) => {
    const user = await db_1.default.userInfo.findUnique({
        where: { userId: userId }
    });
    if (!user)
        throw new Error("User not found");
    let userMoney = parseInt(user.userWallet) + parseInt(amount);
    return await db_1.default.userInfo.update({
        where: { userId: userId },
        data: { userWallet: userMoney.toString() }
    });
};
profileService.changePhoto = async (formData) => {
    const { userId } = formData[0];
    const { image } = formData[1];
    const extension = (0, node_path_1.extname)(image[0].originalFilename);
    const filePath = image[0].filepath;
    const path = `/data/temp/${userId}/profile`;
    const name = `photo${extension}`;
    const photo = `${path}/${name}`;
    let files = null;
    mkdirp_1.mkdirp.sync(`.${path}`);
    files = node_fs_1.default.readdirSync(`.${path}`);
    files.forEach((file) => {
        node_fs_1.default.unlinkSync(`.${path}/${file}`);
    });
    node_fs_1.default.renameSync(filePath, `.${path}/${name}`);
    return photo;
};
profileService.profileModif = async (userId, photo, pseudo, bio) => {
    const url = `/data/${userId}/profile/`;
    const extension = (0, node_path_1.extname)(photo);
    const newPhoto = `photo${extension}`;
    const path = `.${url}${newPhoto}`;
    mkdirp_1.mkdirp.sync(url);
    node_fs_1.default.renameSync(`.${photo}`, path);
    const user = await db_1.default.userInfo.update({
        where: { userId: userId },
        data: {
            userPhoto: `${url}${newPhoto}`,
            userPseudo: pseudo,
            userBio: bio,
        },
    });
    return user;
};
exports.default = profileService;
