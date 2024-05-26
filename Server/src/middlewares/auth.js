const { decodeJwtToken } = require("../lib/jwt-server")

/**
 * Middleware to verify the key in the request
 */
module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization.split(" ")
    const token = authorization[1]
    const { payload } = decodeJwtToken(token)

    if (payload) {
      req.data = payload
      next()
    } else {
      res.json({
        success: false,
        data: null,
      })
    }
  } catch (e) {
    console.error(e.message)
    res.json({
      success: false,
      data: null,
    })
  }
}
