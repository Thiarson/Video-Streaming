import { z } from "zod"

export const userSchema = z.object({
  userId: z.string(),
  userPseudo: z.string(),
  userEmail: z.string(),
  userWallet: z.string(),
  userBio: z.union([z.string(), z.null()]),
  userPhoto: z.string(),
  userPassword: z.string(),
})

const codeShema = z.object({
  code: z.number().min(1000).max(9999),
})

export const responseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  data: z.union([userSchema, codeShema, z.null()]),
})
