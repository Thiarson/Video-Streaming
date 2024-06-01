import { createContext, useContext } from "react"
import type { FC, PropsWithChildren, Dispatch, SetStateAction } from "react"
import type { UserInfo, VideoContent } from "@prisma/client"

import type { DynamicObject } from "../types/object"

type InfoValue = {
  video: VideoContent | null,
  setVideo: Dispatch<SetStateAction<VideoContent>> | Function
  users: DynamicObject<string, UserInfo>,
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
