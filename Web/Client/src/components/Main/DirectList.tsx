import { useRef } from "react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import type { FC } from "react"
import type { DirectContent } from "@prisma/client"

import DirectCard from "./DirectCard"
import { useInfo } from "../utils/context/info"

type Props = {
  directList: DirectContent[],
}

const DirectList: FC<Props> = ({ directList }) => {
  const list = useRef<HTMLDivElement>(null)
  const { isDirectBuyed } = useInfo()

  const slideLeft = () => {
    if (list.current)
      list.current.scrollLeft = list.current.scrollLeft - 220
  }

  const slideRight = () => {
    if (list.current)
      list.current.scrollLeft = list.current.scrollLeft + 220
  }

  return (
    <div className="mt-4">
      <div>
        <p className="text-2xl font-semibold font-mono px-12">Direct</p>
        <div className="relative group/chevron flex">
          <MdChevronLeft onClick={slideLeft} className="bg-black text-white rounded-full absolute z-20 self-center opacity-50 hover:opacity-100 cursor-pointer hidden group-hover/chevron:block" size={30}/>
          <div ref={list} className="grid grid-flow-col px-12 py-4 overflow-x-scroll scrollbar-hide scroll-smooth gap-4 relative group/chevron transition-all">
            {directList.map((direct, index) => {
              const buyed = isDirectBuyed[direct.directId]
              return <DirectCard key={index} direct={direct} isBuyed={buyed}/>
            })}
          </div>
          <MdChevronRight onClick={slideRight} className="bg-black text-white rounded-full absolute z-20 right-0 self-center opacity-50 hover:opacity-100 cursor-pointer hidden group-hover/chevron:block" size={30}/>
        </div>
      </div>
    </div>
  )
}

export default DirectList
