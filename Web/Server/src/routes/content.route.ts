import { Router } from "express"
import { formidable } from "formidable"

import contentService from "../services/content.service"
import auth from "../middlewares/auth"

const contentRouter = Router()

/**
 * Route to get the carousel list
 */

contentRouter.get("/carousel-list", auth, async function (req, res) {
  try {
    const { data } = req.body
    const { videos, isVideoBuyed} = await contentService.carouselList(data)

    res.json({
      success: true,
      data: {
        videos: videos,
        isVideoBuyed: isVideoBuyed,
      },
    })
  } catch (e) {
    if (e instanceof Error)
      console.error(e.message);
    else
      console.error(`Unepected error: ${e}`);
    
    res.json({ 
      success: false,
      data: null,
    })
  }
})

/** 
 * Route to get all the content
 */
contentRouter.get("/all-content", auth, async function (req, res) {
  try {
    const { data } = req.body
    const contents = await contentService.allContent(data)

    res.json({
      success: true,
      data: {
        videos: contents.videos,
        direct: contents.direct,
        rediffusion: contents.rediffusion, 
        isVideoBuyed: contents.isVideoBuyed,
        isDirectBuyed: contents.isDirectBuyed,
        users: contents.users,
        playlists: contents.playlists,
      }
    })
  } catch (e) {
    if (e instanceof Error)
      console.error(e.message);
    else
      console.error(`Unepected error: ${e}`);
    
    res.json({ 
      success: false,
      data: null,
    })
  }
})

/** 
 * Route to get the specified video
 */
contentRouter.get("/get-video/:videoId", auth, async function (req, res) {
  try {
    const { data } = req.body
    const { videoId } = req.params
    
    const { isFree, isOwned, isBuyed, video } = await contentService.getVideo(videoId, data)

    res.json({ 
      success: true,
      data: {
        video: video,
        isFree: isFree,
        isBuyed: isBuyed,
        isOwned: isOwned,
      }
    })
  } catch (e) {
    if (e instanceof Error)
      console.error(e.message);
    else
      console.error(`Unepected error: ${e}`);
    
    res.json({ 
      success: false,
      data: null,
    })
  }
})

export default contentRouter
