
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
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-border/50">
        <Label htmlFor="language-selector" className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Languages className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">{t.language}</span>
        </Label>
        <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
          <SelectTrigger id="language-selector" className="w-[180px]">
            <SelectValue placeholder={t.selectLanguage} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-br">Português (Brasil)</SelectItem>
            <SelectItem value="en-us">English (United States)</SelectItem>
          </SelectContent>
        </Select>
      </div>

       <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-border/50">
        <Label htmlFor="font-size-selector" className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <Text className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">{t.fontSize}</span>
        </Label>
        <Select value={String(fontSize)} onValueChange={handleFontSizeChange}>
          <SelectTrigger id="font-size-selector" className="w-[180px]">
            <SelectValue placeholder={t.selectSize} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.8">{t.extraSmall}</SelectItem>
            <SelectItem value="0.9">{t.small}</SelectItem>
            <SelectItem value="1">{t.medium}</SelectItem>
            <SelectItem value="1.1">{t.large}</SelectItem>
            <SelectItem value="1.2">{t.extraLarge}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-border/50">
        <Label htmlFor="dark-mode-switch" className="flex items-center gap-3">
          <div className="p-2 bg-purple-500 rounded-lg">
            {theme === 'dark' || theme === 'system' ? (
              <Moon className="h-4 w-4 text-white" />
            ) : (
              <Sun className="h-4 w-4 text-white" />
            )}
          </div>
          <span className="font-medium">{t.darkMode}</span>
        </Label>
        <Switch
          id="dark-mode-switch"
          checked={theme === 'dark'}
          onCheckedChange={handleThemeChange}
          disabled={theme === 'high-contrast'}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-border/50">
        <Label htmlFor="high-contrast-switch" className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Contrast className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">{t.highContrast}</span>
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
