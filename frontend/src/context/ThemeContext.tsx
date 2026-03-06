import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import type { ThemeContextValue } from "../types"

export const ThemeContext = createContext<ThemeContextValue>({
  dark:       true,
  toggleDark: () => {},
})

export const useTheme = (): ThemeContextValue => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(true)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}
