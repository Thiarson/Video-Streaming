import type { AssistDirect, BuyVideo, DirectContent, UserInfo } from "@prisma/client"

import prisma from "../database/postgre/db"
import type { DynamicObject } from "../utils/types/object"

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

export default contentService
