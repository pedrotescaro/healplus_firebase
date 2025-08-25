
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, Moon, Sun, Contrast } from "lucide-react";
import { useTheme } from "@/contexts/theme-provider";

export function SettingsForm() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("pt-br");

  // These functions are for UI demonstration purposes.
  // A full implementation would require a theme and language provider.
  const handleThemeChange = (checked: boolean) => {
    if (checked) {
      if (theme === 'high-contrast') {
        // do nothing, keep high-contrast if it's already on
      } else {
        setTheme('dark');
      }
    } else {
       if (theme === 'high-contrast') {
        // do nothing
      } else {
        setTheme('light');
      }
    }
  };

  const handleContrastChange = (checked: boolean) => {
     if (checked) {
      setTheme('high-contrast');
    } else {
      // Revert to light or dark based on system/previous preference
      // for simplicity, we'll go to light. A more robust solution might store the previous theme.
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // In a real app: i18n.changeLanguage(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="language-selector" className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-muted-foreground" />
          <span>Idioma</span>
        </Label>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger id="language-selector" className="w-[180px]">
            <SelectValue placeholder="Selecione o idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-br">Português (Brasil)</SelectItem>
            <SelectItem value="en-us">English (US)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode-switch" className="flex items-center gap-2">
          {theme === 'dark' || theme === 'system' ? (
            <Moon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-muted-foreground" />
          )}
          <span>Modo Escuro</span>
        </Label>
        <Switch
          id="dark-mode-switch"
          checked={theme === 'dark'}
          onCheckedChange={handleThemeChange}
          disabled={theme === 'high-contrast'}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="high-contrast-switch" className="flex items-center gap-2">
          <Contrast className="h-5 w-5 text-muted-foreground" />
          <span>Alto Contraste</span>
        </Label>
        <Switch
          id="high-contrast-switch"
          checked={theme === 'high-contrast'}
          onCheckedChange={handleContrastChange}
        />
      </div>
    </div>
  );
}
