import { createContext, useContext } from "react"
import type { FC, PropsWithChildren, Dispatch, SetStateAction } from "react"
import type { DirectContent, UserInfo, VideoContent } from "@prisma/client"

import type { DynamicObject } from "../types/object"

export type InfoValue = {
  type: "video" | "direct" | null,
  setType: Dispatch<SetStateAction<"video" | "direct">> | Function
  content: VideoContent | DirectContent | null,
  setContent: Dispatch<SetStateAction<VideoContent | DirectContent>> | Function
  users: DynamicObject<string, UserInfo>,
  isVideoBuyed: DynamicObject<string, boolean>,
  isDirectBuyed: DynamicObject<string, boolean>,
}

type Props = PropsWithChildren<{value: InfoValue}>

const InfoContext = createContext<InfoValue>({
  type: null,
  setType: () => { console.log("setType: no context") },
  content: null,
  setContent: () => { console.log("setInfo: no context") },
  users: {},
  isVideoBuyed: {},
  isDirectBuyed: {},
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
