import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { VscError } from "react-icons/vsc"
import { BiError } from "react-icons/bi"
import type { FC, RefObject } from "react"

import OneField from "../assets/OneField"
import { closeModal } from "../utils/features/modal"
import { useInfo } from "../utils/context/info"
import { DirectContent, VideoContent } from "@prisma/client"

const BuyContent: FC = () => {
  const dispatch = useDispatch()
  const first = useRef<HTMLInputElement>(null)
  const second = useRef<HTMLInputElement>(null)
  const third = useRef<HTMLInputElement>(null)
  const fourth = useRef<HTMLInputElement>(null)
  const { content, type, users } = useInfo()
  const [ buyError, setBuyError ] = useState(false)
  const [ codeError, setCodeError ] = useState(false)
  const info = useRef<VideoContent | DirectContent>()
  const title = useRef("")
  const price = useRef("")

  if (content === null)
    throw new Error("Info is null")

  if (type === "video") {
    info.current = content as VideoContent
    title.current = title.current.length < 17 ?
      info.current.videoTitle : title.current.substring(0, 17) + "..."
    price.current = info.current.videoPrice
  } else if (type === "direct") {
    info.current = content as DirectContent
    title.current = title.current.length < 17 ?
      info.current.directTitle : title.current.substring(0, 17) + "..."
    price.current = info.current.directPrice
  } else {
    throw new Error ("Type is null")
  }

  const user = users[content.userId]

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

    if(parseFloat(user.userWallet) < parseFloat(price.current)) {
      setBuyError(true)
      return
    }

    setBuyError(false)
  }
  
  return (
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
              <OneField style={{ backgroundColor: "rgb(24 24 27)", borderColor: "white" }} name="first" ref={first}/>
              <OneField style={{ backgroundColor: "rgb(24 24 27)", borderColor: "white" }} name="second" ref={second}/>
              <OneField style={{ backgroundColor: "rgb(24 24 27)", borderColor: "white" }} name="third" ref={third}/>
              <OneField style={{ backgroundColor: "rgb(24 24 27)", borderColor: "white" }} name="fourth" ref={fourth}/>
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
              <button onClick={buy} className="bg-red-600 py-3 font-semibold rounded-md w-full mt-5 hover:bg-red-700 transition">Confirmer</button>
              <button onClick={handleClose} className="bg-white text-black py-3 font-semibold rounded-md w-full mt-5 hover:bg-opacity-80 transition">Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyContent
