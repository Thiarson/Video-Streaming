import { createContext, useContext } from "react"
import type { FC, PropsWithChildren, Dispatch, SetStateAction } from "react"

import type { User, Video } from "../types/data"
import type { DynamicObject } from "../types/object"

type InfoValue = {
  video: Video | null,
  setVideo: Dispatch<SetStateAction<Video>> | Function
  users: DynamicObject<string, User>,
  isVideoBuyed: DynamicObject<string, boolean>,
}

type Props = PropsWithChildren<{value: InfoValue}>

const InfoContext = createContext<InfoValue>({
  video: null,
  setVideo: () => { console.log("setInfo: no context") },
  users: {},
  isVideoBuyed: {},
})

function useInfo() {
  return useContext(InfoContext)
}

const InfoProvider: FC<Props> = ({ value, children }) => {
  return (
    <InfoContext.Provider value={value}>
      {children}
    </InfoContext.Provider>
  )
}

export { InfoProvider, useInfo }
