import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useQuery, useQueryClient } from "react-query"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { AiOutlineInfoCircle } from "react-icons/ai"
import type { VideoContent } from "@prisma/client"

import Button from "../assets/Button"
import Popup from "../assets/Popup"
import Invalid from "../assets/Error"
import { baseURL, fetchServer } from "../utils/fetch-server"
import { openModal } from "../utils/features/modal"
import { useInfo } from "../utils/context/info"
import type { DynamicObject } from "../utils/types/object"
import type { FetchVideoResponse } from "../utils/types/fetch"

function Carousel() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const info = useRef("")
  const slides = useRef<VideoContent[]>([])
  const videoBuyed = useRef<DynamicObject<string, boolean>>({})
  const [ video, setVideo ] = useState(0)
  const { setContent: setInfo, setType } = useInfo()

  const queryKey = ["carousel"]
  const query = useQuery(queryKey, () => {
    return fetchServer.get("/api/carousel-list")
  }, { cacheTime: 0, enabled: false })

  const prev = () => {
    setVideo((curr) => {
      curr = curr === 0 ? slides.current.length - 1 : curr - 1
      info.current = slides.current[curr].videoTitle

      return curr
    })
  }

  const next = () => {
    setVideo((curr) => {
      curr = curr === slides.current.length - 1 ? 0 : curr + 1
      info.current = slides.current[curr].videoTitle

      return curr
    })
  }

  const handlePlayVideo = () => {
    navigate(`/watch-video/${slides.current[video].videoId}`)
  }

  const handleBuyVideo = () => {
    setType("video")
    setInfo(slides.current[video])
    dispatch(openModal("buy"))
  }

  const handleOpenInfo = () => {
    setType("video")
    setInfo(slides.current[video])
    dispatch(openModal("info"))
  }

  useEffect(() => {
    query.refetch()
  }, [])

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchVideoResponse
      const { success, data } = response
      
      // responseSchema.parse(response)

      if (success && data) {
        const { videos, isVideoBuyed: isBuyed } = data
        if (videos.length === 0)
          throw new Error("Carousel list is empty", { cause: "Empty" })

        slides.current = videos
        videoBuyed.current = isBuyed
        info.current = slides.current[video].videoTitle
        queryClient.resetQueries(queryKey)
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.cause === "Empty")
        return null
      
      return <Invalid code="502" action="reload">Réessayer</Invalid>
    }
  }

  return (
    <>
      {query.isError && <Popup type="offline"/>}
      <div className="flex">
        <div className="flex justify-around">
          <button onClick={prev} className="text-black h-[84%] self-end"><FaChevronLeft/></button>
          <div className="group w-[92%] h-[85%] overflow-hidden self-end relative rounded-xl border-2 border-transparent hover:border-black">
            <div className="flex transition-transform ease-out duration-500" style={{ transform: `translateX(-${video * 100}%)` }}>
              {slides.current.map((slide) => <img key={slide.videoId} src={baseURL.concat(slide.videoThumbnail)} alt={slide.videoDescription}/>)}
            </div>
            <div className="absolute flex flex-col gap-1 w-full h-full top-[35%] left-[5%]">
              <p className="text-white text-5xl w-[60%] font-bold drop-shadow-xl">{info.current}</p>
              <div className="flex items-center mt-3 gap-3 opacity-0 group-hover:opacity-100">
                {slides.current.length !== 0 && videoBuyed.current[slides.current[video].videoId] === true ? <Button type="play" onClick={handlePlayVideo}/> : <Button type="buy" onClick={handleBuyVideo}/>}
                <button className="bg-white text-white bg-opacity-30 rounded-md py-2 px-4 w-auto text-base font-semibold flex flex-row items-center hover:bg-opacity-20 transition" onClick={handleOpenInfo}>
                  <AiOutlineInfoCircle className="mr-1" size={20}/>
                  Plus d'info
                </button>
              </div>
            </div>
          </div>
          <button onClick={next} className="text-black h-[84%] self-end"><FaChevronRight/></button>
        </div>
      </div>
      <div className="py-3 flex items-center justify-center gap-4">
        {slides.current.map((_, i) => (
          <div key={i} className={`transition-all w-2 h-2 bg-black rounded-full ${video === i ? "p-1" : "bg-opacity-30"}`}/>
        ))}
      </div>
    </>
  )
}

export default Carousel
