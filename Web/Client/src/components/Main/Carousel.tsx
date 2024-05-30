import { useEffect, useRef, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { AiOutlineInfoCircle } from "react-icons/ai"

import Button from "../assets/Button"
import Popup from "../assets/Popup"
import Error from "../assets/Error"
import { baseURL, fetchServer } from "../utils/fetch-server"
import { useClient } from "../utils/context/client"
import { Video } from "../utils/types/data"
import type { DynamicObject } from "../utils/types/object"
import type { FetchVideoResponse } from "../utils/types/fetch"

function Carousel() {
  const queryClient = useQueryClient()
  const slides = useRef<Video[]>([])
  const videoBuyed = useRef<DynamicObject<string, boolean>>({})
  const info = useRef("")
  const { user } = useClient()
  const [ current, setCurrent ] = useState(0)

  const queryKey = ["carousel"]
  const query = useQuery(queryKey, () => {
    return fetchServer.post("/api/carousel-list", { body: { userId: user?.userId }  })
  }, { cacheTime: 0, enabled: false })

  const prev = () => {
    setCurrent((curr) => (curr === 0 ? slides.current.length - 1 : curr - 1))
  }

  const next = () => {
    setCurrent((curr) => (curr === slides.current.length - 1 ? 0 : curr + 1))
  }

  const handlePlayVideo = () => {

  }

  const handleBuyVideo = () => {

  }

  useEffect(() => {
    query.refetch()
  }, [])
  
  useEffect(() => {
    if(slides.current.length !== 0)
      info.current = slides.current[current].videoTitle
  }, [current])

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchVideoResponse
      const { success, data } = response
      
      // responseSchema.parse(response)

      if (success && data) {
        const { videos, videoBuyed: buyed } = data
        slides.current = videos
        videoBuyed.current = buyed
        info.current = slides.current[current].videoTitle
        queryClient.resetQueries(queryKey)
      }
    } catch (e) {
      console.error(e);
      return <Error code="502" action="reload">Réessayer</Error>
    }    
  }

  return (
    <>
      {query.isError && <Popup type="offline"/>}
      <div className="flex">
        <div className="flex justify-around">
          <button onClick={prev} className="text-black h-[84%] self-end"><FaChevronLeft/></button>
          <div className="group w-[92%] h-[85%] overflow-hidden self-end relative rounded-xl border-2 border-transparent hover:border-white">
            <div className="flex transition-transform ease-out duration-500" style={{ transform: `translateX(-${current * 100}%)` }}>
              {slides.current.map((slide) => <img key={slide.videoId} src={baseURL.concat(slide.videoThumbnail)} alt={slide.videoDescription}/>)}
            </div>
            <div className="absolute flex flex-col gap-1 w-full h-full top-[35%] left-[5%]">
              <p className="text-white text-5xl w-[60%] font-bold drop-shadow-xl">{info.current}</p>
              <div className="flex items-center mt-3 gap-3 opacity-0 group-hover:opacity-100">
                {slides.current.length !== 0 && videoBuyed.current[slides.current[current].videoId] === true ? <Button type="play" onClick={handlePlayVideo}/> : <Button type="buy" onClick={handleBuyVideo}/>}
                <button className="bg-white text-white bg-opacity-30 rounded-md py-2 px-4 w-auto text-base font-semibold flex flex-row items-center hover:bg-opacity-20 transition">
                  <AiOutlineInfoCircle className="mr-1" size={20}/>
                  Plus d'info
                </button>
              </div>
            </div>
          </div>
          <button onClick={next} className="text-white h-[84%] self-end"><FaChevronRight/></button>
        </div>
      </div>
      <div className="py-3 flex items-center justify-center gap-4">
        {slides.current.map((_, i) => (
          <div key={i} className={`transition-all w-2 h-2 bg-black rounded-full ${current === i ? "p-1" : "bg-opacity-30"}`}/>
        ))}
      </div>
    </>
  )
}

export default Carousel
