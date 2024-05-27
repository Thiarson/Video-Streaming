const bcrypt = require("bcrypt")
const { Router } = require("express")
const { v4: uuidv4 } = require("uuid")

const authService = require("../services/auth.service")
const auth = require("../middlewares/auth")

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
    console.error(e.message);
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
    console.error(e.message);
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
    const userData = {
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
    console.error(e.message);
    res.json({
      success: false,
      data: null,
    })
  }
})

/** 
 * Route to verify session
 */
authRouter.post("/session-verif", auth, async function (req, res) {
  try {
    const user = await authService.verifySession(req.data)

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
    console.error(e.message);
    res.json({
      success: false,
      data: null,
    })
  }
})

module.exports = authRouter
