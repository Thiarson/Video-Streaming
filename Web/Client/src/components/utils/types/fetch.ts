import type { User } from "./user"

export type FetchOptions = {
  headers?: {},
  body?: {},
}

export type FetchResponse = {
  success: boolean,
  token?: string,
  data: User | null,
}
