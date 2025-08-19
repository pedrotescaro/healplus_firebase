
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
    { id: 'Cabeça (Frente)', d: 'M120,20 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0' },
    { id: 'Pescoço (Frente)', d: 'M130,40 h20 v10 h-20 z' },
    { id: 'Tórax', d: 'M110,50 h60 v40 h-60 z' },
    { id: 'Abdômen', d: 'M110,90 h60 v40 h-60 z' },
    { id: 'Pelve (Frente)', d: 'M120,130 h40 v20 h-40 z' },
    // Arms
    { id: 'Braço Direito', d: 'M170,55 h15 v50 h-15 z' },
    { id: 'Antebraço Direito', d: 'M170,105 h15 v40 h-15 z' },
    { id: 'Mão Direita', d: 'M170,145 h15 v15 h-15 z' },
    { id: 'Braço Esquerdo', d: 'M95,55 h15 v50 h-15 z' },
    { id: 'Antebraço Esquerdo', d: 'M95,105 h15 v40 h-15 z' },
    { id: 'Mão Esquerda', d: 'M95,145 h15 v15 h-15 z' },
    // Legs
    { id: 'Coxa Direita (Frente)', d: 'M145,150 h20 v60 h-20 z' },
    { id: 'Perna Direita (Frente)', d: 'M145,210 h20 v60 h-20 z' },
    { id: 'Pé Direito (Frente)', d: 'M145,270 h20 v20 h-20 z' },
    { id: 'Coxa Esquerda (Frente)', d: 'M115,150 h20 v60 h-20 z' },
    { id: 'Perna Esquerda (Frente)', d: 'M115,210 h20 v60 h-20 z' },
    { id: 'Pé Esquerdo (Frente)', d: 'M115,270 h20 v20 h-20 z' },
  ],
  posterior: [
     { id: 'Cabeça (Costas)', d: 'M120,20 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0' },
     { id: 'Pescoço (Costas)', d: 'M130,40 h20 v10 h-20 z' },
     { id: 'Costas (Superior)', d: 'M110,50 h60 v40 h-60 z' },
     { id: 'Costas (Lombar)', d: 'M110,90 h60 v40 h-60 z' },
     { id: 'Glúteos', d: 'M115,130 h50 v20 h-50 z' },
     // Arms
     { id: 'Braço Direito (Costas)', d: 'M170,55 h15 v50 h-15 z' },
     { id: 'Antebraço Direito (Costas)', d: 'M170,105 h15 v40 h-15 z' },
     { id: 'Mão Direita (Costas)', d: 'M170,145 h15 v15 h-15 z' },
     { id: 'Braço Esquerdo (Costas)', d: 'M95,55 h15 v50 h-15 z' },
     { id: 'Antebraço Esquerdo (Costas)', d: 'M95,105 h15 v40 h-15 z' },
     { id: 'Mão Esquerda (Costas)', d: 'M95,145 h15 v15 h-15 z' },
     // Legs
     { id: 'Coxa Direita (Costas)', d: 'M145,150 h20 v60 h-20 z' },
     { id: 'Perna Direita (Costas)', d: 'M145,210 h20 v60 h-20 z' },
     { id: 'Pé Direito (Costas)', d: 'M145,270 h20 v20 h-20 z' },
     { id: 'Coxa Esquerda (Costas)', d: 'M115,150 h20 v60 h-20 z' },
     { id: 'Perna Esquerda (Costas)', d: 'M115,210 h20 v60 h-20 z' },
     { id: 'Pé Esquerdo (Costas)', d: 'M115,270 h20 v20 h-20 z' },
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
