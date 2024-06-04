import { forwardRef } from "react"
import type { ChangeEvent, CSSProperties } from "react"

import "../styles/assets/OneField.css"

type Props = {
  style?: CSSProperties,
  defaultValue?: string,
}

const OneField = forwardRef<HTMLInputElement, Props>(({ style, defaultValue }, ref) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "")
  }

  return (
    <input style={style} className="one-field-input focus:border-none" type="text" defaultValue={defaultValue} maxLength={1} ref={ref}  onChange={handleChange}/>
  )
})

export default OneField
