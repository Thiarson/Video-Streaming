import { ChangeEvent, forwardRef } from "react"

import "../styles/assets/OneField.css"

type Props = {
  name: string,
}

const OneField = forwardRef<HTMLInputElement, Props>(({ name }, ref) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "")
  }

  return (
    <input className="one-field-input focus:border-none"  type="text" name={name} id={name} ref={ref} maxLength={1} onChange={handleChange}/>
  )
})

export default OneField
