import type { Code, Direct, Playlist, User, Video } from "./data"
import type { DynamicObject } from "./object"

export type Method = "GET" | "POST"

export type FetchOptions = {
  method?: Method,
  headers?: {},
  body?: {},
  signal?: AbortSignal
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
  data: { videos: Video[], isVideoBuyed: DynamicObject<string, boolean> } | null
}

export type FetchAllContentResponse = {
  success: boolean,
  data: {
    videos: Video[],
    isVideoBuyed: DynamicObject<string, boolean>,
    direct: Direct[],
    isDirectBuyed: DynamicObject<string, boolean>,
    rediffusion: Direct[],
    users: DynamicObject<string, User>,
    playlists: Playlist[],
  } | null
}
