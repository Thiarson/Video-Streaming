import { useState } from "react"
import type { UserInfo } from "@prisma/client"

import Authentication from "./Authentication"
import Navigation from "./Navigation"
import Loading from "./assets/Loading"
import Error from "./assets/Error"
import storage from "./utils/helpers/local-storage"
import { useFetch } from "./utils/hooks/useFetch"
import { ClientProvider } from "./utils/context/client"
import { responseSchema } from "./utils/data-validator"
import type { FetchUserResponse } from "./utils/types/fetch"

function App() {
  const [ sessionVerif, setSessionVerif] = useState(false)
  const [ user, setUser ] = useState<UserInfo | null>(null)
  const { loading, response, errors } = useFetch("/api/session-verif")

  if (errors)
    return <Error code="503" action="reload">Réessayer</Error>
  else if (loading)
    return <Loading/>
  
  try {
    responseSchema.parse(response)
  } catch (e) {
    console.error(e);
    return <Error code="502" action="reload">Réessayer</Error>
  }

  if (user === null) {
    if (!sessionVerif) {
      const { success, data } = response as FetchUserResponse
      success ? setUser(data) : storage.remove("token")
      setSessionVerif(true)
    }
  }

  const Component = user === null ? Authentication : Navigation

  return (
    <ClientProvider value={{ user, setUser }}>
      <Component/>
    </ClientProvider>
  )
}

export default App
