import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useQuery } from "react-query"
import { VscError } from "react-icons/vsc"
import { BiError } from "react-icons/bi"
import type { FC, RefObject } from "react"

import OneField from "../assets/OneField"
import Popup from "../assets/Popup"
import Invalid from "../assets/Error"
import { useClient } from "../utils/context/client"
import { fetchServer } from "../utils/fetch-server"
import { closeModal } from "../utils/features/modal"
import { useInfo } from "../utils/context/info"
import type { DirectContent, VideoContent } from "@prisma/client"
import type { FetchVoidResponse } from "../utils/types/fetch"

const BuyContent: FC = () => {
  const dispatch = useDispatch()
  const first = useRef<HTMLInputElement>(null)
  const second = useRef<HTMLInputElement>(null)
  const third = useRef<HTMLInputElement>(null)
  const fourth = useRef<HTMLInputElement>(null)
  const fields = [ first, second, third, fourth ]
  const { content, type } = useInfo()
  const [ buyError, setBuyError ] = useState(false)
  const [ codeError, setCodeError ] = useState(false)
  const [ status, setStatus ] = useState<"idle" | "success" | "error">("idle")
  const { user } = useClient()
  const timeout = useRef<NodeJS.Timeout>()
  const info = useRef<VideoContent | DirectContent>()
  const title = useRef("")
  const price = useRef("")
  const id = useRef("")
  const url = useRef("")

  if (content === null)
    throw new Error("Info is null")

  if (!user)
    throw new Error("User is null")

  const queryKey = ["buy"]
  const query = useQuery(queryKey, () => {
    return fetchServer.put(`/api/${url.current}`, { body: { contentId: id.current } })
  }, { cacheTime: 0, enabled: false })

  if (type === "video") {
    info.current = content as VideoContent
    id.current = info.current.videoId
    url.current = "buy-video"
    title.current = info.current.videoTitle.length < 18 ?
      info.current.videoTitle : info.current.videoTitle.substring(0, 18) + "..."
    price.current = info.current.videoPrice
  } else if (type === "direct") {
    info.current = content as DirectContent
    id.current = info.current.directId
    url.current = "assist-direct" 
    title.current = info.current.directTitle.length < 18 ?
      info.current.directTitle : info.current.directTitle.substring(0, 18) + "..."
    price.current = info.current.directPrice
  } else {
    throw new Error ("Type is null")
  }

  const handleClose = () => {
    setCodeError(false)
    setBuyError(false)
    dispatch(closeModal("buy"))
  }

  const fieldsVerif = (...fields: (RefObject<HTMLInputElement> | null)[]) => {
    let userTry = ""

    fields.forEach((field) => {
      if (field === null || !field.current)
        throw new Error("Code must be number")

      userTry += field.current.value
    })

    if (userTry !== "0123") {
      changeStyles(fields)
      return false
    }

    return true
  }

  const changeStyles = (fields: (RefObject<HTMLInputElement> | null)[]) => {
    fields.forEach((field) => {
      if (field === null || !field.current)
        throw new Error("Code must be number")

      field.current.style.borderWidth = "2px"
      field.current.style.borderRadius = "5px"
      field.current.style.borderColor = "red"
    })
  }

  const buy = () => {
    // Code mobile money
    if(!fieldsVerif(first, second, third, fourth)) {
      setCodeError(true)
      return
    }

    setCodeError(false)
    
    if(parseInt(user.userWallet) < parseInt(price.current)) {
      setBuyError(true)
      return
    }

    setBuyError(false)

    query.refetch()
  }

  if (query.isError)
    console.error(query.error);

  if (query.isSuccess) {
    try {
      const response = query.data as FetchVoidResponse

      // responseSchema.parse(response)
      
      if (response.success) {
        status !== "success" && setStatus("success")
        if (timeout.current === undefined) {
          timeout.current = setTimeout(() => {
            dispatch(closeModal("buy"))
            dispatch(closeModal("info"))
            window.location.reload()
          }, 3000);
        }
      } else {
        status!== "error" && setStatus("error")
      }
    } catch (e) {
      console.error(e);
      return <Invalid code="502" action="reload">Réessayer</Invalid>
    }
  }
  
  return (
    <>
      {query.isError && <Popup type="offline"/>}
      {status === "error" && <Popup type="offline">L'achat de la vidéo a échoué</Popup>}
      {status === "success" && <Popup type="success">L'achat a été effectué avec succès</Popup>}
      <div className="z-50 transition text-white duration-300 bg-black bg-opacity-60 overflow-x-hidden overflow-y-auto fixed inset-0">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-[440px] bg-zinc-900 px-12 pt-8 rounded-t-md">
            <h1 className="text-3xl mb-4 font-semibold flex justify-center">Code PIN</h1>
            <hr/>
          </div>
          <div className=" bg-zinc-900 px-12 pt-6 pb-8 rounded-b-md relative overflow-y-scroll scrollbar-hide">
            <div className="flex flex-col gap-4">
              <h1 className=" text-center text-xl">Achat de {title.current} : {price.current} Ar</h1>
              <div className="flex flex-row justify-around w-full">
                {fields.map((field, index) =>
                  <OneField key={index} style={{ backgroundColor: "rgb(24 24 27)", borderColor: "white" }} defaultValue={index.toString()} ref={field}/>)}
              </div>
              {codeError && <div className="flex gap-2 items-center text-red-600 h-1 mt-3">
                <VscError size={20}/>
                <p>Code invalide</p>
              </div>}
              {buyError && <div className="flex gap-2 items-center text-red-600 h-1 mt-3">
                <BiError size={25}/>
                <p>Pas assez d'argent !</p>
              </div>}
              <div className="flex gap-4 w-[344px]">
                <button onClick={buy} className={`bg-red-600 py-3 font-semibold rounded-md w-full mt-5 hover:bg-red-700 ${query.isLoading && "buy-disabled-button"} transition`}>Confirmer</button>
                <button onClick={handleClose} className="bg-white text-black py-3 font-semibold rounded-md w-full mt-5 hover:bg-opacity-80 transition">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BuyContent
