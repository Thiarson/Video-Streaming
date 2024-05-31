import { useDispatch } from "react-redux"
import { AiOutlineClose } from "react-icons/ai"
import type { FC } from "react"

import Button from "../assets/Button"
import { closeModal } from "../utils/features/modal"
import { useInfo } from "../utils/context/info"
import { baseURL } from "../utils/fetch-server"
import { directSpec } from "../utils/media-spec"

const Info: FC = () => {
  const dispatch = useDispatch()
  const { video: info, users, isVideoBuyed } = useInfo()

  if (info === null)
    throw new Error("Info is null")

  const user = users[info.userId]
  const isBuyed = isVideoBuyed[info.videoId]
  const duration = directSpec.durations.filter((duration) => 
    duration.value === info.videoDuration)[0]

  const handleClose = () => {
    dispatch(closeModal("info"))
  }

  const handleBuyVideo = () => {

  }

  const watch = () => {

  }

  return (
    <div className="z-50 transition duration-300 bg-zinc-700 bg-opacity-80 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="relative w-auto mx-auto max-w-3xl rounded-md overflow-hidden">
        <div className="transform duration-0 relative flex-auto bg-zinc-900 drop-shadow-md">
          <div>
            <div className="flex px-4 pt-3 pb-2">
              <div className="flex items-center gap-3 cursor-pointer">
                <img className="flex h-10 w-10 ml-2 overflow-hidden rounded-full" src={baseURL+user.userPhoto} alt="Profil"/>
                <p className="text-lg text-white font-semibold">{user.userPseudo}</p>
              </div>
            </div>
            <div className="cursor-pointer absolute top-3 right-3 h-8 w-8 rounded-full bg-white bg-opacity-60 hover:bg-opacity-90 flex items-center justify-center" onClick={handleClose}>
              <AiOutlineClose className="text-black font-bold" size={20}/>
            </div>
          </div>
          <div className="relative h-96">
            <img className="w-full brightness-[60%] object-cover h-full" src={baseURL+info.videoThumbnail} alt="Thumbnail" />
            <div className="absolute w-full flex flex-col gap-4 bottom-[20%] left-10">
              <p className="text-white text-5xl h-full font-bold w-[60%]">
                {info.videoTitle}
              </p>
              <div className="flex gap-2 text-white">
                <p>{info.videoCategory}</p>
                <span>-</span>
                <p>{duration.time}</p>
                <span>-</span>
                {info.videoPlaylist}
                <p className="text-[#ffd62c] font-semibold bg-zinc-800 bg-opacity-60 px-1 rounded-md">{info.videoPrice === '0' ? 'Gratuit' : `${info.videoPrice} Ar`}</p>
              </div>
              <div className="flex gap-4 items-center">
                {isBuyed ? <Button type="play" onClick={watch}/> : <Button type="buy" onClick={handleBuyVideo}/>}
              </div>
            </div>
          </div>
          <div className="px-10 py-6">
            <p className="text-white text-lg">{info.videoDescription}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info
