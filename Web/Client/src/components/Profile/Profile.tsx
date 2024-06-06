import { useEffect, useReducer, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useQuery } from "react-query"
import type { FC, Reducer } from "react"
import type { VideoPlaylist, VideoContent } from "@prisma/client"

import ProfileNavbar from "./ProfileNavbar"
import UploadVideo from "../Main/UploadVideo"
import ProgramDirect from "../Main/ProgramDirect"
import CreatePlaylist from "./CreatePlaylist"
import ProfileModif from "./ProfileModif"
import AddMoney from "./AddMoney"
import ProfileMenu from "./ProfileMenu"
import ShowPlaylists from "./ShowPlaylists"
import ShowVideos from "./ShowVideos"
import ShowDirect from "./ShowDirect"
import ShowBuyed from "./ShowBuyed"
import ShowAssisted from "./ShowAssisted"
import ShowSettings from "./ShowSettings"
import Error from "../assets/Error"
import { useClient } from "../utils/context/client"
import { baseURL, fetchServer } from "../utils/fetch-server"
import { openModal } from "../utils/features/modal"
import { ProfileProvider } from "../utils/context/profil"
import type { FetchProfileContentResponse } from "../utils/types/fetch"
import type { RootState } from "../utils/context/store"
import type { DynamicObject } from "../utils/types/object"

const options = {
  playlist: "playlist",
  video: "video",
  direct: "direct",
  buyed: "buyed",
  assisted: "assisted",
  setting: "setting",
}

const reducer: Reducer<string, keyof typeof options> = (state, type) => {
  return options[type]
}

const Profile: FC = () => {
  const { user } = useClient()
  const [ selected, select ] = useReducer(reducer, "playlist")
  const dispatch = useDispatch()
  const modal = useSelector((store: RootState) => store.modal)
  const playlists = useRef<DynamicObject<string, VideoPlaylist>>({})
  const playlistsVideos = useRef<DynamicObject<string, VideoContent[]>>({})

  const queryKey = ["profile-content"]
  const query = useQuery(queryKey, () => {
    return fetchServer.get("/api/profile-content")
  }, { cacheTime: 0, enabled: false })

  const handleProfieModif = () => {
    dispatch(openModal("profileModif"))
  }

  useEffect(() => {
    document.body.style.backgroundColor = "white"
    query.refetch()

    return () => { document.body.style.backgroundColor = "rgb(212 212 216)" }
  }, [])

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchProfileContentResponse
      const { success, data } = response

      // responseSchema.parse(response)
      
      if (success && data) {
        const videoWithPlaylist: DynamicObject<string, VideoContent[]> = {}
        data.videos.forEach((video) => {
          if (video.videoPlaylist) {
            if (!videoWithPlaylist[video.videoPlaylist])
              videoWithPlaylist[video.videoPlaylist] = []

            videoWithPlaylist[video.videoPlaylist].push(video)
          }
        })
        playlistsVideos.current = videoWithPlaylist

        playlists.current = data.playlists
      } else {
        // databaseError === false && setDatabaseError(true)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }    
  }

  let show = null

  if (selected === "playlist")
    show = <ShowPlaylists videos={playlistsVideos.current} playlists={playlists.current}/>
  else if (selected === "video")
    show = <ShowVideos/>
  else if (selected === "direct")
    show = <ShowDirect/>
  else if (selected === "buyed")
    show = <ShowBuyed/>
  else if (selected === "assisted")
    show = <ShowAssisted/>
  else if (selected === "setting")
    show = <ShowSettings/>

  return (
    <ProfileProvider value={{ selected, select }}>
      {modal.uploadVideo.isOpen && <UploadVideo/>}
      {modal.programDirect.isOpen && <ProgramDirect/>}
      {modal.createPlaylist.isOpen && <CreatePlaylist/>}
      {modal.addMoney.isOpen && <AddMoney/>}
      {modal.profileModif.isOpen && <ProfileModif/>}
      <ProfileNavbar/>
      <div className="h-[89vh] flex">
        <div className="w-4/5">
          {show}
        </div>
        <div className="w-1/5 border-l-2 border-zinc-800 flex flex-col">
          <div className="flex flex-col items-center border-b-2 border-zinc-800 cursor-pointer" onClick={handleProfieModif}>
            <img className="w-28 h-28 rounded-full overflow-hidden mt-2 mb-2 border-2 border-black cursor-pointer" src={baseURL+user?.userPhoto} alt="Profil"/>
            <p className="font-semibold text-lg">{user?.userPseudo}</p>
            <p className="text-sm text-zinc-500 font-mono">{user?.userWallet} Ariary</p>
            <p className="text-sm text-zinc-500 font-mono text-center p-2">{user?.userBio}</p>
          </div>
          <ProfileMenu/>
        </div>
      </div>
    </ProfileProvider>
  )
}

export default Profile
