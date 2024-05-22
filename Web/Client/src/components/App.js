import { useContext, useState } from "react"

import Authentication from "./Authentication"
import Navigation from "./Navigation"
import Loading from "./assets/Loading"
import Error from "./assets/Error"
import context from "./utils/context"
import { useFetch } from "./utils/hooks"

function App() {
  const { ServerContext, ClientContext } = context
  const url = useContext(ServerContext)
  const [ userData, setUserData ] = useState(null)

  const serverUrl = `${url}/api/session-verif`
  const headers = { "Authorization": localStorage.getItem("token") }
  const { loading, response, errors } = useFetch(serverUrl, { headers: headers })

  if (errors)
    return <Error code="503" message={errors.message} action="reload">Try again</Error>
  else if (loading)
    return <Loading/>

  if (userData === null) {
    if (response.success)
      setUserData(response.data)
    else
      localStorage.removeItem("token")

    return (
      <ClientContext.Provider value={{ userData, setUserData }}>
        <Authentication/>
      </ClientContext.Provider>
    )
  } else {
    return (
      <ClientContext.Provider value={{ userData, setUserData }}>
        <Navigation/>
      </ClientContext.Provider>
    )
  }
}

export default App
