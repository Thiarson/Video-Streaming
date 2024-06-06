import { useNavigate } from "react-router-dom"
import { FiSettings } from "react-icons/fi"
import { GoSignOut } from "react-icons/go"
import { FaVideo } from "react-icons/fa"
import { BiSolidVideos } from "react-icons/bi"
import { RiPlayList2Line, RiPlayListAddFill, RiVideoAddFill } from "react-icons/ri"
import type { FC } from "react"
import type { IconType } from "react-icons"

import ProfileItem from "./ProfileItem"
import storage from "../utils/helpers/local-storage"
import { useClient } from "../utils/context/client"
import { useProfile } from "../utils/context/profil"

type ProfileType = {
  name: string,
  value: string,
  selected: string,
  select: Function,
  Icon: IconType,
}

const ProfileMenu: FC = () => {
  const navigate = useNavigate()
  const { setUser } = useClient()
  const { selected, select } = useProfile()

  const topProfileMenu: ProfileType[] = [
    { name: "playlist", Icon: RiPlayList2Line, value: "Playlists", selected: selected, select: select },
    { name: "video", Icon: BiSolidVideos, value: "Vidéos", selected: selected, select: select },
    { name: "direct", Icon: FaVideo, value: "Direct", selected: selected, select: select },
    { name: "buyed", Icon: RiPlayListAddFill, value: "Vidéos acquises", selected: selected, select: select},
    { name: "assisted", Icon: RiVideoAddFill, value: "Direct acquises", selected: selected, select: select },
  ]
  
  const bottomProfileMenu: ProfileType[] = [
    { name: "setting", Icon: FiSettings, value: "Paramètres", selected: selected, select: select },
  ]  

  const logout = () => {
    storage.remove("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <>
      <div className="flex flex-col border-b-2 border-zinc-800 text-zinc-300 font-semibold py-2">
        {topProfileMenu.map(({ name, value, selected, select, Icon}) =>
          <ProfileItem key={name} name={name} selected={selected} select={select}>
            <Icon size={20}/>
            {value}
          </ProfileItem>)}
      </div>
      <div className="flex flex-col py-2 text-zinc-300 font-semibold">
        {bottomProfileMenu.map(({ name, value, selected, select, Icon}) =>
          <ProfileItem key={name} name={name} selected={selected} select={select}>
            <Icon size={20}/>
            {value}
          </ProfileItem>)}
        <div onClick={logout} className="flex text-black items-center gap-6 pl-8 py-2 mt-1 mb-2 cursor-pointer hover:text-white hover:bg-black hover:bg-opacity-80">
          <GoSignOut size={20}/>
          Déconnexion
        </div>
      </div>
    </>
  )
}

export default ProfileMenu
