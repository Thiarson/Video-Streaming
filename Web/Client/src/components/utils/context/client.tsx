import { createContext, useContext } from "react"
import type { FC, PropsWithChildren, Dispatch, SetStateAction } from "react"

import type { User } from "../types/user"

type ClientValue = {
  user: User | null,
  setUser: Dispatch<SetStateAction<User | null>> | Function,
}

type Props = PropsWithChildren<{
  value: ClientValue,
}>

const ClientContext = createContext<ClientValue>({
  user: null,
  setUser: () => { console.error("setUser: no context"); },
})

function useClient() {
  return useContext(ClientContext)
}

const ClientProvider: FC<Props> = ({ value, children }) => {
  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  )
}

export { useClient, ClientProvider }
