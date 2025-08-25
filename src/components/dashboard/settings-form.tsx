
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

export function SettingsForm() {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState("pt-br");

  // These functions are for UI demonstration purposes.
  // A full implementation would require a theme and language provider.
  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked);
    // In a real app: document.documentElement.classList.toggle('dark', checked);
  };

  const handleContrastChange = (checked: boolean) => {
    setHighContrast(checked);
    // In a real app: document.documentElement.setAttribute('data-theme', checked ? 'high-contrast' : 'default');
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
          {darkMode ? (
            <Moon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-muted-foreground" />
          )}
          <span>Modo Escuro</span>
        </Label>
        <Switch
          id="dark-mode-switch"
          checked={darkMode}
          onCheckedChange={handleThemeChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="high-contrast-switch" className="flex items-center gap-2">
          <Contrast className="h-5 w-5 text-muted-foreground" />
          <span>Alto Contraste</span>
        </Label>
        <Switch
          id="high-contrast-switch"
          checked={highContrast}
          onCheckedChange={handleContrastChange}
        />
      </div>
    </div>
  );
}
