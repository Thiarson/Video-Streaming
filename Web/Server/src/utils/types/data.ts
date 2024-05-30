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

export type Code = {
  code: number,
  email: string,
}

export type BuyVideo = {
  buyVideoId: number;
  videoId: string;
  userId: string;
  purchaseDate: Date;
}
