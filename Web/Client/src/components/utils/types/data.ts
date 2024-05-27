export type User = {
  userId: string,
  userPseudo: string,
  userEmail: string,
  userWallet: string,
  userBio: string,
  userPhoto: string,
  userPassword: string,
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
