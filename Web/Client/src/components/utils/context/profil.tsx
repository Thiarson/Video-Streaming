import { createContext, useContext } from "react"
import type { FC, PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  value: {
    selected: string,
    select: Function
  }
}>

const ProfileContext = createContext<{ selected: string, select: Function }>({
  selected: "playlist",
  select: () => { console.error("select: no context"); },
})

function useProfile() {
  return useContext(ProfileContext)
}

const ProfileProvider: FC<Props> = ({ value, children }) => {
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

export { useProfile, ProfileProvider }
