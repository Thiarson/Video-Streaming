import type { FC, PropsWithChildren } from "react"

import "../styles/Main/MenuSortContent.css"

const SortContent: FC = () => {
  return (
    <div className="menu-sort-first-container">
      <div className="menu-sort-box-container">
        <div className="menu-sort-box">
          <Items>Tout</Items>
          <Items>Vente</Items>
          <Items>Acquise</Items>
          <Items>Gratuit</Items>
        </div>
        <div className="menu-sort-box">
          <Items>Direct</Items>
          <Items>Rediffusion</Items>
          <Items>Musique</Items>
          <Items>Education</Items>
        </div>
      </div>
    </div>
  )
}

const Items: FC<PropsWithChildren> = ({ children }) => {
  return (
    <button className="hover:underline" onClick={undefined}>{children}</button>
  )
}

export default SortContent
