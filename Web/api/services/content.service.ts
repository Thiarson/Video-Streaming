import fs from "node:fs"
import { mkdirp } from "mkdirp"
import { v4 as uuidv4 } from "uuid"
import type { AssistDirect, BuyVideo, DirectContent, UserInfo } from "@prisma/client"
import type { File } from "formidable"

import prisma from "../database/postgre/db"
import { generateThumbnail } from "../lib/generate-thumbnail"
import { encodeHls } from "../lib/encode"
import { generateKey, replaceSpecialChar } from "../lib/utils"
import type { DynamicObject } from "../utils/types/object"

type UploadFields = {
  playlist: string[],
  title: string[],
  description: string[],
  category: string[],
  duration: string[],
  price: string[],
  userId: string[]
}

type ProgamFields = {
  title: string[],
  description: string[],
  date: string[],
  time: string[],
  duration: string[],
  price: string[],
  userId: string[]
}

type UploadFile = {
  video: File[],
}

type ProgramFile = {
  image: File[],
}

const contentService: DynamicObject<string, Function> = {}

/**
 * Get the carousel list
 */
contentService.carouselList = async (userId: string) => {
  const videoBuyed: DynamicObject<string, BuyVideo> = {}
  const isBuyed: DynamicObject<string, boolean> = {}

  // Must get limited videos (10)
  const allVideos = await prisma.videoContent.findMany({
    where: {
      isValid: true,
      userId: {
        not: { equals: userId }
      }
    }
  })

  // Get all buyed video
  const buyedVideo = await prisma.buyVideo.findMany({
    where: { userId: userId }
  })
  
  buyedVideo.forEach((video) => {
    videoBuyed[video.videoId] = video
  });

  // Register all buyed and free video
  allVideos.forEach((video) => {
    if (video.videoPrice === '0')
      isBuyed[video.videoId] = true
    else if (videoBuyed[video.videoId] === undefined)
      isBuyed[video.videoId] = false
    else
      isBuyed[video.videoId] = true
  })

  return { videos: allVideos, isVideoBuyed: isBuyed }
}

/**
 * Get all content list
 */
contentService.allContent = async(userId: string) => {
  const videoBuyed: DynamicObject<string, BuyVideo> = {}
  const isVideoBuyed: DynamicObject<string, boolean> = {}
  const directBuyed: DynamicObject<string, AssistDirect> = {}
  const isDirectBuyed: DynamicObject<string, boolean> = {}
  const rediff: DirectContent[] = []
  const users: DynamicObject<string, UserInfo> = {}

  // Get all video
  const allVideos = await prisma.videoContent.findMany({
    where: {
      isValid: true,
      userId: { not: userId },
    }
  })

  // Get all buyed video
  const buyedVideo = await prisma.buyVideo.findMany({
    where: { userId: userId }
  })
  
  buyedVideo.forEach((video) => {
    videoBuyed[video.videoId] = video
  });

  // Register all buyed and free video
  allVideos.forEach((video) => {
    if (video.videoPrice === '0')
      isVideoBuyed[video.videoId] = true
    else if (videoBuyed[video.videoId] === undefined)
      isVideoBuyed[video.videoId] = false
    else
      isVideoBuyed[video.videoId] = true
  })

  // Get all direct
  const allDirect = await prisma.directContent.findMany({
    where: {
      isValid: true,
      userId: { not: userId },
      OR: [
        { directInProgress: null },
        { directInProgress: true },
      ]
    }
  })

  // Get all buyed direct
  const buyedDirect = await prisma.assistDirect.findMany({
    where: { userId: userId }
  })
  
  buyedDirect.forEach((direct) => {
    directBuyed[direct.directId] = direct
  });

  // Register all assisted and free direct
  allDirect.forEach((direct) => {
    if (direct.directPrice === '0')
      isDirectBuyed[direct.directId] = true
    else if (directBuyed[direct.directId] === undefined)
      isDirectBuyed[direct.directId] = false
    else
      isDirectBuyed[direct.directId] = true
  })

  // Get all rediffusion
  const allRediff = await prisma.rediffusionContent.findMany({
    include: { direct: true }
  })

  allRediff.forEach(({ direct }) => {
    if (direct.userId !== userId)
      rediff.push(direct)

    if (direct.directPrice === '0')
      isDirectBuyed[direct.directId] = true
    else if (directBuyed[direct.directId] === undefined)
      isDirectBuyed[direct.directId] = false
    else
      isDirectBuyed[direct.directId] = true
  })

  // Get all user
  const allUser = await prisma.userInfo.findMany({
    where: {
      userId: { not: userId }
    }
  })

  allUser.forEach((user) => {
    users[user.userId] = user
  })

  // Get all playlist
  const playlists = await prisma.videoPlaylist.findMany()

  return {
    videos: allVideos,
    direct: allDirect,
    rediffusion: rediff, 
    isVideoBuyed,
    isDirectBuyed,
    users,
    playlists,
  }
}

/**
 * Upload video to the server
 */
