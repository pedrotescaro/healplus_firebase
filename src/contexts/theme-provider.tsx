
"use client"

import * as React from "react"
import { useLayoutEffect } from 'react';

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
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => {
      if (typeof window === 'undefined') {
        return defaultTheme;
      }
      try {
        return (localStorage.getItem(storageKey) as Theme) || defaultTheme
      } catch (e) {
        return defaultTheme
      }
    }
  )
  const [fontSize, setFontSize] = React.useState<number>(
    () => {
      if (typeof window === 'undefined') {
        return defaultFontSize;
      }
      try {
        return parseFloat(localStorage.getItem(fontSizeStorageKey) || String(defaultFontSize))
      } catch (e) {
        return defaultFontSize
      }
    }
  )

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.removeAttribute("data-theme");

    let effectiveTheme = theme;
    if (theme === "system" && enableSystem) {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    if (effectiveTheme === 'high-contrast') {
        root.setAttribute('data-theme', 'high-contrast');
    } else {
        root.classList.add(effectiveTheme);
    }
    
    root.style.setProperty('--font-scale', String(fontSize));

  }, [theme, fontSize, enableSystem]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        localStorage.setItem(storageKey, theme)
      } catch (e) {}
      setTheme(theme)
    },
    fontSize,
    setFontSize: (size: number) => {
      try {
        localStorage.setItem(fontSizeStorageKey, String(size))
      } catch (e) {}
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
