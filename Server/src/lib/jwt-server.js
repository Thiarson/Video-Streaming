const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

const jwtSignSecret = process.env.JWT_SIGN_SECRET

const generateJwtToken = (payload) => {
  const tokenPayload = { payload: payload }

  const jwtOptions = {
    expiresIn: '1y',
  }

  return jwt.sign(tokenPayload, jwtSignSecret, jwtOptions)
}

const decodeJwtToken = (token) => {
  return jwt.verify(token, jwtSignSecret)
}

module.exports = { generateJwtToken, decodeJwtToken }
