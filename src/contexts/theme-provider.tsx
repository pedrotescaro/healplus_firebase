
"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system" | "high-contrast"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  fontSizeStorageKey?: string
  defaultFontSize?: number
  attribute?: string
  enableSystem?: boolean,
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  fontSize: number
  setFontSize: (size: number) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  fontSize: 1,
  setFontSize: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  fontSizeStorageKey = "vite-ui-font-size",
  defaultFontSize = 1,
  attribute = "class",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (typeof window !== 'undefined' ? localStorage.getItem(storageKey) as Theme : undefined) || defaultTheme
  )
  const [fontSize, setFontSize] = React.useState<number>(
    () => (typeof window !== 'undefined' ? parseFloat(localStorage.getItem(fontSizeStorageKey) || String(defaultFontSize)) : defaultFontSize)
  )

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")
    root.removeAttribute("data-theme")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light"

      root.classList.add(systemTheme)
      return
    }

    if (theme === 'high-contrast') {
        root.setAttribute('data-theme', 'high-contrast')
    } else {
        root.classList.add(theme)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    fontSize,
    setFontSize: (size: number) => {
      localStorage.setItem(fontSizeStorageKey, String(size))
      setFontSize(size)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
