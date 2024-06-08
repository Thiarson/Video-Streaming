import { DirectContent } from "@prisma/client"
import type { FC } from "react"

import { baseURL } from "../utils/fetch-server"
import { format } from "../utils/helpers/format"
import { directSpec } from "../utils/helpers/media-spec"

type Props = {
  direct: DirectContent[]
}

const ShowDirect: FC<Props> = ({ direct }) => {
  const directList = []

  directList.push(
    direct.map((direct) => {
      const temp = directSpec.durations.filter((duration) => duration.value === direct.directDuration)[0].time.split(" ")
      const duration = temp.join("")
      
      return (
        <div key={direct.directId} className="flex gap-4 w-full p-4 group bg-white hover:bg-zinc-700 hover:bg-opacity-90 col-span relative rounded-md cursor-pointer group">
          <img className="w-[240px] h-[180px] object-cover shadow-xl rounded-md" src={baseURL+direct.directThumbnail} alt="Thumbnail"/>
          <div className="flex flex-col gap-2 justify-between text-zinc-500 group-hover:text-zinc-400">
            <div>
              <h1 className="text-xl text-black group-hover:text-white font-mono font-semibold">{direct.directTitle}</h1>
              <p>{format(direct.directDate.toString())}, {duration}, <span className="text-black group-hover:text-[#ffd62c] font-semibold">{direct.directPrice === '0' ? 'Gratuit' : `${direct.directPrice} Ariary`}</span></p>
            </div>
            <p>{direct.directDescription}</p>
            <p>Clé de diffusion : <span className="font-semibold text-black group-hover:text-green-500">{direct.directKey}</span></p>
          </div>
        </div>
      )
    })
  )

  return (
    <>
      <h1 className="flex justify-center font-light text-3xl py-4 border-b-2 border-zinc-800">Direct</h1>
      <div className="h-[89%] overflow-y-auto scrollbar-hide">
        <div className="flex flex-col p-6">
          {directList}
        </div>
      </div>
    </>
  )
}

export default ShowDirect
