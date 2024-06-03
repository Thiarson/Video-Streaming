import { useRef, useState } from "react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import type { FC } from "react"
import type { VideoContent } from '@prisma/client'

import VideoCard from "./VideoCard"
import { useInfo } from "../utils/context/info"

type Props = {
  videoList: VideoContent[],
  category: string,
}

const VideoList: FC<Props> = ({ videoList, category }) => {
  const list = useRef<HTMLDivElement>(null)
  const { isVideoBuyed } = useInfo()
  const [ count, setCount ] = useState(0)
  const totalWidth = videoList.length * 260

  const slideLeft = () => {
    if(count > 0 && list.current) {
      list.current.style.left = `${(-260 * count) + 260}px`
      setCount((current) => current - 1)
    }
  }

  const slideRight = () => {
    if(count * 260 < totalWidth - window.innerWidth && list.current) {
      setCount((current) => current + 1)
      list.current.style.left = `-${260 * (count + 1)}px`
    }
  }

  return (
    <div className="mt-4">
      <div>
        <div className="flex">
          <h1 className=" text-2xl font-semibold font-mono pl-12 pr-6">{category}</h1>
          {/* {!more ? null : <p onClick={() => showMore(category)} className="self-center font-semibold flex cursor-pointer text-zinc-900">Tout voir <MdChevronRight className="self-center" size={25}/></p>} */}
        </div>
        <div className="group/chevron flex relative">
          <MdChevronLeft onClick={slideLeft} className="bg-black text-white rounded-full absolute z-20 self-center opacity-50 hover:opacity-100 cursor-pointer hidden group-hover/chevron:block" size={30}/>
          <div ref={list} className="grid grid-flow-col px-12 py-4 gap-4 group/chevron transition-all duration-500 relative left-0">
            {videoList.map((video, index) => {
              const buyed = isVideoBuyed[video.videoId]
              return <VideoCard key={index} content={video} category={category} isBuyed={buyed}/>
            })}
          </div>
          <MdChevronRight onClick={slideRight} className="bg-black text-white rounded-full absolute z-20 right-0 self-center opacity-50 hover:opacity-100 cursor-pointer hidden group-hover/chevron:block" size={30}/>
        </div>
      </div>
    </div>
  )
}

export default VideoList
