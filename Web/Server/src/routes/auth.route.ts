import bcrypt from "bcrypt"
import { Router } from "express"
import { v4 as uuidv4 } from "uuid"

import authService from "../services/auth.service"
import auth from "../middlewares/auth"
import type { DynamicObject } from "../utils/types/object"

const authRouter = Router()
const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

/** 
 * Route to signup new user
 */
authRouter.post("/signup", async function (req, res) {
  try {
    const userData = {
      userId: `${uuidv4()}_${req.body.pseudo}_${new Date().getTime()}`,
      userPseudo: req.body.pseudo,
      userBirthDate: new Date(req.body.birth),
      userSex: req.body.sex,
      userPhone: req.body.phone,
      userEmail: req.body.email,
      userPassword: bcrypt.hashSync(req.body.password, salt),
    }

    const code = await authService.addUser(userData)

    res.json({
      success: true,
      data: {
        code: code,
        email: userData.userEmail,
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
 * Route to verify the code
 */
authRouter.post("/code-valid", async function (req, res) {
  try {
    const { email, code } = req.body
    const { user, token } = await authService.codeValidation({ email, code })

    res.json({
      success: true,
      token: token,
      data: {
        userId: user.userId,
        userPseudo: user.userPseudo,
        userEmail: user.userEmail,
        userWallet: user.userWallet,
        userBio: user.userBio,
        userPhoto: user.userPhoto,
        userPassword: user.userPassword,
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
 * Route to login user
 */
authRouter.post("/login", async function (req, res) {
  try {
    const userData: DynamicObject<string, string> = {
      userPassword: req.body.password
    }
    
    if(/^\d{10}$/.test(req.body.login)) {
      userData.userPhone = req.body.login
    }
    else if(/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i.test(req.body.login)) {
      userData.userEmail = req.body.login
    }
  
    const { user, token } = await authService.verifyUser(userData)

    res.json({
      success: true,
      token: token,
      data: {
        userId: user.userId,
        userPseudo: user.userPseudo,
        userEmail: user.userEmail,
        userWallet: user.userWallet,
        userBio: user.userBio,
        userPhoto: user.userPhoto,
        userPassword: user.userPassword,
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
 * Route to verify session
 */
authRouter.get("/session-verif", auth, async function (req, res) {
  try {
    const { data } = req.body        
    const user = await authService.verifySession(data)

    res.json({
      success: true,
      data: {
        userId: user.userId,
        userPseudo: user.userPseudo,
        userEmail: user.userEmail,
        userWallet: user.userWallet,
        userBio: user.userBio,
        userPhoto: user.userPhoto,
        userPassword: user.userPassword,
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
 * Route for forget password
 */
authRouter.post("/forget-password", async function (req, res) {
  try {
    const { email } = req.body
    const code = await authService.forgetPassword(email)

    res.json({
      success: true,
      data: {
        code: code,
        email: email,
      }
    })
  } catch (e) {
     if (e instanceof Error)
      console.error(e.message);
    else
      console.error(`Unepected error: ${e}`);

    res.json({
      success: false,
      data: null
    })
  }
})

/** 
 * Route when reset password
 */
authRouter.post("/reset-password", async function (req, res) {
  try {
    const { email, password } = req.body
    const userData = {
      userEmail: email,
      userPassword: bcrypt.hashSync(password, salt),
    }

    await authService.resetPassword(userData)

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

export default authRouter
