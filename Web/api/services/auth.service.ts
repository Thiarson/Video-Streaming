import bcrypt from "bcrypt"
import Joi from "joi"
import type { UserInfo } from "@prisma/client"

import prisma from "../database/postgre/db"
import tempStorage from "../lib/temp-storage"
import { generateJwtToken } from "../lib/jwt-server"
import { loginSchema, signupSchema, pattern } from "../lib/data-validator"
import { generateVerifCode } from "../lib/code-generator"
import { mailOptions, transporter } from "../config/mail-config"
import type { DynamicObject } from "../utils/types/object"
import type { Code } from "../utils/types/data"
import type { MailOptions } from "nodemailer/lib/json-transport"

const authService: DynamicObject<string, Function> = {}

/**
 * Verify user for signup
 */
authService.addUser = async (userData: UserInfo): Promise<number> => {
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
  let user = await prisma.userInfo.findFirst({
    where: {
      OR: [
        { userPhone: userData.userPhone },
        { userEmail: userData.userEmail },
      ]
    },
  })

  if(user)
    throw new Error("Email and phone must be unique")

  // Send verification code to user email
  const code = generateVerifCode()
  const subject = "Code de vérification"
  const textMessage = `Voici le code de vérification de votre compte: ${code}`
  const options: MailOptions = {
    ...mailOptions,
    to: userData.userEmail,
    subject: subject,
    text: textMessage,
  }

  await transporter.sendMail(options)
  console.log(code);

  // Cache email and code in temporary database (Mongo)
  tempStorage.set(userData.userEmail, { code: code, userId: userData.userId }, 90)
  tempStorage.set(userData.userId, userData, 90)

  return code

  // Send verification code to user phone
}

/**
 * Verify user code for signup
 */
authService.codeValidation = async ({ email, code }: Code): Promise<{ user: UserInfo; token: string }> => {
  /// Verify code and extract user data from temporary database (Mongo)
  const { code: generateCode, userId } = tempStorage.get(email)

  if (code !== generateCode)
    throw new Error("Code verification is wrong")

  const userData = tempStorage.get(userId)

  // Add new user from prisma
  const user = await prisma.userInfo.create({
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
authService.verifyUser = async (userData: UserInfo): Promise<{ user: UserInfo; token: string }> => {
  // Verify user data
  const { error } = loginSchema.validate({
    phone: userData.userPhone,
    email: userData.userEmail,
    password: userData.userPassword,
  })

  if (error)
    throw new Error("Invalid data")

  // Verify user from prisma
  let user = await prisma.userInfo.findFirst({
    where: {
      OR: [
        { userPhone: userData.userPhone },
        { userEmail: userData.userEmail },
      ]
    },
  })

  if(user) {    
    if(bcrypt.compareSync(userData.userPassword, user.userPassword)) {
      const token = generateJwtToken(user.userId)
      return { user: user, token }
    }

    throw new Error("Incorrect password")
  }

  throw new Error("User not found")
}

/**
 * Verify session for user
 */
authService.verifySession = async (userId: string): Promise<UserInfo> => {
  let user = await prisma.userInfo.findUnique({
    where: { userId: userId }
  })

  if(user)
    return user

  throw new Error("User not found")
}

/**
 * Handle forget password
 */
authService.forgetPassword = async (email: string): Promise<number> => {
    // Verify email
    const emailSchema = Joi.object({ email: pattern.email.required() })
    const { error }= emailSchema.validate({ email: email })
  
    if (error)
      throw new Error("Invalid data")
  
    // Verify validity of unique field contraint
    let user = await prisma.userInfo.findUnique({
      where: { userEmail: email }
    })
  
    if(!user)
      throw new Error("Email not found")
  
    // Send verification code to user email
    const code = generateVerifCode()
    const subject = "Code de vérification"
    const textMessage = `Voici le code de vérification de votre compte: ${code}`
    const options: MailOptions = {
      ...mailOptions,
      to: email,
      subject: subject,
      text: textMessage,
    }
  
    await transporter.sendMail(options)  
    console.log(code);
  
    // Cache email and code in temporary database (Mongo)
    tempStorage.set(email, { code: code }, 90)
  
    return code
}

/**
 * Handle reset password
 */
authService.resetPassword = async (userData: UserInfo): Promise<void> => {
  // Update user info from prisma
  const user = await prisma.userInfo.update({
    where: { userEmail: userData.userEmail },
    data: { userPassword: userData.userPassword },
  });
}

export default authService
