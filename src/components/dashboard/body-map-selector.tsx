
"use client"

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BodyMapSelectorProps {
  onLocationSelect: (location: string) => void;
  currentLocation?: string;
}

// Simplified representation of body parts as SVG paths or elements
// In a real app, these paths would be more detailed.
const BodyParts = {
  anterior: [
    { id: 'Cabeça (Anterior)', d: 'M120,20 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0' },
    { id: 'Pescoço (Anterior)', d: 'M130,40 h20 v10 h-20 z' },
    { id: 'Tórax (Anterior)', d: 'M110,50 h60 v40 h-60 z' },
    { id: 'Abdome', d: 'M110,90 h60 v40 h-60 z' },
    { id: 'Pelve (Anterior)', d: 'M120,130 h40 v20 h-40 z' },
    // Arms
    { id: 'Braço Direito (Anterior)', d: 'M170,55 h15 v50 h-15 z' },
    { id: 'Antebraço Direito (Anterior)', d: 'M170,105 h15 v40 h-15 z' },
    { id: 'Mão Direita (Anterior)', d: 'M170,145 h15 v15 h-15 z' },
    { id: 'Braço Esquerdo (Anterior)', d: 'M95,55 h15 v50 h-15 z' },
    { id: 'Antebraço Esquerdo (Anterior)', d: 'M95,105 h15 v40 h-15 z' },
    { id: 'Mão Esquerda (Anterior)', d: 'M95,145 h15 v15 h-15 z' },
    // Legs
    { id: 'Coxa Direita (Anterior)', d: 'M145,150 h20 v60 h-20 z' },
    { id: 'Perna Direita (Anterior)', d: 'M145,210 h20 v60 h-20 z' },
    { id: 'Pé Direito (Anterior)', d: 'M145,270 h20 v20 h-20 z' },
    { id: 'Coxa Esquerda (Anterior)', d: 'M115,150 h20 v60 h-20 z' },
    { id: 'Perna Esquerda (Anterior)', d: 'M115,210 h20 v60 h-20 z' },
    { id: 'Pé Esquerdo (Anterior)', d: 'M115,270 h20 v20 h-20 z' },
  ],
  posterior: [
     { id: 'Cabeça (Posterior)', d: 'M120,20 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0' },
     { id: 'Pescoço (Posterior)', d: 'M130,40 h20 v10 h-20 z' },
     { id: 'Dorso (Superior)', d: 'M110,50 h60 v40 h-60 z' },
     { id: 'Dorso (Lombar)', d: 'M110,90 h60 v40 h-60 z' },
     { id: 'Região Sacral', d: 'M115,130 h50 v20 h-50 z' },
     // Arms
     { id: 'Braço Direito (Posterior)', d: 'M170,55 h15 v50 h-15 z' },
     { id: 'Antebraço Direito (Posterior)', d: 'M170,105 h15 v40 h-15 z' },
     { id: 'Mão Direita (Posterior)', d: 'M170,145 h15 v15 h-15 z' },
     { id: 'Braço Esquerdo (Posterior)', d: 'M95,55 h15 v50 h-15 z' },
     { id: 'Antebraço Esquerdo (Posterior)', d: 'M95,105 h15 v40 h-15 z' },
     { id: 'Mão Esquerda (Posterior)', d: 'M95,145 h15 v15 h-15 z' },
     // Legs
     { id: 'Coxa Direita (Posterior)', d: 'M145,150 h20 v60 h-20 z' },
     { id: 'Perna Direita (Posterior)', d: 'M145,210 h20 v60 h-20 z' },
     { id: 'Pé Direito (Posterior)', d: 'M145,270 h20 v20 h-20 z' },
     { id: 'Coxa Esquerda (Posterior)', d: 'M115,150 h20 v60 h-20 z' },
     { id: 'Perna Esquerda (Posterior)', d: 'M115,210 h20 v60 h-20 z' },
     { id: 'Pé Esquerdo (Posterior)', d: 'M115,270 h20 v20 h-20 z' },
  ]
};

const BodyView = ({ parts, onSelect, selectedPart }: { parts: {id: string, d: string}[], onSelect: (id: string) => void, selectedPart?: string }) => (
  <svg viewBox="0 0 280 320" className="w-full h-auto max-h-[70vh] cursor-pointer">
    {parts.map((part) => (
      <path
        key={part.id}
        d={part.d}
        onClick={() => onSelect(part.id)}
        className={cn(
          "fill-gray-300 stroke-gray-600 stroke-2 hover:fill-primary/50 transition-colors",
          { "fill-primary": selectedPart === part.id }
        )}
      >
        <title>{part.id}</title>
      </path>
    ))}
  </svg>
);


export function BodyMapSelector({ onLocationSelect, currentLocation }: BodyMapSelectorProps) {

  const handleSelect = (location: string) => {
    onLocationSelect(location);
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="anterior" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="anterior">Vista Anterior</TabsTrigger>
          <TabsTrigger value="posterior">Vista Posterior</TabsTrigger>
        </TabsList>
        <TabsContent value="anterior">
            <div className="p-4 bg-muted/20 rounded-lg">
                <BodyView parts={BodyParts.anterior} onSelect={handleSelect} selectedPart={currentLocation} />
            </div>
        </TabsContent>
        <TabsContent value="posterior">
             <div className="p-4 bg-muted/20 rounded-lg">
                <BodyView parts={BodyParts.posterior} onSelect={handleSelect} selectedPart={currentLocation} />
            </div>
        </TabsContent>
      </Tabs>
      {currentLocation && <p className="mt-4 text-center font-semibold">Localização Selecionada: {currentLocation}</p>}
    </div>
  );
}
