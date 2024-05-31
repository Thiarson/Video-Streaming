import { FC } from "react"

export type User = {
  userId: string,
  userSex: string,
  userPseudo: string,
  userPhone: string,
  userEmail: string,
  userWallet: string,
  userBirthDate: Date,
  userBio: string | null,
  userPhoto: string,
  userPassword: string,
}

export type Video = {
  videoId: string,
  userId: string,
  videoTitle: string,
  videoDescription: string,
  videoCategory: string,
  videoPrice: string,
  videoThumbnail: string,
  videoUrl: string,
  videoPublicationDate: Date,
  videoDuration: string,
  videoPlaylist: string | null,
  isValid: boolean,
}

export type Direct = {
  directId: string,
  userId: string,
  directTitle: string,
  directDescription: string,
  directThumbnail: string,
  directUrl: string,
  directDate: Date,
  directDuration: string,
  directPrice: string,
  directInProgress: boolean | null,
  directKey: string,
  isValid: string,
}

export type Playlist = {
  playlistId: string,
  userId: string,
  playlistTitle: string,
  playlistDescription: string,
  videoCount: number,
}

export type Code = {
  code: number,
  email: string,
}

export type Login = {
  login: string,
  password: string,
}

export type Signup = {
  sex: string,
  pseudo: string,
  email: string,
  phone: string,
  birth: string,
  password: string,
}

export type HomeMenuType = {
  none: string,
  sortContent: string,
  createContent: string,
  account: string,
}

export type HomeMenu = {
  [x in keyof HomeMenuType]: FC
}
