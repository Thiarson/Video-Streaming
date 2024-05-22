const bcrypt = require("bcrypt")

const prisma = require("../database/postgre/db")
const { generateJwtToken } = require("../lib/jwt-server")
const { loginSchema } = require("../lib/data-validator")

const authService = {}

/**
 * Verify user for login
 */
authService.verifyUser = async (userData) => {
  // Verify user data
  // const { error } = loginSchema.validate(req.body)
  const { error } = loginSchema.validate({
    phone: userData.userPhone,
    email: userData.userEmail,
    password: userData.userPassword,
  })

  if (error)
    throw new Error("Invalid data")

  // Verify user from prisma
  let user = await prisma.userInfo.findMany({
    where: {
      OR: [
        { userPhone: userData.userPhone },
        { userEmail: userData.userEmail },
      ]
    },
  })

  if(user.length !== 0) {
    user = user[0]
    
    if(bcrypt.compareSync(userData.userPassword, user.userPassword)) {
      const token = generateJwtToken(user.userId)
      return { user, token }
    }

    throw new Error("Incorrect password")
  }

  throw new Error("User not found")
}

/**
 * Verify session for user
 */
authService.verifySession = async (userId) => {
  let user = await prisma.userInfo.findMany({
    where: { userId: userId },
  })

  if(user.length !== 0)
    return user[0]

  throw new Error("User not found")
}

module.exports = authService
