import { Router } from "express"

import streamService from "../services/stream.service"

const streamRouter = Router()

/** 
 * Route to get the media content
 */
streamRouter.get("*", async function (req, res) {
  const content = await streamService.getContent(req.url)
  
  res.send(content)
})

export default streamRouter
