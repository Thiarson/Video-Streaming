import { useRef } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AiOutlineClose } from "react-icons/ai"
import type { FC } from "react"
import type { DirectContent, VideoContent } from "@prisma/client"

import Button from "../assets/Button"
import { closeModal, openModal } from "../utils/features/modal"
import { useInfo } from "../utils/context/info"
import { baseURL } from "../utils/fetch-server"
import { directSpec } from "../utils/helpers/media-spec"
import { format } from "../utils/helpers/format"

const Info: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { content, type, users, isVideoBuyed, isDirectBuyed } = useInfo()
  const info = useRef<VideoContent | DirectContent>()
  const id = useRef("")
  const isBuyed = useRef(false)
  const thumbnail = useRef("")
  const title = useRef("")
  const categoryOrDate = useRef("")
  const duration = useRef("")
  const playlist = useRef<string | null>(null)
  const price = useRef("")
  const description = useRef("")

  if (content === null)
    throw new Error("Info is null")

  if (type === "video") {
    info.current = content as VideoContent
    id.current = info.current.videoId
    thumbnail.current = info.current.videoThumbnail
    title.current = info.current.videoTitle
    categoryOrDate.current = info.current.videoCategory
    isBuyed.current = isVideoBuyed[info.current.videoId]
    playlist.current = info.current.videoPlaylist
    price.current = info.current.videoPrice
    description.current = info.current.videoDescription

    const temp = info.current.videoDuration
    duration.current = directSpec.durations.filter((duration) =>
      duration.value === temp)[0].time
  } else if (type === "direct") {
    info.current = content as DirectContent
    id.current = info.current.directId
    thumbnail.current = info.current.directThumbnail
    title.current = info.current.directTitle
    categoryOrDate.current = format(info.current.directDate.toString())
    isBuyed.current = isDirectBuyed[info.current.directId]
    price.current = info.current.directPrice
    description.current = info.current.directDescription

    const temp = info.current.directDuration
    duration.current = directSpec.durations.filter((duration) =>
      duration.value === temp)[0].time
  } else {
    throw new Error("Type is null")
  }

  const user = users[content.userId]

  const handleClose = () => {
    dispatch(closeModal("info"))
  }

  const handleBuyVideo = () => {
    dispatch(openModal("buyContent"))
  }

  const watch = () => {
    const watch = type === "video" ? "watch-video" : "watch-direct"
    dispatch(closeModal("info"))
    navigate(`/${watch}/${id.current}`)
  }

  const otherProfil = () => {
    dispatch(closeModal("info"))
    navigate(`/profile/${user.userId}`)
  }

  return (
    <div className="z-50 transition duration-300 bg-black bg-opacity-60 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="relative w-auto mx-auto max-w-3xl rounded-md overflow-hidden">
        <div className="transform duration-0 relative flex-auto bg-zinc-900 drop-shadow-md">
          <div>
            <div className="flex px-4 pt-3 pb-2">
              <div className="flex items-center gap-3 cursor-pointer" onClick={otherProfil}>
                <img className="flex h-10 w-10 ml-2 overflow-hidden rounded-full" src={baseURL+user.userPhoto} alt="Profil"/>
                <p className="text-lg text-white font-semibold">{user.userPseudo}</p>
              </div>
            </div>
            <div className="cursor-pointer absolute top-3 right-3 h-8 w-8 rounded-full bg-white bg-opacity-60 hover:bg-opacity-90 flex items-center justify-center" onClick={handleClose}>
              <AiOutlineClose className="text-black font-bold" size={20}/>
            </div>
          </div>
          <div className="relative h-96">
            <img className="w-full brightness-[60%] object-cover h-full" src={baseURL+thumbnail.current} alt="Thumbnail" />
            <div className="absolute w-full flex flex-col gap-4 bottom-[20%] left-10">
              <p className="text-white text-5xl h-full font-bold w-[60%]">
                {title.current}
              </p>
              <div className="flex gap-2 text-white">
                <p>{categoryOrDate.current}</p>
                <span>-</span>
                <p>{duration.current}</p>
                <span>-</span>
                {playlist.current}
                <p className="text-[#ffd62c] font-semibold bg-zinc-800 bg-opacity-60 px-1 rounded-md">{price.current === '0' ? 'Gratuit' : `${price.current} Ar`}</p>
              </div>
              <div className="flex gap-4 items-center">
                {isBuyed.current ? <Button type="play" onClick={watch}/> : <Button type="buy" onClick={handleBuyVideo}/>}
              </div>
            </div>
          </div>
          <div className="px-10 py-6">
            <p className="text-white text-lg">{description.current}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info
