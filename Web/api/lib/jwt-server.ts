import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

const jwtSignSecret = process.env.JWT_SIGN_SECRET

if (!jwtSignSecret)
  throw new Error("JWT secret is undefined")

const generateJwtToken = (payload: string) => {
  const tokenPayload = { payload: payload }

  const jwtOptions = {
    expiresIn: '1y',
  }

  return jwt.sign(tokenPayload, jwtSignSecret, jwtOptions)
}

const decodeJwtToken = (token: string) => {
  return jwt.verify(token, jwtSignSecret)
}

export { generateJwtToken, decodeJwtToken }
