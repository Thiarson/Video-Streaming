const { decodeJwtToken } = require("../lib/jwt-server")

/**
 * Middleware to verify the key in the request
 */
module.exports = async (req, res, next) => {
  try {
    const { payload } = decodeJwtToken(req.headers.authorization)

    if (payload) {
      req.data = payload
      next()
    } else {
      res.json({ success: false })
    }
  } catch (e) {
    console.error(e.message)
    res.json({ success: false })
  }
}
