import { useRef, useState } from "react"
import { BsArrowLeft } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import type { FC } from "react"
import type { DirectContent, VideoContent } from "@prisma/client"

import VideoCard from "../Main/VideoCard"
import Button from "../assets/Button"
import { directSpec } from "../utils/helpers/media-spec"
import { format } from "../utils/helpers/format"
import { baseURL } from "../utils/fetch-server"
import type { DynamicObject } from "../utils/types/object"

type Props = {
  videos: DynamicObject<string, (VideoContent | DirectContent)[]>,
}

const ShowVideos: FC<Props> = ({ videos }) => {
  const videoList = []
  const [ categoryList, setCategoryList ] = useState<string | null>(null)

    for (const category in videos) {
      if(videos[category].length !== 0) {
        videoList.push(<VideoList key={category} data={videos[category]} category={category} showMore={setCategoryList}/>)
      }
    }

    return (
      <>
        {categoryList === null ? 
          <h1 className="flex justify-center font-light text-3xl py-4 border-b-2 border-zinc-800">Vidéos</h1> : 
          <div className="flex w-full border-b-2 border-zinc-800 items-center">
            <BsArrowLeft onClick={() => setCategoryList(null)} className="ml-4 cursor-pointer" size={30}/>
            <h1 className="flex w-full justify-center font-light text-3xl py-4">{categoryList}</h1>
          </div>}
        <div className="h-[89%] overflow-x-hidden overflow-y-auto scrollbar-hide">
          <div className="pb-8">
            {categoryList === null ? videoList : <CategoryDetailed category={categoryList} data={videos[categoryList]}/>}
          </div>
        </div>
      </>
    )
}

const VideoList: FC<{ category: string, showMore: Function, data: (VideoContent| DirectContent)[] }> = ({ category, showMore, data }) => {
  const list = useRef<HTMLDivElement>(null)
  const [ count, setCount ] = useState(0)
  const totalWidth = (data.length * 260)

  const slideLeft = () => {
    if(list.current && count > 0) {
      list.current.style.left = `${(-260 * count) + 260}px`
      setCount((current) => current - 1)
    }
  }

  const slideRight = () => {
    if(list.current && (count - 1) * 260 < totalWidth - window.innerWidth) {
      setCount((current) => current + 1)
      list.current.style.left = `-${260 * (count + 1)}px`
    }
  }

  return (
    <div className="mt-4">
      <div>
        <div className="flex">
          <h1 className="text-2xl font-semibold font-mono pl-12 pr-6">{category}</h1>
          <p onClick={() => showMore(category)} className="self-center font-semibold flex cursor-pointer text-zinc-500">
            Tout voir <MdChevronRight className="self-center" size={25}/>
          </p>
        </div>
        <div className="group/chevron flex relative">
          <MdChevronLeft onClick={slideLeft} className="bg-white text-black rounded-full absolute z-20 self-center opacity-50 hover:opacity-100 cursor-pointer hidden group-hover/chevron:block" size={30}/>
          <div ref={list} className="grid grid-flow-col px-12 py-4 gap-4 group/chevron transition-all duration-500 relative left-0">
            {data.map((video, index) =>
              <VideoCard key={index} content={video} category={category} isBuyed={true} profile/>)}
          </div>
          <MdChevronRight onClick={slideRight} className="bg-white text-black rounded-full absolute z-20 right-0 self-center opacity-50 hover:opacity-100 cursor-pointer hidden group-hover/chevron:block" size={30}/>
        </div>
      </div>
    </div>
  )
}

const CategoryDetailed: FC<{ category: string, data: (VideoContent | DirectContent)[] }> = ({ category, data }) => {
  const navigate = useNavigate()

  const getDuration = (time: string) => {
    return directSpec.durations.filter((duration) => 
      duration.value === time)[0].time
  }

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-hide">
      <div className="flex flex-col p-6">
        {data.map((content) => {
          let id = ""
          let thumbnail = ""
          let title = ""
          let duration = ""
          let price = ""
          let description = ""
          let publicationDate = new Date()

          if (category === "Rediffusion") {
            const direct = content as DirectContent
            id = direct.directId
            thumbnail = direct.directThumbnail
            title = direct.directTitle
            duration = direct.directDuration
            price = direct.directPrice
            description = direct.directDescription
            publicationDate = direct.directDate
          } else {
            const video = content as VideoContent
            id = video.videoId
            thumbnail = video.videoThumbnail
            title = video.videoTitle
            duration = video.videoDuration
            price = video.videoPrice
            description = video.videoDescription
            publicationDate = video.videoPublicationDate
          }
          
          return (
            <div key={id} className="flex gap-4 w-full p-4 group bg-white hover:bg-zinc-700 hover:bg-opacity-90 col-span relative rounded-md cursor-pointer group">
              <img className="w-[240px] h-[180px] object-cover shadow-xl rounded-md" src={baseURL+thumbnail} alt="Thumbnail"/>
              <div className="flex flex-col gap-2 justify-between text-zinc-500 group-hover:text-zinc-400">
                <div>
                  <h1 className="text-xl text-black group-hover:text-white font-mono font-semibold">{title}</h1>
                  <p>{format(publicationDate.toString())}, {getDuration(duration)}, <span className="text-black group-hover:text-[#ffd62c] font-semibold">{price === '0' ? 'Gratuit' : `${price} Ariary`}</span></p>
                </div>
                <p>{description}</p>
                <p className="opacity-0 group-hover:opacity-100">
                  <Button type="play" onClick={()  => { navigate(`/watch-video/${id}`) }}/>
                </p>
              </div>
            </div>
        )})}
      </div>
    </div>
  )
}

export default ShowVideos
