import { z } from "zod"

export const dataSchema = z.object({
  userId: z.string(),
  userPseudo: z.string(),
  userEmail: z.string(),
  userWallet: z.string(),
  userBio: z.string(),
  userPhoto: z.string(),
  userPassword: z.string(),
})

export const responseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  data: z.union([dataSchema, z.null()]),
})
