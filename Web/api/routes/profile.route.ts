import { Router } from "express"

import profileService from "../services/profile.service"
import auth from "../middlewares/auth"
import formidable from "formidable"

const profileRouter = Router()

/** 
 * Route to get the profile content
 */
profileRouter.get("/profile-content", auth, async function (req, res) {
  try {
    const { data } = req.body
    const contents = await profileService.profileContent(data)

    res.json({
      success: true,
      data: {
        videos: contents.videos,
        direct: contents.direct,
        rediffusion: contents.rediffusion, 
        videoBuyed: contents.videoBuyed,
        directBuyed: contents.directBuyed,
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
 * Route to create new playlist
 */
profileRouter.post("/create-playlist", auth, async function (req, res) {
  try {
    const { data, title, description } = req.body
    
    await profileService.createPlaylist(data, title, description)

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
 * Route to add money
 */
profileRouter.put("/add-money", auth, async function (req, res) {
  try {
    const { data, amount } = req.body
    
    const user = await profileService.addMoney(data, amount)

    res.json({
      success: true,
      data: user,
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
 * Route to change user photo
 */
profileRouter.put("/change-photo", auth, async function (req, res) {
  try {
    const form = formidable()
    const formData = await form.parse(req)
    
    const photo = await profileService.changePhoto(formData)

    res.json({
      success: true,
      data: photo,
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
 * Route to modify user information
 */
profileRouter.put("/profile-modif", auth, async function (req, res) {
  try {
    const { data, photo, pseudo, bio } = req.body
    
    const user = await profileService.profileModif(data, photo, pseudo, bio)

    res.json({
      success: true,
      data: user,
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
 * Route to get information and content of the specified user
 */
profileRouter.get("/other-profile/:profileId", auth, async function (req, res) {
  try {
    const { data } = req.body
    const { profileId } = req.params    
    
    const user = await profileService.otherProfile(data, profileId)

    res.json({
      success: true,
      data: user,
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

export default profileRouter
