import { Fragment, useEffect, useReducer, useRef, useState } from "react"
import { useSelector } from "react-redux"
import type { FC, Reducer } from "react"

import Navbar from "./Navbar"
import UploadVideo from "./UploadVideo"
import SortContent from "./MenuSortContent"
import CreateContent from "./MenuCreateContent"
import Account from "./MenuAccount"
import Carousel from "./Carousel"
import Info from "./Info"
import BuyVideo from "./BuyVideo"
import VideoList from "./VideoList"
import Loading from "../assets/Loading"
import Error from "../assets/Error"
import storage from "../utils/local-storage"
import { useQuery, useQueryClient } from "react-query"
import { fetchServer } from "../utils/fetch-server"
import { MenuProvider } from "../utils/context/menu"
import { InfoProvider } from "../utils/context/info"
import type { Direct, HomeMenu, HomeMenuType, User, Video } from "../utils/types/data"
import type { RootState } from "../utils/context/store"
import type { FetchAllContentResponse } from "../utils/types/fetch"
import type { DynamicObject } from "../utils/types/object"

type VideoCategory = DynamicObject<string, (Video | Direct)[]>

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
  const isVideoBuyed = useRef<DynamicObject<string, boolean>>({})
  const users = useRef<DynamicObject<string, User>>({})
  const [ Menu, dispatch ] = useReducer(reducer, Fragment)
  const [ info, setInfo ] = useState(null)
  
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

    for (const category in categories.current) {
      const videos = categories.current[category] as Video[]

      if(videos.length === 0)
        return null

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
        data.videos.forEach((video) => {
          const { videoCategory: category } = video

          if (!categories.current[category])
            categories.current[category] = []

          categories.current[video.videoCategory].push(video)
        })

        // categories.current["Rediffusion"] = []
        // data.rediffusion.forEach((rediff) => categories.current["Rediffusion"].push(rediff))

        queryClient.resetQueries(queryKey)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }    
  }

  const video = contentList()
  const infoValue = {
    video: info,
    setVideo: setInfo,
    users: users.current,
    isVideoBuyed: isVideoBuyed.current,
  }

  return (
    <MenuProvider value={{ Menu, toggleMenu: dispatch }}>
    <InfoProvider value={infoValue}>
      {modal.uploadVideo.isOpen && <UploadVideo/>}
      {/* {modal.programDirect.isOpen && <ProgramDirect/>} */}
      {modal.info.isOpen && <Info/>}
      {modal.buy.isOpen && <BuyVideo/>}
      <Navbar/>
      <Carousel/>
      <div className="pb-24">{video}</div>
    </InfoProvider>
    </MenuProvider>
  )
}

export default Home
