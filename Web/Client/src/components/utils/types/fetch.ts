import type { Code, User, Video } from "./data"
import type { DynamicObject } from "./object"

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

export type FetchVideoResponse = {
  success: boolean,
  data: { videos: Video[], videoBuyed: DynamicObject<string, boolean> } | null
}
