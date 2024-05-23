import { createContext, useContext } from "react"

const serverData = {
  protocol: window.location.protocol,
  hostname: window.location.hostname,
  port: window.location.port,
}

let serverUrl = `${serverData.protocol}//${serverData.hostname}:${serverData.port}`

if (serverUrl === "http://localhost:3000")
  serverUrl = "https://localhost:8080"

const ServerContext = createContext({ url: "https://localhost:8080" })

function useServer() {
  return useContext(ServerContext)
}

function ServerProvider({ children }) {
  const server = {
    url: serverUrl,
  }

  return (
    <ServerContext.Provider value={server}>
      {children}
    </ServerContext.Provider>
  )
}

export { useServer, ServerProvider }