contentService.uploadVideo = async (formData: [UploadFields, UploadFile]) => {  
  const { playlist, title, description, category, duration, price, userId } = formData[0]
  const { video } = formData[1]
  const filePath = video[0].filepath
  // const resolutions = ['720p', '480p']
  const resolutions = ['720p']

  let name = title[0]
  name = replaceSpecialChar(name)

  const now = new Date()
  const videoId = `${uuidv4()}_${name}_${now.getTime()}`
  const videoUrl = `/streams/${userId}/videos/${videoId}/${name}.m3u8`
  const inPath = `./data/${userId}/${videoId}`
  const impTemp = `./data/${userId}/videos/${videoId}/temp.jpg`
  const thumbnail = `/data/${userId}/videos/${videoId}/${name}.jpg`

  // Il faut reverifier les données ici

  const videoPlaylist = await prisma.videoPlaylist.findUnique({
    where: { playlistId: playlist[0] }
  })

  await prisma.videoContent.create({
    data: {
      videoId : videoId,
      userId : userId[0],
      videoTitle : title[0],
      videoDescription : description[0],
      videoCategory : category[0],
      videoPrice : price[0],
      videoThumbnail : thumbnail,
      videoUrl : videoUrl,
      videoDuration : duration[0],
      videoPlaylist : videoPlaylist?.playlistId,
    }
  })

  await prisma.videoCheck.create({
    data: { videoId: videoId }
  })

  mkdirp.sync(`./data/${userId}`)
  fs.renameSync(filePath, inPath)

  mkdirp.sync(`./data/${userId}/videos/${videoId}`)
  fs.accessSync(`./data/${userId}/videos/${videoId}`, fs.constants.W_OK);
  fs.appendFileSync(`./data/${userId}/videos/${videoId}/${name}.m3u8`, '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-INDEPENDENT-SEGMENTS\n')

  generateThumbnail(inPath, impTemp, `./${thumbnail}`)
  encodeHls(inPath, videoId, resolutions, userId[0], name)
}


/**
 * Program the direct to the db
 */
contentService.programDirect = async (formData: [ProgamFields, ProgramFile]) => {  
  const { title, description, date, time, duration, price, userId } = formData[0]
  const { image } = formData[1]
  const filePath = image[0].filepath
  // const name = title[0].replace(/\s/g, '_')
  const name = replaceSpecialChar(title[0])

  const now = new Date()
  const directId = `${name}_${now.getTime()}`
  const directUrl = `/streams/${userId}/direct/${directId}/index.m3u8`
  const thumbnail = `/data/${userId}/direct/${directId}/${name}.jpg`

  // Il faut reverifier les données ici

  mkdirp.sync(`./data/${userId}/direct/${directId}`)
  fs.renameSync(filePath, `./${thumbnail}`)

  await prisma.directContent.create({
    data: {
      directId : directId,
      userId : userId[0],
      directTitle : title[0],
      directDescription : description[0],
      directDate: new Date(`${date[0]}T${time[0]}`),
      directPrice : price[0],
      directThumbnail : thumbnail,
      directUrl : directUrl,
      directDuration : duration[0],
      directKey: generateKey(),
    }
  })

  await prisma.directCheck.create({
    data: { directId: directId }
  })
}

/**
 * Get the specified video
 */
contentService.getVideo = async (videoId: string, userId: string) => {
  let isFree = false
  let isBuyed = false
  let isOwned = false

  let video = await prisma.videoContent.findUnique({
    where: { videoId: videoId }
  })

  if (!video)
    throw new Error("Video not found")

  const buyed = await prisma.buyVideo.findFirst({
    where: {
      videoId: videoId,
      userId: userId,
    }
  })

  if (userId === video.userId)
    isOwned = true
  else if (video.videoPrice === '0')
    isFree = true
  else
    isBuyed = buyed ? true : false

  return { isFree, isOwned, isBuyed, video }
}

/**
 * Get the specified direct
 */
contentService.getDirect = async (directId: string, userId: string) => {
  let isFree = false
  let isBuyed = false
  let isOwned = false

  let direct = await prisma.directContent.findUnique({
    where: { directId: directId }
  })

  if (!direct)
    throw new Error("Direct not found")

  const buyed = await prisma.assistDirect.findFirst({
    where: {
      directId: directId,
      userId: userId,
    }
  })

  if (userId === direct.userId)
    isOwned = true
  else if (direct.directPrice === '0')
    isFree = true
  else
    isBuyed = buyed ? true : false

  return { isFree, isOwned, isBuyed, direct }
}

/**
 * Buy the specified video
 */
contentService.buyVideo = async (videoId: string, userId: string) => {
  const user = await prisma.userInfo.findUnique({
    where: { userId: userId }
  })

  if (!user)
    throw new Error("User not found")

  const video = await prisma.videoContent.findUnique({
    where: { videoId: videoId }
  })

  if (!video)
    throw new Error("Video not found")

  const price = parseInt(video.videoPrice)
  let money = parseInt(user.userWallet)

  money = money - price

  if (money < 0)
    throw new Error("Not enough money in wallet")

  await prisma.buyVideo.create({
    data: {
      videoId: videoId,
      userId: userId,
    }
  })

  await prisma.userInfo.update({
    where: { userId: userId },
    data: { userWallet: money.toString() }
  })
}

/**
 * Assist to the specified direct
 */
contentService.assistDirect = async (directId: string, userId: string) => {
  const user = await prisma.userInfo.findUnique({
    where: { userId: userId }
  })

  if (!user)
    throw new Error("User not found")

  const direct = await prisma.directContent.findUnique({
    where: { directId: directId }
  })

  if (!direct)
    throw new Error("Direct not found")

  const price = parseInt(direct.directPrice)
  let money = parseInt(user.userWallet)

  money = money - price

  if (money < 0)
    throw new Error("Not enough money in wallet")

  await prisma.assistDirect.create({
    data: {
      directId: directId,
      userId: userId,
    }
  })

  await prisma.userInfo.update({
    where: { userId: userId },
    data: { userWallet: money.toString() }
  })
}

export default contentService
