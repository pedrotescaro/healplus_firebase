
"use client"

import * as React from "react"
import { useEffect, useState, createContext, useContext } from 'react';
import { translations, Translation, defaultLanguage, Language } from "@/lib/i18n";

type Theme = "dark" | "light" | "system" | "high-contrast"

type AppProviderProps = {
  children: React.ReactNode
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

const AppProviderContext = createContext<AppProviderState>(initialState)

const storageKey = "vite-ui-theme";
const fontSizeStorageKey = "vite-ui-font-size";
const languageStorageKey = "vite-ui-language";

export function AppProvider({ children }: AppProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialState.theme);
  const [fontSize, setFontSizeState] = useState<number>(initialState.fontSize);
  const [language, setLanguageState] = useState<Language>(initialState.language);

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme || initialState.theme;
    const storedFontSize = parseFloat(localStorage.getItem(fontSizeStorageKey) || String(initialState.fontSize));
    const storedLanguage = localStorage.getItem(languageStorageKey) as Language || initialState.language;

    setThemeState(storedTheme);
    setFontSizeState(storedFontSize);
    setLanguageState(storedLanguage);
  }, []);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  const setFontSize = (newSize: number) => {
    localStorage.setItem(fontSizeStorageKey, String(newSize));
    setFontSizeState(newSize);
  };

  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem(languageStorageKey, newLanguage);
    setLanguageState(newLanguage);
  };
  
  useEffect(() => {
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

  }, [theme, fontSize, language]);

  const value = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    language,
    setLanguage
  }

  return (
    <AppProviderContext.Provider value={value}>
      {children}
    </AppProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(AppProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a AppProvider")
  return context
}

export const useTranslation = () => {
    const { language } = useTheme();
    return { t: translations[language] || translations[defaultLanguage] };
}
