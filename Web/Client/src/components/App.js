import { useContext, useEffect, useState } from "react"

import Authentication from "./Authentication"
import Navigation from "./Navigation"
import Loading from "./assets/Loading"
import context from "./utils/context"
import { fetchServer } from "./utils/fetch-server"

function App() {
  const { ServerContext, ClientContext } = context
  const url = useContext(ServerContext)
  const [ userData, setUserData ] = useState(null)

  useEffect(() => {
    const sessionVerif = async () => {
      if (localStorage.getItem("token")) {
        const serverUrl = `${url}/api/session-verif`
        const headers = { "Authorization": localStorage.getItem("token") }
        const { success, data } = await fetchServer.post(serverUrl, { headers: headers })

        if (success) {
          setUserData(data)
        } else {
          localStorage.clear()
          window.location.replace("/")
        }
      }
    }

    sessionVerif()
  }, [])

  if (localStorage.getItem("token")) {
    if (userData === null) {
      return (
        <Loading/>
      )
    } else {
      return (
        <ClientContext.Provider value={{ userData, setUserData }}>
          <Navigation/>
        </ClientContext.Provider>
      )
    }
  } else {
    return (
      <ClientContext.Provider value={{ userData, setUserData }}>
        <Authentication/>
      </ClientContext.Provider>
    )
  }
}

export default App
