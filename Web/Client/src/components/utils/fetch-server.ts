import storage from "./local-storage"
import type { FetchOptions, Method } from "./types/fetch"

const serverInfo = {
  protocol: window.location.protocol,
  hostname: window.location.hostname,
  port: window.location.port,
}

let baseURL = `${serverInfo.protocol}//${serverInfo.hostname}:${serverInfo.port}`

if (baseURL === "http://localhost:3000")
  baseURL = "https://localhost:8080"

const defaultOptions = {
  headers: {
    "Accept": "application/json; charset=UTF-8",
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
}

type FetchMethod = {
  get: Method,
  post: Method,
}

const methods: FetchMethod = {
  get: "GET",
  post: "POST",
}

const jwt = { "Authorization": `Bearer ${storage.token}` }

const fetchPromise = (url: string, options: FetchOptions) => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController()
    const timeout = 6000
    const id = setTimeout(() => {
      controller.abort()
      reject(new Error("Request timed out"))
    }, timeout);
    const signal = controller.signal

    fetch(`${baseURL}${url}`, {
      method: options.method,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
      body: JSON.stringify(options.body),
      signal: signal,
    })
      .then((response) => {
        clearTimeout(id)
        if (!response.ok)
          throw new Error("Fetch response was not ok")

        resolve(response.json())
      })
      .catch((error) => {
        clearTimeout(id)
        reject(error)
      })
  })
}

const fetchServer = {
  get: async (url: string, options: FetchOptions = {}) => {
    const method = methods.get
    const headers = { ...jwt, ...options.headers }

    return fetchPromise(url, { method, headers })
  },
  post: async (url: string, options: FetchOptions = {}) => {
    const method = methods.post
    const headers = { ...jwt, ...options.headers }
    const body = { ...options.body }

    return fetchPromise(url, { method, headers, body })
  },
}

export { fetchServer, baseURL }
