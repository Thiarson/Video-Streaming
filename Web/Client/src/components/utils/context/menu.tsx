import { createContext, Fragment, useContext } from "react"
import type { Dispatch, FC, PropsWithChildren } from "react"
import { HomeMenuType } from "../types/data"

type MenuType = keyof HomeMenuType

type MenuValue = {
  Menu: FC,
  toggleMenu: Dispatch<MenuType>,
}

type Props = PropsWithChildren<{
  value: MenuValue,
}>

const MenuContext = createContext<MenuValue>({
  Menu: Fragment,
  toggleMenu: () => { console.error("toggleMenu: no context"); },
})

function useMenu() {
  return useContext(MenuContext)
}

const MenuProvider: FC<Props> = ({ value, children }) => {
  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  )
}

export { useMenu, MenuProvider }
