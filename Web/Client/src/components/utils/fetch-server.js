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
  post: (url, options = {}) => {
    const headers = { ...options.headers }
    const body = { ...options.body }

    return new Promise((resolve, reject) => {
      fetch(`${baseURL}${url}`, {
        method: "POST",
        headers: {
          ...defaultOptions.headers,
          ...headers,
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.ok)
            resolve(response.json())
        })
        .catch((error) => {
          reject(error)
        })

      // Firefox Ubuntu
      setTimeout(() => {
        reject(new Error("Request timed out"))
      }, 6000);
    })
  }
}

export { fetchServer }
