import Hls from "hls.js"
import { useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { BsArrowLeft } from "react-icons/bs"
import { useQuery, useQueryClient } from "react-query"
import type { FC } from "react"
import type { VideoContent } from "@prisma/client"

import Invalid from "../assets/Error"
import { baseURL, fetchServer } from "../utils/fetch-server"

const VideoPlayer: FC= () => {
  const queryClient = useQueryClient()
  const hls = useRef<Hls>()
  const player = useRef<HTMLVideoElement>(null)
  const video = useRef<VideoContent>()
  const { videoId } = useParams()

  const queryKey = ["get-video"]
  const query = useQuery(queryKey, () => {
    return fetchServer.get(`/api/get-video/${videoId}`)
  }, { cacheTime: 0, enabled: false })

  const handleClose = () => {
    hls.current?.stopLoad()
    hls.current?.detachMedia()
    hls.current?.destroy()
  }

  useEffect(() => {
    query.refetch()
  }, [])

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as { success: boolean, data: { video: VideoContent, isFree: boolean, isBuyed: boolean, isOwned: boolean }}
      const { success, data } = response

      // responseSchema.parse(response)
      
      if (success) {
        const { isFree, isBuyed, isOwned } = data
        video.current = data.video

        if(isFree || isBuyed || isOwned) {
          if (player.current === null)
            throw new Error("Media player is null")
        
          if(Hls.isSupported()) {
            hls.current = new Hls({ lowLatencyMode: true })
            hls.current.attachMedia(player.current)
            hls.current.loadSource(baseURL+video.current.videoUrl)
          }  
        }

        queryClient.resetQueries(queryKey)
      } else {
        // databaseError === false && setDatabaseError(true)
      }
    } catch (e) {
      console.error(e);
      return <Invalid code="502" action="reload">Réessayer</Invalid>
    }    
  }
  
  return (
    <div className="h-screen w-screen bg-black">
      <nav className="fixed w-full p-4 z-10 flex gap-8">
        <Link to="/home" onClick={handleClose}><BsArrowLeft className="text-white" size={40}/></Link>
        <div className="w-full flex justify-center"><p className="text-white text-xl md:text-3xl font-semibold">{video.current?.videoTitle}</p></div>
      </nav>
      <video autoPlay controls className="h-full w-full" ref={player}></video>
    </div>
  )
}

export default VideoPlayer
