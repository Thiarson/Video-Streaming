import { useDispatch } from "react-redux"
import { BiUpload } from "react-icons/bi"
import { CiStreamOn } from "react-icons/ci"
import type { FC } from "react"

import { openModal } from "../utils/features/modal"
import { useMenu } from "../utils/context/menu"

import "../styles/Main/MenuCreateContent.css"

const CreateContent: FC = () => {
  const dispatch = useDispatch()
  const { toggleMenu } = useMenu()

  const handleUploadVideo = () => {
    dispatch(openModal("uploadVideo"))
    toggleMenu("none")
  }

  return (
    <div className="menu-create-first-container">
      <div className="menu-create-box-container">
        <div className="menu-create-box hover:underline" onClick={handleUploadVideo}>
          <BiUpload size={25}/>
          Ajouter une vidéo
        </div>
        <div className="menu-create-box hover:underline" onClick={undefined}>
          <CiStreamOn size={25} />
          Programmer un direct
        </div>
      </div>
    </div>
  )
}

export default CreateContent
