import type { DirectContent, VideoPlaylist, UserInfo, VideoContent } from "@prisma/client"
import type { Code } from "./data"
import type { DynamicObject } from "./object"

export type Method = "GET" | "POST" | "PUT"

export type FetchOptions = {
  method?: Method,
  headers?: {},
  body?: {},
  signal?: AbortSignal
}

export type FetchUserResponse = {
  success: boolean,
  token?: string,
  data: UserInfo | null,
}

export type FetchCodeResponse = {
  success: boolean,
  token?: string,
  data: Code | null,
}

export type FetchVideoResponse = {
  success: boolean,
  data: { videos: VideoContent[], isVideoBuyed: DynamicObject<string, boolean> } | null
}

export type FetchAllContentResponse = {
  success: boolean,
  data: {
    videos: VideoContent[],
    isVideoBuyed: DynamicObject<string, boolean>,
    direct: DirectContent[],
    isDirectBuyed: DynamicObject<string, boolean>,
    rediffusion: DirectContent[],
    users: DynamicObject<string, UserInfo>,
    playlists: VideoPlaylist[],
  } | null
}

export type FetchVoidResponse = {
  success: boolean,
  data: null,
}
