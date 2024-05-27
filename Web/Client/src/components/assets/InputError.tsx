import { VscError } from "react-icons/vsc"
import type { FC, PropsWithChildren } from "react"

import "../styles/assets/InputError.css"

const InputError: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="input-error">
      <VscError size={20}/>
      <p>{children}</p>
    </div>
  )
}

export default InputError
