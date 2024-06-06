import fs from "node:fs"
import { extname } from "node:path"
import { mkdirp } from "mkdirp"
import type { AssistDirect, BuyVideo, DirectContent, VideoPlaylist } from "@prisma/client"

import prisma from "../database/postgre/db"
import type { DynamicObject } from "../utils/types/object"

type PhotoFields = {
  userId: string[]
}

const profileService: DynamicObject<string, Function> = {}

/**
 * Get all content list
 */
profileService.profileContent = async(userId: string) => {
  const videoBuyed: DynamicObject<string, BuyVideo> = {}
  const directBuyed: DynamicObject<string, AssistDirect> = {}
  const playlists: DynamicObject<string, VideoPlaylist> = {}
  const rediff: DirectContent[] = []

  // Get all video
  const allVideos = await prisma.videoContent.findMany({
    where: {
      isValid: true,
      userId: userId,
    }
  })

  // Get all buyed video
  const buyedVideo = await prisma.buyVideo.findMany({
    where: { userId: userId }
  })
  
  buyedVideo.forEach((video) => {
    videoBuyed[video.videoId] = video
  });

  // Get all direct
  const allDirect = await prisma.directContent.findMany({
    where: {
      isValid: true,
      userId: userId,
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

  // Get all rediffusion
  const allRediff = await prisma.rediffusionContent.findMany({
    include: { direct: true }
  })

  allRediff.forEach(({ direct }) => {
    if (direct.userId === userId)
      rediff.push(direct)
  })

  // Get all playlist
  const myPlaylists = await prisma.videoPlaylist.findMany({
    where: { userId: userId }
  })

  myPlaylists.forEach((playlist) => {
    playlists[playlist.playlistTitle] = playlist
  })

  return {
    videos: allVideos,
    direct: allDirect,
    rediffusion: rediff, 
    videoBuyed,
    directBuyed,
    playlists,
  }
}

/**
 * Create new playlist for the specified user
 */
profileService.createPlaylist = async(userId: string, title: string, description: string) => {
  // Il faut reverifier les données ici

  await prisma.videoPlaylist.create({
    data: {
      userId: userId,
      playlistTitle: title,
      playlistDescription: description,
    }
  })
}

/**
 * Add the amount of money to the user wallet
 */
profileService.addMoney = async(userId: string, amount: string) => {
  const user = await prisma.userInfo.findUnique({
    where: { userId: userId }
  })

  if (!user)
    throw new Error("User not found")

  let userMoney = parseInt(user.userWallet) + parseInt(amount)

  return await prisma.userInfo.update({
    where: { userId: userId },
    data: { userWallet: userMoney.toString() }
  })
}

/**
 * Change the profil photo of user
 */
profileService.changePhoto = async (formData: [PhotoFields, { image: any[] }]) => {
  const { userId } = formData[0]
  const { image } = formData[1]  
  const extension = extname(image[0].originalFilename)
  const filePath = image[0].filepath
  const path = `/data/temp/${userId}/profile`
  const name = `photo${extension}`
  const photo = `${path}/${name}`
  let files = null

  mkdirp.sync(`.${path}`)
  files = fs.readdirSync(`.${path}`)
  
  files.forEach((file) => {     
    fs.unlinkSync(`.${path}/${file}`)
  });

  fs.renameSync(filePath, `.${path}/${name}`)

  return photo
}

/**
 * Modify user information
 */
profileService.profileModif = async (userId: string, photo: string, pseudo: string, bio: string) => {
  // Il faut reverifier les données ici

  const url = `/data/${userId}/profile/`
  const extension = extname(photo)
  const newPhoto = `photo${extension}`
  const path = `.${url}${newPhoto}`

  mkdirp.sync(url)
  fs.renameSync(`.${photo}`, path)

  const user = await prisma.userInfo.update({
    where: { userId: userId },
    data: {
      userPhoto: `${url}${newPhoto}`,
      userPseudo: pseudo,
      userBio: bio,
    },
  })

  return user
}

export default profileService
