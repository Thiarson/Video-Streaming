const bcrypt = require("bcrypt")

const prisma = require("../database/postgre/db")
const tempStorage = require("../lib/temp-storage")
const { sendMail } = require("../config/mail-config")
const { generateJwtToken } = require("../lib/jwt-server")
const { loginSchema, signupSchema } = require("../lib/data-validator")
const { generateVerifCode } = require("../lib/code-generator")

const authService = {}

/**
 * Verify user for signup
 */
authService.addUser = async (userData) => {
  // Verify user data
  const { error } = signupSchema.validate({
    sex: userData.userSex,
    pseudo: userData.userPseudo,
    phone: userData.userPhone,
    email: userData.userEmail,
    birth: userData.userBirthDate,
    password: userData.userPassword,
  })

  if (error)
    throw new Error("Invalid data")

  // Verify validity of unique field contraint
  let user = await prisma.userInfo.findMany({
    where: {
      OR: [
        { userPhone: userData.userPhone },
        { userEmail: userData.userEmail },
      ]
    },
  })

  if(user.length !== 0)
    throw new Error("Email and phone must be unique")

  // Send verification code to user email
  const code = generateVerifCode()
  const subject = "Code de vérification"
  const textMessage = `Voici le code de vérification de votre compte: ${code}`
  const sent = sendMail(userData.userEmail, subject, textMessage)
  console.log(code);

  // if (!sent)
  //   throw new Error("Cannot send the e-mail")

  // Cache email and code in temporary database (Mongo)
  tempStorage.set(userData.userEmail, { code: code, userId: userData.userId }, 90)
  tempStorage.set(userData.userId, userData, 90)

  return code

  // Send verification code to user phone
}

/**
 * Verify user code for signup
 */
authService.codeValidation = async ({ email, code }) => {
  /// Verify code and extract user data from temporary database (Mongo)
  const { code: generateCode, userId } = tempStorage.get(email)

  if (code !== generateCode)
    throw new Error("Code verification is wrong")

  const userData = tempStorage.get(userId)

  // Add new user from prisma
  user = await prisma.userInfo.create({
    data: userData,
  });

  if(user) {    
    const token = generateJwtToken(user.userId)

    tempStorage.del(email)
    tempStorage.del(userId)

    return { user, token }
  }

  throw new Error("Cannot add user to database")
}

/**
 * Verify user for login
 */
authService.verifyUser = async (userData) => {
  // Verify user data
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
