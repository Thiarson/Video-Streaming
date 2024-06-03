import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { BsInfoLg } from "react-icons/bs"
import type { DirectContent } from "@prisma/client"
import type { FC } from "react"

import { openModal } from "../utils/features/modal"
import { baseURL } from "../utils/fetch-server"
import { useInfo } from "../utils/context/info"

type Props = {
  direct: DirectContent,
  isBuyed: boolean,
}

const DirectCard: FC<Props> = ({ direct, isBuyed }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const thumbnail = direct.directThumbnail
  const directId = direct.directId
  const { setContent: setDirect, setType } = useInfo()

  const handleOpenInfoModal = () => {
    setType("direct")
    setDirect(direct)
    dispatch(openModal("info"))
  }

  const handleBuyDirect = () => {
    setType("direct")
    setDirect(direct)
    dispatch(openModal("buy"))
  }

  const watch = () => {
    navigate(`/watch-direct/${directId}`)
  }

  // const style = reverse ? 'w-[400px] h-[200px] group-hover:h-[300px]' : 'w-[200px] h-[300px] group-hover:w-[400px]'
  
  return (
    <div className="group">
      <div className="w-[200px] h-[300px] group-hover:w-[400px] bg-zinc-900 rounded-md col-span transition-all duration-300 delay-100 relative">
        <img className="w-full h-full cursor-pointer object-cover shadow-xl rounded-md group-hover:brightness-[60%] transition-all delay-150" src={baseURL+thumbnail} alt="Thumbnail"/>
        <div className="w-full flex flex-col gap-3 items-start absolute bottom-[20%] left-[10%] opacity-0 group-hover:opacity-100 transition-all delay-300">
          <p className="w-[160px] text-2xl text-white font-mono font-semibold">{direct.directTitle}</p>
          <div className="flex gap-2">
            {!isBuyed ?
            <button className="text-black rounded-md py-1 px-3 w-auto font-semibold flex flex-row items-center hover:bg-opacity-70 transition bg-[#ffd62c]" onClick={handleBuyDirect}>
              Assister
            </button> :
            <button className="text-black rounded-md py-1 px-3 w-auto font-semibold flex flex-row items-center hover:bg-opacity-70 transition bg-white" onClick={watch}>
              Lancer
            </button>}
            <button className="flex justify-center items-center text-white bg-zinc-600 w-8 h-8 rounded-full text-sm font-semibold hover:bg-zinc-400 transition" onClick={handleOpenInfoModal}>
              <BsInfoLg size={20}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectCard
