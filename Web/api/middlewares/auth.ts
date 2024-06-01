import type { RequestHandler } from "express"

import { decodeJwtToken } from "../lib/jwt-server"
import { JwtPayload } from "jsonwebtoken"

/**
 * Middleware to verify the key in the request
 */
const auth: RequestHandler =  async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const authorization = req.headers.authorization.split(" ")
      const token = authorization[1]
      const { payload } = decodeJwtToken(token) as JwtPayload

      if (payload) {
        req.body.data = payload
        return next()
      }

      throw new Error("Token or payload is undefined")
    }
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
}

export default auth
