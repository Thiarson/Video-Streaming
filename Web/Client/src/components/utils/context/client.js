import { createContext, useContext } from "react"

const ClientContext = createContext(null)

function useClient() {
  return useContext(ClientContext)
}

function ClientProvider({ value, children }) {
  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  )
}

export { useClient, ClientProvider }
