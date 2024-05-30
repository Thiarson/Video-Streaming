import { BsFillPlayFill } from "react-icons/bs"
import { BiSolidShoppingBag } from "react-icons/bi"
import type { FC, MouseEventHandler, PropsWithChildren } from "react"

type ButtonType = {
  play: string,
  buy: string,
}

type Props = PropsWithChildren<{
  type: keyof ButtonType,
  onClick: MouseEventHandler<HTMLButtonElement>,
}>

const buttons = {
  play: {
    Icon: BsFillPlayFill,
    size: 25,
    text: "Lancer",
    style: "bg-white hover:bg-neutral-300",
  },
  buy: {
    Icon: BiSolidShoppingBag,
    size: 20,
    text: "Acheter",
    style: "bg-[#ffd62c] hover:bg-opacity-80",
  },
}

const Button: FC<Props> = ({ type, onClick }) => {
  const { Icon, size, text, style } = buttons[type]

  return (
    <button className={`${style} text-black rounded-md py-2 px-3 w-auto text-base font-semibold flex items-center transition`} onClick={onClick}>
      <Icon className="mr-1" size={size}/>
      {text}
    </button>
  )
}

export default Button
