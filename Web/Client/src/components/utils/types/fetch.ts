import type { Code, User } from "./data"

export type FetchOptions = {
  headers?: {},
  body?: {},
}

export type FetchUserResponse = {
  success: boolean,
  token?: string,
  data: User | null,
}

export type FetchCodeResponse = {
  success: boolean,
  token?: string,
  data: Code | null,
}
