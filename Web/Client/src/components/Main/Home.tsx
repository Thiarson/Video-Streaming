import { Fragment, useEffect, useReducer, useRef, useState } from "react"
import { useSelector } from "react-redux"
import type { FC, Reducer } from "react"
import type { DirectContent, UserInfo, VideoContent, VideoPlaylist } from "@prisma/client"

import Navbar from "./Navbar"
import UploadVideo from "./UploadVideo"
import ProgramDirect from "./ProgramDirect"
import SortContent from "./MenuSortContent"
import CreateContent from "./MenuCreateContent"
import Account from "./MenuAccount"
import Carousel from "./Carousel"
import Info from "./Info"
import VideoList from "./VideoList"
import DirectList from "./DirectList"
import Loading from "../assets/Loading"
import Error from "../assets/Error"
import storage from "../utils/helpers/local-storage"
import { useQuery, useQueryClient } from "react-query"
import { fetchServer } from "../utils/fetch-server"
import { MenuProvider } from "../utils/context/menu"
import { InfoProvider } from '../utils/context/info';
import { useClient } from "../utils/context/client"
import type { HomeMenu, HomeMenuType } from "../utils/types/data"
import type { RootState } from "../utils/context/store"
import type { FetchAllContentResponse } from "../utils/types/fetch"
import type { DynamicObject } from "../utils/types/object"
import type { InfoValue } from "../utils/context/info"
import BuyContent from "./BuyContent"

type VideoCategory = DynamicObject<string, (VideoContent | DirectContent)[]>

const menus: HomeMenu = {
  none: Fragment,
  sortContent: SortContent,
  createContent: CreateContent,
  account: Account,
}

const reducer: Reducer<FC, keyof HomeMenuType> = (state, type) => {
  if (menus[type] === state)
    return menus.none

  return menus[type]
}

const Home: FC = () => {
  const queryClient = useQueryClient()
  const modal = useSelector((store: RootState) => store.modal)
  const categories = useRef<VideoCategory>({})
  const direct = useRef<DirectContent[]>([])
  const isVideoBuyed = useRef<DynamicObject<string, boolean>>({})
  const isDirectBuyed = useRef<DynamicObject<string, boolean>>({})
  const users = useRef<DynamicObject<string, UserInfo>>({})
  const myPlaylist = useRef<VideoPlaylist[]>([])
  const { user } = useClient()
  const [ Menu, dispatch ] = useReducer(reducer, Fragment)
  const [ info, setInfo ] = useState(null)
  const [ infoType, setInfoType  ] = useState(null)

  const queryKey = ["all-content"]
  const query = useQuery(queryKey, () => {
    return fetchServer.get("/api/all-content")
  }, { cacheTime: 0, enabled: false })

  document.body.style.overflowY = ""

  for (const [, value] of Object.entries(modal)) {
    if (value.isOpen) {
      document.body.style.overflowY = "clip"
      break
    }
  }

  const contentList = () => {
    const list = []

    list.push(<DirectList key="Direct" directList={direct.current}/>)

    for (const category in categories.current) {
      const videos = categories.current[category] as VideoContent[]

      if(videos.length === 0)
        continue

      list.push(<VideoList key={category} videoList={videos} category={category}/>)
    }

    return list
  }
  
  useEffect(() => {
    query.refetch()
  }, [])
  
  if (storage.token === null)
    return <Loading/>

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchAllContentResponse
      const { success, data } = response
      
      // responseSchema.parse(response)

      if (success && data) {
        // Trier les videos par catégories        
        users.current = data.users
        isVideoBuyed.current = data.isVideoBuyed
        isDirectBuyed.current = data.isDirectBuyed

        direct.current = data.direct

        data.videos.forEach((video) => {
          const { videoCategory: category } = video

          if (!categories.current[category])
            categories.current[category] = []

          categories.current[video.videoCategory].push(video)
        })

        data.playlists.forEach((playlist) => {
          if (playlist.userId === user?.userId)
            myPlaylist.current.push(playlist)
        })

        categories.current["Rediffusion"] = []
        data.rediffusion.forEach((rediff) => categories.current["Rediffusion"].push(rediff))

        queryClient.resetQueries(queryKey)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }    
  }

  const video = contentList()
  const infoValue: InfoValue = {
    type: infoType,
    setType: setInfoType,
    content: info,
    setContent: setInfo,
    users: users.current,
    isVideoBuyed: isVideoBuyed.current,
    isDirectBuyed: isDirectBuyed.current,
    myPlaylists: myPlaylist.current,
  }

  return (
    <MenuProvider value={{ Menu, toggleMenu: dispatch }}>
    <InfoProvider value={infoValue}>
      {modal.uploadVideo.isOpen && <UploadVideo/>}
      {modal.programDirect.isOpen && <ProgramDirect/>}
      {modal.info.isOpen && <Info/>}
      {modal.buy.isOpen && <BuyContent/>}
      <Navbar/>
      <Carousel/>
      <div className="pb-24">{video}</div>
    </InfoProvider>
    </MenuProvider>
  )
}

export default Home
