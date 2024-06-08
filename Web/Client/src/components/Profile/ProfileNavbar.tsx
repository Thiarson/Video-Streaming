import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { AiFillHome } from "react-icons/ai"
import { IoIosSearch } from "react-icons/io"
import { BiUpload } from "react-icons/bi"
import { CiStreamOn } from "react-icons/ci"
import { CgPlayListAdd } from "react-icons/cg"
import { MdAttachMoney } from "react-icons/md"
import { FiBell } from "react-icons/fi"
import type { FC } from "react"

import { openModal } from "../utils/features/modal"
import { RiVideoAddLine } from "react-icons/ri"
import { baseURL } from "../utils/fetch-server"
import { useClient } from "../utils/context/client"

const ProfileNavbar: FC<{ other?: boolean }> = ({ other }) => {
  const dispatch = useDispatch()
  const { user } = useClient()

  const uploadVideo = () => {
    dispatch(openModal("uploadVideo"))
  }

  const programDirect = () => {
    dispatch(openModal("programDirect"))
  }

  const createPlaylist = () => {
    dispatch(openModal("createPlaylist"))
  }

  const addMoney = () => {
    dispatch(openModal("addMoney"))
  }

  const toggleCreateContent = () => {

  }

  const toggleAccountMenu = () => {
    
  }

  return (
    <nav className="w-full">
      <div className='px-16 py-3 flex justify-between transition duration-500 bg-black bg-opacity-90 shadow-sm'>
        <div className="flex">
          <div className="flex gap-10">              
            <div className="flex self-center text-red-600 text-3xl font-bold font-mono">LOGO</div>
            <Link className="flex gap-2 text-white text-lg font-semibold cursor-pointer hover:text-gray-300 hover:underline underline-offset-8 transition self-center" to="/home">
              <AiFillHome className="self-center" size={20}/>
              Accueil
            </Link>
          </div>
        </div>
        <div className="w-[30%] flex bg-[#303030] border border-opacity-40 border-white rounded-3xl">
          <div className="text-white self-center pl-3">
            <IoIosSearch className="cursor-pointer" size={25}/>
          </div>
          <input className="bg-[#303030] rounded-3xl outline-none text-white px-5 " type="text" placeholder="Recherche"/>
        </div>
        {other ?
        <div className="navbar-third-container">
          <div className="navbar-create-box hover:bg-[#303030]" onClick={toggleCreateContent}>
            <RiVideoAddLine size={22}/>
          </div>
          <div className="navbar-notification-box hover:bg-[#303030]" onClick={undefined}>
            <FiBell size={22}/>
          </div>
          <div className="navbar-profil-box" onClick={toggleAccountMenu}>
            <img className="navbar-profil-image" src={baseURL+user?.userPhoto} alt="Profil"/>
          </div>
          {/* <Menu/> */}
        </div> :
        <div className="flex gap-2">
          <div onClick={uploadVideo} className="flex justify-center items-center h-10 w-10 rounded-full hover:bg-[#303030] text-white cursor-pointer">
            <BiUpload size={25}/>
          </div>
          <div onClick={programDirect} className="flex justify-center items-center h-10 w-10 rounded-full hover:bg-[#303030] text-white cursor-pointer">
            <CiStreamOn size={25}/>
          </div>
          <div onClick={createPlaylist} className="flex justify-center items-center h-10 w-10 rounded-full hover:bg-[#303030] text-white cursor-pointer">
            <CgPlayListAdd size={25}/>
          </div>
          <div onClick={addMoney} className="flex justify-center items-center h-10 w-10 rounded-full hover:bg-[#303030] text-white cursor-pointer">
            <MdAttachMoney size={22}/>
          </div>
          <div className="flex justify-center items-center h-10 w-10 rounded-full hover:bg-[#303030] text-white cursor-pointer">
            <FiBell size={22}/>
          </div>
        </div>}
      </div>
    </nav>
  )
}

export default ProfileNavbar
