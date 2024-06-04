import path from "node:path"
import fs from "node:fs"
import { Router } from "express"

import streamService from "../services/stream.service"

const streamRouter = Router()

const api = path.dirname(__dirname)
const web = path.dirname(api)
const data = path.join(web, "data")

/** 
 * Route to get the media content
 */
streamRouter.get("*", async function (req, res) {
  try {
    const format = [ ".m3u8", ".ts" ]
    const extension = path.extname(req.url)

    if (format.indexOf(extension) === -1)
      throw new Error("Data format is invalid")    

    const stream = path.join(data, req.url)    
    
    if (!fs.existsSync(stream))
      throw new Error("This ressource is unavailabe")

    const content = await streamService.getContent(req.url)
    
    res.send(content)
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

export default streamRouter
