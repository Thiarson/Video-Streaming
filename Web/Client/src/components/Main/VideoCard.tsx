import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { BsFillPlayFill, BsInfoLg } from "react-icons/bs"
import { BiSolidShoppingBag } from "react-icons/bi"
import { useRef, type FC } from "react"
import type { DirectContent, VideoContent } from "@prisma/client"

import { baseURL } from "../utils/fetch-server"
import { directSpec } from "../utils/helpers/media-spec"
import { openModal } from "../utils/features/modal"
import { useInfo } from "../utils/context/info"

type Props = {
  content: VideoContent | DirectContent,
  category: string,
  isBuyed: boolean,
  profile?: boolean,
}

const VideoCard: FC<Props> = ({ content, category: type, isBuyed, profile }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { setContent: setVideo, setType } = useInfo()
  const info = useRef<VideoContent | DirectContent>()
  const id = useRef("")
  const thumbnail = useRef("")
  const title = useRef("")
  const category = useRef("")
  const price = useRef("")
  const description = useRef("")
  const duration = useRef("")

  if (type === "Rediffusion") {
    info.current = content as DirectContent
    id.current = info.current.directId
    thumbnail.current = info.current.directThumbnail
    title.current = info.current.directTitle
    category.current = "Rediffusion"
    price.current = info.current.directPrice

    const descri = info.current.directDescription
    description.current = descri.length < 105 ? descri : descri.substring(0, 105) + "..."

    const temp = info.current.directDuration
    duration.current = directSpec.durations.filter((duration) => 
      duration.value === temp)[0].time
  } else {
    info.current = content as VideoContent
    id.current = info.current.videoId
    thumbnail.current = info.current.videoThumbnail
    title.current = info.current.videoTitle
    category.current = info.current.videoCategory
    price.current = info.current.videoPrice

    const descri = info.current.videoDescription
    description.current = descri.length < 105 ? descri : descri.substring(0, 105) + "..."

    const temp = info.current.videoDuration
    duration.current = directSpec.durations.filter((duration) => 
      duration.value === temp)[0].time
  }

  const watch = () => {
    const watch = type === "Rediffusion" ? "watch-direct" : "watch-video"
    navigate(`/${watch}/${id.current}`)
  } 

  const handleOpenInfo = () => {
    type === "Rediffusion" ? setType("direct") : setType("video")
    setVideo(content)
    dispatch(openModal("info"))
  }

  const handleBuyVideo = () => {
    type === "Rediffusion" ? setType("direct") : setType("video")
    setVideo(content)
    dispatch(openModal("buyContent"))
  }
  
  return (
    <div className="w-[240px] group bg-zinc-900 rounded-md col-span relative">
      <img className="cursor-pointer object-cover transition duration shadow-xl rounded-md group-hover:opacity-0 delay-100 w-full h-[165px]" src={baseURL+thumbnail.current} alt="Thumbnail"/>
      <div className="opacity-0 absolute top-0 transition duration-200 z-10 delay-100 w-full scale-0 group-hover:scale-110 group-hover:-translate-y-[50px] group-hover:opacity-100">
        <img className="cursor-pointer object-cover transition duration shadow-lg rounded-t-md w-full h-[165px]" src={baseURL+thumbnail.current} alt="Thumbnail" />
        <div className="flex flex-col gap-2 z-10 bg-black pt-2 pb-4 px-3 absolute w-full transition shadow-md rounded-b-md">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-sm text-white font-semibold">{title.current}</h1>
              <div className="flex gap-2">
                <div className={`cursor-pointer mb-1 w-6 h-6 text-black rounded-full flex justify-center items-center transition hover:bg-opacity-60 ${isBuyed ? 'bg-white' : 'bg-[#ffd62c]'}`}>
                  {isBuyed ? <BsFillPlayFill onClick={watch} size={20}/> : <BiSolidShoppingBag onClick={handleBuyVideo} size={15}/>}
                </div>
                {profile ?? <div className="cursor-pointer bg-zinc-600 text-white w-6 h-6 mb-1 border-zinc-600 border-2 rounded-full flex justify-center items-center transition hover:bg-zinc-400 hover:border-zinc-400" onClick={handleOpenInfo}>
                  <BsInfoLg size={15}/>
                </div>}
              </div>
            </div>
          </div>
          <div className="flex gap-2 text-xs text-zinc-500 font-semibold">
            <p>{category.current}</p>
            <p>{duration.current}</p>
            <p className="text-[#ffd62c]">{price.current === '0' ? 'Gratuit' : `${price.current} Ar`}</p>
          </div>
          <div className="text-xs text-zinc-500 font-semibold">
            <p>{description.current}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
