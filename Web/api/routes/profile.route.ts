import { Router } from "express"

import profileService from "../services/profile.service"
import auth from "../middlewares/auth"

const profileRouter = Router()



export default profileRouter
