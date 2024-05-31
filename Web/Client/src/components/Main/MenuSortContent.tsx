import type { FC, PropsWithChildren } from "react"

import "../styles/Main/MenuSortContent.css"

const SortContent: FC = () => {
  const firstBox = [ "Tout", "Vente", "Acquise", "Gratuit" ]
  const secondBox = [ "Video", "Direct", "Rediffusion", "Autres" ]

  return (
    <div className="menu-sort-first-container">
      <div className="menu-sort-box-container">
        <div className="menu-sort-box">
          {firstBox.map((item) => <Item>{item}</Item>)}
        </div>
        <div className="menu-sort-box">
          {secondBox.map((item) => <Item>{item}</Item>)}
        </div>
      </div>
    </div>
  )
}

const Item: FC<PropsWithChildren> = ({ children }) => {
  return (
    <button className="hover:underline" onClick={undefined}>{children}</button>
  )
}

export default SortContent
