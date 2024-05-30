import { Router } from "express"
import { formidable } from "formidable"

import contentService from "../services/content.service"

const contentRouter = Router()

/**
 * Route to get the carousel list
 */

contentRouter.post("/carousel-list", async function (req, res) {
  try {
    const { userId } = req.body
    const { videos, videoBuyed} = await contentService.carouselList(userId)

    res.json({
      success: true,
      data: {
        videos: videos,
        videoBuyed: videoBuyed,
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

export default contentRouter
