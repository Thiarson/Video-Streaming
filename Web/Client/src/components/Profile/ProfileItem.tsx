import { FC, PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  name: string,
  selected: string,
  select: Function,
}>

const ProfileItem: FC<Props> = ({ name, select, selected, children }) => {
  // const selectedStyle = !other ? "text-red-600 bg-black bg-opacity-40 border-r-4 border-red-600" : "text-red-600 bg-black bg-opacity-40 border-l-4 border-red-600"
  const selectedStyle = "text-white bg-black bg-opacity-80 border-r-4 border-red-600" 

  const handleSelect = () => {
    select(name)
  }

  return (
    <div className={`flex items-center gap-6 text-black pl-8 py-2 my-1 cursor-pointer hover:text-white hover:bg-black hover:bg-opacity-80 ${name === selected && selectedStyle}`} onClick={handleSelect}>
      {children}
    </div>
  )
}

export default ProfileItem
