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
 * Route to upload video
 */
contentRouter.post("/upload-video", auth, async function (req, res) {
  try {
    const maxFileSize = 500 * 1024 * 1024 // 500 mo
    const form = formidable({ maxFileSize: maxFileSize })
    const formData = await form.parse(req)
    
    await contentService.uploadVideo(formData)

    res.json({
      success: true,
      data: null,
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
 * Route to program direct
 */
contentRouter.post("/program-direct", auth, async function (req, res) {
  try {
    const form = formidable()
    const formData = await form.parse(req)
    
    await contentService.programDirect(formData)

    res.json({
      success: true,
      data: null,
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

/** 
 * Route to get the specified direct
 */
contentRouter.get("/get-direct/:directId", auth, async function (req, res) {
  try {
    const { data } = req.body
    const { directId } = req.params
    
    const { isFree, isOwned, isBuyed, direct } = await contentService.getDirect(directId, data)

    res.json({ 
      success: true,
      data: {
        direct: direct,
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

/** 
 * Route to buy video
 */
contentRouter.put("/buy-video", auth, async function (req, res) {
  try {
    const { data, contentId } = req.body
    
    await contentService.buyVideo(contentId, data)

    res.json({ 
      success: true,
      data: null,
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
 * Route to assist to a  direct
 */
contentRouter.put("/assist-direct", auth, async function (req, res) {
  try {
    const { data, contentId } = req.body
    
    await contentService.assistDirect(contentId, data)

    res.json({ 
      success: true,
      data: null,
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
