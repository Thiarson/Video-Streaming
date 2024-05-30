import { useNavigate } from "react-router-dom"
import { GoSignOut } from "react-icons/go"
import type { FC } from "react"

import storage from "../utils/local-storage"
import { useClient } from "../utils/context/client"
import { useMenu } from "../utils/context/menu"

import "../styles/Main/MenuAccount.css"

const Account: FC = () => {
  const navigate = useNavigate()
  const { user, setUser } = useClient()
  const { toggleMenu } = useMenu()

  const logout = () => {
    storage.remove("token")
    setUser(null)
    navigate("/login")
  }

  const profil = () => {
    toggleMenu("none")
    navigate("/profil")
  }

  return (
    <div className="menu-account-first-container">
      <div className="menu-account-box-container">
        <div className="menu-account-first-box group/item" onClick={profil}>
          <img className="menu-account-profil-image" src="" alt="Profil" />
          <p className="menu-account-profil-paragraph group-hover/item:underline">
            {user?.userPseudo}
          </p>
        </div>
        <hr className="menu-account-hr"/>
        <div onClick={logout} className="menu-account-second-box hover:underline">
          <GoSignOut size={25}/>
          Se deconnecter
        </div>
      </div>
    </div>
  )
}

export default Account
