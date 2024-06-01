import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { BsFillPlayFill, BsInfoLg } from "react-icons/bs"
import { BiSolidShoppingBag } from "react-icons/bi"
import type { FC } from "react"
import type { VideoContent } from "@prisma/client"

import { baseURL } from "../utils/fetch-server"
import { directSpec } from "../utils/media-spec"
import { openModal } from "../utils/features/modal"
import { useInfo } from "../utils/context/info"

type Props = {
  content: VideoContent,
  isBuyed: boolean,
}

const VideoCard: FC<Props> = ({ content, isBuyed }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { setVideo } = useInfo()
  const thumbnail = content.videoThumbnail
  const title = content.videoTitle
  const category = content.videoCategory
  const price = content.videoPrice
  const description = content.videoDescription
  const duration = directSpec.durations.filter((duration) => 
    duration.value === content.videoDuration)[0]

  const watch = () => {
    navigate(`/watch/${content.videoId}`)
  } 

  const handleOpenInfo = () => {
    setVideo(content)
    dispatch(openModal("info"))
  }

  const handleBuyVideo = () => {
    setVideo(content)
    dispatch(openModal("buy"))
  }
  
  return (
    <div className="w-[240px] group bg-zinc-900 rounded-md col-span relative">
      <img className="cursor-pointer object-cover transition duration shadow-xl rounded-md group-hover:opacity-0 delay-100 w-full h-[165px]" src={baseURL+thumbnail} alt="Thumbnail"/>
      <div className="opacity-0 absolute top-0 transition duration-200 z-10 delay-100 w-full scale-0 group-hover:scale-110 group-hover:-translate-y-[50px] group-hover:opacity-100">
        <img className="cursor-pointer object-cover transition duration shadow-lg rounded-t-md w-full h-[165px]" src={baseURL+thumbnail} alt="Thumbnail" />
        <div className="flex flex-col gap-2 z-10 bg-black pt-2 pb-4 px-3 absolute w-full transition shadow-md rounded-b-md">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-sm text-white font-semibold">{title}</h1>
              <div className="flex gap-2">
                <div className={`cursor-pointer mb-1 w-6 h-6 text-black rounded-full flex justify-center items-center transition hover:bg-opacity-60 ${isBuyed ? 'bg-white' : 'bg-[#ffd62c]'}`}>
                  {isBuyed ? <BsFillPlayFill onClick={watch} size={20}/> : <BiSolidShoppingBag onClick={handleBuyVideo} size={15}/>}
                </div>
                <div className="cursor-pointer bg-zinc-600 w-6 h-6 mb-1 border-zinc-600 border-2 rounded-full flex justify-center items-center transition hover:bg-zinc-400 hover:border-zinc-400" onClick={handleOpenInfo}>
                  <BsInfoLg size={15}/>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 text-xs text-zinc-500 font-semibold">
            <p>{category}</p>
            <p>{duration.time}</p>
            <p className="text-[#ffd62c]">{price === '0' ? 'Gratuit' : `${price} Ar`}</p>
          </div>
          <div className="text-xs text-zinc-500 font-semibold">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
