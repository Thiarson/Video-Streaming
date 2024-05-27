import { BiError } from "react-icons/bi"
import type { CSSProperties, FC, PropsWithChildren } from "react"

import "../styles/assets/DbError.css"

type Props = PropsWithChildren<{
  style?: CSSProperties,
}>

const DbError: FC<Props> = ({ style, children }) => {
  return (
    <div style={style} className="db-error">
      <BiError size={25}/>
      <p>{children}</p>
    </div>
  )
}

export default DbError
