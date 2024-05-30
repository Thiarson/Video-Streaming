import type { FetchOptions } from "./types/fetch"

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

const fetchServer = {
  get: null,
  post: async (url: string, options: FetchOptions = {}) => {
    const headers = { ...options.headers }
    const body = { ...options.body }

    return new Promise((resolve, reject) => {
      const controller = new AbortController()
      const timeout = 6000
      const id = setTimeout(() => {
        controller.abort()
        reject(new Error("Request timed out"))
      }, timeout);
      const signal = controller.signal
  
      fetch(`${baseURL}${url}`, {
        method: "POST",
        headers: {
          ...defaultOptions.headers,
          ...headers,
        },
        body: JSON.stringify(body),
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
}

export { fetchServer, baseURL }
