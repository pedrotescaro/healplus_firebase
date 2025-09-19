"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export function FontScaleTest() {
  const [fontScale, setFontScale] = useState(1.0);

  useEffect(() => {
    // Get current font scale from CSS variable
    const currentScale = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-scale')
      .trim();
    if (currentScale) {
      setFontScale(parseFloat(currentScale) || 1.0);
    }
  }, []);

  const updateFontScale = (newScale: number) => {
    setFontScale(newScale);
    document.documentElement.style.setProperty('--font-scale', newScale.toString());
  };

  const resetFontScale = () => {
    updateFontScale(1.0);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-responsive-xl">Teste de Escalonamento de Fonte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-responsive-base">Escala Atual:</span>
            <Badge variant="outline" className="text-responsive-lg font-mono">
              {fontScale.toFixed(1)}x
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label className="text-responsive-sm text-muted-foreground">
              Ajuste a escala da fonte (0.5x - 2.0x):
            </label>
            <Slider
              value={[fontScale]}
              onValueChange={([value]) => updateFontScale(value)}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-responsive-xs text-muted-foreground">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>2.0x</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={resetFontScale}
              variant="outline"
              size="sm"
              className="button-responsive"
            >
              Resetar
            </Button>
            <Button 
              onClick={() => updateFontScale(0.8)}
              variant="outline"
              size="sm"
              className="button-responsive"
            >
              Pequeno (0.8x)
            </Button>
            <Button 
              onClick={() => updateFontScale(1.2)}
              variant="outline"
              size="sm"
              className="button-responsive"
            >
              Grande (1.2x)
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-responsive-lg font-semibold mb-3">Preview do Texto:</h3>
          <div className="space-y-2">
            <p className="text-responsive-xs">Texto extra pequeno (xs)</p>
            <p className="text-responsive-sm">Texto pequeno (sm)</p>
            <p className="text-responsive-base">Texto base (base)</p>
            <p className="text-responsive-lg">Texto grande (lg)</p>
            <p className="text-responsive-xl">Texto extra grande (xl)</p>
            <p className="text-responsive-2xl">Texto 2xl</p>
            <p className="text-responsive-3xl">Texto 3xl</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-responsive-lg font-semibold mb-3">Preview dos Componentes:</h3>
          <div className="space-y-3">
            <Button className="button-responsive w-full">
              Botão Responsivo
            </Button>
            <input 
              type="text" 
              placeholder="Input responsivo" 
              className="input-responsive w-full"
            />
            <div className="card-responsive border rounded-lg">
              <p className="text-responsive-sm">Card com padding responsivo</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
