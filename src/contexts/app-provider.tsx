
"use client"

import * as React from "react"
import { useEffect, useState } from 'react';
import { translations, Translation, defaultLanguage, Language } from "@/lib/i18n";

type Theme = "dark" | "light" | "system" | "high-contrast"

type AppProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  fontSizeStorageKey?: string
  languageStorageKey?: string
  defaultFontSize?: number
  defaultLanguage?: Language
}

type AppProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  fontSize: number
  setFontSize: (size: number) => void
  language: Language
  setLanguage: (language: Language) => void
}

const initialState: AppProviderState = {
  theme: "system",
  setTheme: () => null,
  fontSize: 1,
  setFontSize: () => null,
  language: defaultLanguage,
  setLanguage: () => null,
}

const AppProviderContext = React.createContext<AppProviderState>(initialState)

export function AppProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  fontSizeStorageKey = "vite-ui-font-size",
  languageStorageKey = "vite-ui-language",
  defaultFontSize = 1,
  defaultLanguage = "pt-br",
  ...props
}: AppProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [fontSize, setFontSize] = useState<number>(defaultFontSize)
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      const storedTheme = localStorage.getItem(storageKey) as Theme || defaultTheme;
      const storedFontSize = parseFloat(localStorage.getItem(fontSizeStorageKey) || String(defaultFontSize));
      const storedLanguage = localStorage.getItem(languageStorageKey) as Language || defaultLanguage;

      setTheme(storedTheme);
      setFontSize(storedFontSize);
      setLanguage(storedLanguage);
    }
  }, [isMounted, storageKey, fontSizeStorageKey, languageStorageKey, defaultTheme, defaultFontSize, defaultLanguage]);
  
  useEffect(() => {
    if (isMounted) {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.removeAttribute("data-theme");

      let effectiveTheme = theme;
      if (theme === "system") {
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
      root.lang = language;

      localStorage.setItem(storageKey, theme)
      localStorage.setItem(fontSizeStorageKey, String(fontSize))
      localStorage.setItem(languageStorageKey, language)
    }
  }, [theme, fontSize, language, storageKey, fontSizeStorageKey, languageStorageKey, isMounted]);

  const value = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    language,
    setLanguage
  }

  if (!isMounted) {
    return null;
  }

  return (
    <AppProviderContext.Provider {...props} value={value}>
      {children}
    </AppProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(AppProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a AppProvider")

  return context
}


// Translation Hook
const TranslationContext = React.createContext<Translation>(translations[defaultLanguage]);

export const useTranslation = () => {
    const { language } = useTheme();
    return { t: translations[language] || translations[defaultLanguage] };
}
