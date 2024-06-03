import type { FC } from "react"

import "../styles/assets/Spinner.css"

type Props = {
  onButton?: true
}

const Spinner: FC<Props> = ({ onButton }) => {
  return <div className={onButton ? "spinner-button" : "spinner"}></div>
}

export default Spinner
