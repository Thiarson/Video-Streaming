import { forwardRef  } from "react"
import type { PropsWithChildren  } from "react"

import "../styles/Field.css"

type Props = PropsWithChildren<{
  inputStyle?: string,
  labelStyle?: string,
  type: string,
  name: string,
  defaultValue?: string,
}>

const inputDefaultStyle = "input focus:outline-none focus:ring-0 peer"
const labelDefaultStyle = "label transform -translate-y-3 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"

const Field = forwardRef<HTMLInputElement, Props>(({ inputStyle = inputDefaultStyle, labelStyle = labelDefaultStyle, type, name, defaultValue = "fanantenana", children }, ref) => {
  return (
    <div style={{ position: "relative" }}>
      <input className={inputStyle} type={type} name={name} id={name} placeholder=" " defaultValue={defaultValue} ref={ref}/>
      <label className={labelStyle} htmlFor={name}>{children}</label>
    </div>
  )
})

Field.displayName = "Field"

export default Field
