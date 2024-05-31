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

export const videoSchema = z.object({
  videoId: z.string(),
  userId: z.string(),
  videoTitle: z.string(),
  videoDescription: z.string(),
  videoCategory: z.string(),
  videoPrice: z.string(),
  videoThumbnail: z.string(),
  videoUrl: z.string(),
  videoPublicationDate: z.date(),
  videoDuration: z.string(),
  videoPlaylist: z.union([z.string(), z.null(),]),
  isValid: z.union([z.string(), z.null(),]),
}) 

const codeShema = z.object({
  code: z.number().min(1000).max(9999),
})


const carouselSchema = z.object({
  videoBuyed: z.record(z.boolean()),
  videos: z.array(videoSchema)
})

export const responseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  data: z.union([userSchema, codeShema, carouselSchema, z.null()]),
})
