import { useEffect } from "react"
import { BiSolidCategoryAlt } from "react-icons/bi"
import { IoIosSearch } from "react-icons/io"
import { RiVideoAddLine } from "react-icons/ri"
import { FiBell } from "react-icons/fi"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import type { FC } from "react"

import SortContent from "./MenuSortContent"

import "../styles/Main/Navbar.css"
import { useMenu } from "../utils/context/menu"

const Navbar: FC = () => {
  const { Menu, toggleMenu } = useMenu()

  const toggleSortContent = () => toggleMenu("sortContent")
  const toggleAccountMenu = () => toggleMenu("account")
  const toggleCreateContent = () => toggleMenu("createContent")

  const handleSearch = () => {

  }

  useEffect(() => {
    const handleScroll = () => {
      const TOP_OFFSET = 66
      const navbar = document.getElementsByClassName("navbar-box-container")[0] as HTMLElement

      if(window.scrollY >= TOP_OFFSET)
        navbar.style.backgroundColor = "000000cc"
      else
        navbar.style.backgroundColor = "#000000e6"
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const Chevron = Menu === SortContent ? FaChevronUp : FaChevronDown

  return (
    <nav className="navbar-container">
      <div className="navbar-box-container transition duration-500">
        <div className="navbar-first-box">
          <div className="navbar-logo">LOGO</div>
          <div className="navbar-filter hover:text-gray-300 hover:underline transition" onClick={toggleSortContent}>
            <BiSolidCategoryAlt className="filter-icon" size={20}/>Filtrer<Chevron className="filter-icon" size={15}/>
          </div>
        </div>
        <div className="navbar-second-box border-white border-opacity-40">
          <div className="navbar-search-div">
            <IoIosSearch style={{ cursor: "pointer" }} size={25} onClick={handleSearch}/>
          </div>
          <input className="navbar-search-input" type="text" placeholder="Recherche" ref={undefined} onChange={undefined}/>
        </div>
        <div className="navbar-third-container">
          <div className="navbar-create-box hover:bg-[#303030]" onClick={toggleCreateContent}>
            <RiVideoAddLine size={22}/>
          </div>
          <div className="navbar-notification-box hover:bg-[#303030]" onClick={undefined}>
            <FiBell size={22}/>
          </div>
          <div className="navbar-profil-box" onClick={toggleAccountMenu}>
            <img className="navbar-profil-image" src="" alt="Profil"/>
          </div>
          <Menu/>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
