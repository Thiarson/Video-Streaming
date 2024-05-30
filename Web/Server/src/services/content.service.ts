import prisma from "../database/postgre/db"
import type { DynamicObject } from "../utils/types/object"
import type { BuyVideo } from "../utils/types/data"

const contentService: DynamicObject<string, Function> = {}

/**
 * Get the carousel list
 */
contentService.carouselList = async (userId: string) => {
  const temp: DynamicObject<string, BuyVideo> = {}
  const buyed: DynamicObject<string, boolean> = {}

  const allVideos = await prisma.videoContent.findMany({
    where: {
      userId: {
        not: { equals: userId }
      }
    }
  })

  const buyedVideo = await prisma.buyVideo.findMany({
    where: { userId: userId }
  })
  
  buyedVideo.forEach((video) => {
    temp[video.videoId] = video
  });

  allVideos.forEach((video) => {
    if (video.videoPrice === '0')
      buyed[video.videoId] = true
    else if (temp[video.videoId] === undefined)
      buyed[video.videoId] = false
    else
      buyed[video.videoId] = true
  })

  return { videos: allVideos, videoBuyed: buyed }
}

export default contentService
