import { createContext, useContext, useState } from "react"
import type { FC, PropsWithChildren } from "react"

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => { console.error("toggleTheme: no context"); },
})

function useTheme() {
  return useContext(ThemeContext)
}

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ theme, setTheme ] = useState("light")
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { useTheme, ThemeProvider }
