import type { FC } from "react"

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

export type Payement = "Mvola" | "Airtel Money" | "Orange Money"
