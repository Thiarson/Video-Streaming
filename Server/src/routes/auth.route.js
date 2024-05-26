const { Router } = require("express")

const authService = require("../services/auth.service")
const auth = require("../middlewares/auth")

const authRouter = Router()

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
