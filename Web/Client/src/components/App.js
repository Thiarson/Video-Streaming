import { useState } from "react"

import Authentication from "./Authentication"
import Navigation from "./Navigation"
import Loading from "./assets/Loading"
import Error from "./assets/Error"
import useFetch from "./utils/hooks/useFetch"
import storage from "./utils/local-storage"
import { ClientProvider } from "./utils/context/client"

function App() {
  const [ sessionVerif, setSessionVerif] = useState(false)
  const [ user, setUser ] = useState(null)

  const headers = { "Authorization": `Bearer ${storage.token}` }
  const { loading, response, errors } = useFetch("/api/session-verif", { headers: headers })

  if (errors)
    return <Error code="503" action="reload">Réessayer</Error>
  else if (loading)
    return <Loading/>

  if (user === null) {
    if (!sessionVerif) {
      response.success ? setUser(response.data) : storage.remove("token")
      setSessionVerif(true)
    }

    return (
      <ClientProvider value={{ user, setUser }}>
        <Authentication/>
      </ClientProvider>
    )
  } else {
    return (
      <ClientProvider value={{ user, setUser }}>
        <Navigation/>
      </ClientProvider>
    )
  }
}

export default App
