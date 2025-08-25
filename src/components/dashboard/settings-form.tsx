
"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, Moon, Sun, Contrast, Text } from "lucide-react";
import { useTranslation, useTheme, Language } from "@/contexts/app-provider";

export function SettingsForm() {
  const { t } = useTranslation();
  const { theme, setTheme, fontSize, setFontSize, language, setLanguage } = useTheme();

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
  
  const handleFontSizeChange = (value: string) => {
    setFontSize(parseFloat(value));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="language-selector" className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-muted-foreground" />
          <span>{t.language}</span>
        </Label>
        <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
          <SelectTrigger id="language-selector" className="w-[180px]">
            <SelectValue placeholder={t.selectLanguage} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-br">Português (Brasil)</SelectItem>
            <SelectItem value="en-us">English (US)</SelectItem>
          </SelectContent>
        </Select>
      </div>

       <div className="flex items-center justify-between">
        <Label htmlFor="font-size-selector" className="flex items-center gap-2">
          <Text className="h-5 w-5 text-muted-foreground" />
          <span>{t.fontSize}</span>
        </Label>
        <Select value={String(fontSize)} onValueChange={handleFontSizeChange}>
          <SelectTrigger id="font-size-selector" className="w-[180px]">
            <SelectValue placeholder={t.selectSize} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.9">{t.small}</SelectItem>
            <SelectItem value="1">{t.medium}</SelectItem>
            <SelectItem value="1.1">{t.large}</SelectItem>
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
          <span>{t.darkMode}</span>
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
          <span>{t.highContrast}</span>
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
