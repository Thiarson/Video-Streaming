import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BsArrowLeft } from "react-icons/bs"
import type { FC } from "react"
import type { VideoContent, VideoPlaylist } from "@prisma/client"

import Button from "../assets/Button"
import { baseURL } from "../utils/fetch-server"
import { directSpec } from "../utils/helpers/media-spec"
import { format } from "../utils/helpers/format"
import type { DynamicObject } from "../utils/types/object"

type Props = {
  videos: DynamicObject<string, VideoContent[]>,
  playlists: DynamicObject<string, VideoPlaylist>,
}

const ShowPlaylists: FC<Props> = ({ videos, playlists }) => {
  const videoList = []
  const [ showPlaylist, setShowPlaylist ] = useState<VideoPlaylist | null>(null)

  for (const playlist in videos) {
    if(videos[playlist].length !== 0) {
      const video = videos[playlist][0]
      const playlistInfo = playlists[playlist]

      videoList.push(
        <div key={playlistInfo.playlistTitle} className="flex flex-col gap-1">
          <div onClick={() => setShowPlaylist(playlistInfo)} className="w-[240px] h-[165px] relative cursor-pointer transition duration hover:scale-110 hover:border-2 border-black rounded-md">
            <img className="object-cover shadow-xl rounded-md w-full h-full" src={baseURL+video.videoThumbnail} alt="Thumbnail"/>
            <div className="flex justify-between items-center px-4 absolute bottom-0 w-full h-[20%] bg-white bg-opacity-60 rounded-b-md text-black">
              <p className="text-sm font-semibold">{playlistInfo.playlistTitle}</p>
              <p className="text-sm font-semibold">{playlistInfo.videoCount} vidéos</p>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      {showPlaylist === null ? 
      <h1 className="flex justify-center font-light text-3xl py-4 border-b-2 border-zinc-800">Playlists</h1> : 
      <div className="flex w-full border-b-2 border-zinc-800 items-center">
        <BsArrowLeft onClick={() => setShowPlaylist(null)} className="ml-4 cursor-pointer" size={30}/>
        <h1 className="flex w-full justify-center font-light text-3xl py-4">{showPlaylist?.playlistTitle}</h1>
      </div>}
      <div className="h-[89%] flex flex-wrap gap-6 py-6 px-5 overflow-y-auto scrollbar-hide">
        {showPlaylist === null ? videoList : <PlaylistDetailed data={videos[showPlaylist.playlistTitle]}/>}
      </div>
    </>
  )
}

const PlaylistDetailed: FC<{ data: VideoContent[] }> = ({ data }) => {
  const navigate = useNavigate()

  const duration = (time: string) => {
    return directSpec.durations.filter((duration) => 
      duration.value === time)[0].time
  }

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-hide">
      <div className="flex flex-col p-6">
        {data.map((video) => (
          <div key={video.videoId} className="flex gap-4 w-full p-4 group bg-white hover:bg-zinc-700 hover:bg-opacity-90 col-span relative rounded-md cursor-pointer group">
            <img className="w-[240px] h-[180px] object-cover shadow-xl rounded-md" src={baseURL+video.videoThumbnail} alt="Thumbnail"/>
            <div className="flex flex-col gap-2 justify-between text-zinc-500 group-hover:text-zinc-400">
              <div>
                <h1 className="text-xl text-black group-hover:text-white font-mono font-semibold">{video.videoTitle}</h1>
                <p>{format(video.videoPublicationDate.toString())}, {duration(video.videoDuration)}, <span className="text-black group-hover:text-[#ffd62c] font-semibold">{video.videoPrice === '0' ? 'Gratuit' : `${video.videoPrice} Ariary`}</span></p>
              </div>
              <p>{video.videoDescription}</p>
              <p className="opacity-0 group-hover:opacity-100">
                <Button type="play" onClick={()  => { navigate(`/watch-video/${video.videoId}`) }}/>
              </p>
            </div>
          </div>      
        ))}
      </div>
    </div>
  )
}

export default ShowPlaylists
