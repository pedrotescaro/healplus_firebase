"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowRight, Eye, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface BodyMap3DProps {
  selectedLocation?: string;
  onLocationSelect: (location: string) => void;
  className?: string;
}

interface BodyPart {
  id: string;
  name: string;
  path: string;
  view: 'anterior' | 'posterior';
  region: string;
}

const bodyParts: BodyPart[] = [
  // Cabeça e Pescoço - Anterior
  { id: 'head-front', name: 'Cabeça (Anterior)', path: 'M50,20 C45,15 40,15 35,20 L35,35 C35,40 40,45 50,45 C60,45 65,40 65,35 L65,20 C60,15 55,15 50,20 Z', view: 'anterior', region: 'cabeça' },
  { id: 'neck-front', name: 'Pescoço (Anterior)', path: 'M45,45 L45,60 L55,60 L55,45 Z', view: 'anterior', region: 'pescoço' },
  
  // Tórax - Anterior
  { id: 'chest-front', name: 'Tórax (Anterior)', path: 'M35,60 L35,120 L65,120 L65,60 Z', view: 'anterior', region: 'tórax' },
  { id: 'shoulder-left-front', name: 'Ombro Esquerdo (Anterior)', path: 'M25,65 L25,85 L35,85 L35,65 Z', view: 'anterior', region: 'ombro' },
  { id: 'shoulder-right-front', name: 'Ombro Direito (Anterior)', path: 'M65,65 L65,85 L75,85 L75,65 Z', view: 'anterior', region: 'ombro' },
  
  // Abdômen - Anterior
  { id: 'abdomen-front', name: 'Abdômen (Anterior)', path: 'M40,120 L40,160 L60,160 L60,120 Z', view: 'anterior', region: 'abdômen' },
  
  // Membros Superiores - Anterior
  { id: 'arm-left-front', name: 'Braço Esquerdo (Anterior)', path: 'M25,85 L15,85 L15,140 L25,140 Z', view: 'anterior', region: 'braço' },
  { id: 'arm-right-front', name: 'Braço Direito (Anterior)', path: 'M75,85 L85,85 L85,140 L75,140 Z', view: 'anterior', region: 'braço' },
  { id: 'forearm-left-front', name: 'Antebraço Esquerdo (Anterior)', path: 'M15,140 L10,140 L10,180 L15,180 Z', view: 'anterior', region: 'antebraço' },
  { id: 'forearm-right-front', name: 'Antebraço Direito (Anterior)', path: 'M85,140 L90,140 L90,180 L85,180 Z', view: 'anterior', region: 'antebraço' },
  { id: 'hand-left-front', name: 'Mão Esquerda (Anterior)', path: 'M10,180 L5,180 L5,200 L10,200 Z', view: 'anterior', region: 'mão' },
  { id: 'hand-right-front', name: 'Mão Direita (Anterior)', path: 'M90,180 L95,180 L95,200 L90,200 Z', view: 'anterior', region: 'mão' },
  
  // Membros Inferiores - Anterior
  { id: 'thigh-left-front', name: 'Coxa Esquerda (Anterior)', path: 'M40,160 L35,160 L35,220 L40,220 Z', view: 'anterior', region: 'coxa' },
  { id: 'thigh-right-front', name: 'Coxa Direita (Anterior)', path: 'M60,160 L65,160 L65,220 L60,220 Z', view: 'anterior', region: 'coxa' },
  { id: 'leg-left-front', name: 'Perna Esquerda (Anterior)', path: 'M35,220 L30,220 L30,280 L35,280 Z', view: 'anterior', region: 'perna' },
  { id: 'leg-right-front', name: 'Perna Direita (Anterior)', path: 'M65,220 L70,220 L70,280 L65,280 Z', view: 'anterior', region: 'perna' },
  { id: 'foot-left-front', name: 'Pé Esquerdo (Anterior)', path: 'M30,280 L25,280 L25,300 L30,300 Z', view: 'anterior', region: 'pé' },
  { id: 'foot-right-front', name: 'Pé Direito (Anterior)', path: 'M70,280 L75,280 L75,300 L70,300 Z', view: 'anterior', region: 'pé' },
  
  // Cabeça e Pescoço - Posterior
  { id: 'head-back', name: 'Cabeça (Posterior)', path: 'M50,20 C45,15 40,15 35,20 L35,35 C35,40 40,45 50,45 C60,45 65,40 65,35 L65,20 C60,15 55,15 50,20 Z', view: 'posterior', region: 'cabeça' },
  { id: 'neck-back', name: 'Pescoço (Posterior)', path: 'M45,45 L45,60 L55,60 L55,45 Z', view: 'posterior', region: 'pescoço' },
  
  // Tórax - Posterior
  { id: 'back', name: 'Costas (Posterior)', path: 'M35,60 L35,120 L65,120 L65,60 Z', view: 'posterior', region: 'costas' },
  { id: 'shoulder-left-back', name: 'Ombro Esquerdo (Posterior)', path: 'M25,65 L25,85 L35,85 L35,65 Z', view: 'posterior', region: 'ombro' },
  { id: 'shoulder-right-back', name: 'Ombro Direito (Posterior)', path: 'M65,65 L65,85 L75,85 L75,65 Z', view: 'posterior', region: 'ombro' },
  
  // Região Sacral - Posterior
  { id: 'sacral', name: 'Região Sacral (Posterior)', path: 'M40,120 L40,160 L60,160 L60,120 Z', view: 'posterior', region: 'sacral' },
  
  // Membros Superiores - Posterior
  { id: 'arm-left-back', name: 'Braço Esquerdo (Posterior)', path: 'M25,85 L15,85 L15,140 L25,140 Z', view: 'posterior', region: 'braço' },
  { id: 'arm-right-back', name: 'Braço Direito (Posterior)', path: 'M75,85 L85,85 L85,140 L75,140 Z', view: 'posterior', region: 'braço' },
  { id: 'forearm-left-back', name: 'Antebraço Esquerdo (Posterior)', path: 'M15,140 L10,140 L10,180 L15,180 Z', view: 'posterior', region: 'antebraço' },
  { id: 'forearm-right-back', name: 'Antebraço Direito (Posterior)', path: 'M85,140 L90,140 L90,180 L85,180 Z', view: 'posterior', region: 'antebraço' },
  { id: 'hand-left-back', name: 'Mão Esquerda (Posterior)', path: 'M10,180 L5,180 L5,200 L10,200 Z', view: 'posterior', region: 'mão' },
  { id: 'hand-right-back', name: 'Mão Direita (Posterior)', path: 'M90,180 L95,180 L95,200 L90,200 Z', view: 'posterior', region: 'mão' },
  
  // Membros Inferiores - Posterior
  { id: 'thigh-left-back', name: 'Coxa Esquerda (Posterior)', path: 'M40,160 L35,160 L35,220 L40,220 Z', view: 'posterior', region: 'coxa' },
  { id: 'thigh-right-back', name: 'Coxa Direita (Posterior)', path: 'M60,160 L65,160 L65,220 L60,220 Z', view: 'posterior', region: 'coxa' },
  { id: 'leg-left-back', name: 'Perna Esquerda (Posterior)', path: 'M35,220 L30,220 L30,280 L35,280 Z', view: 'posterior', region: 'perna' },
  { id: 'leg-right-back', name: 'Perna Direita (Posterior)', path: 'M65,220 L70,220 L70,280 L65,280 Z', view: 'posterior', region: 'perna' },
  { id: 'foot-left-back', name: 'Pé Esquerdo (Posterior)', path: 'M30,280 L25,280 L25,300 L30,300 Z', view: 'posterior', region: 'pé' },
  { id: 'foot-right-back', name: 'Pé Direito (Posterior)', path: 'M70,280 L75,280 L75,300 L70,300 Z', view: 'posterior', region: 'pé' },
];

export function BodyMap3D({ selectedLocation, onLocationSelect, className }: BodyMap3DProps) {
  const [currentView, setCurrentView] = useState<'anterior' | 'posterior'>('anterior');
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const visibleParts = bodyParts.filter(part => part.view === currentView);

  const handlePartClick = (part: BodyPart) => {
    onLocationSelect(`${part.name} - ${part.region}`);
  };

  const handleRotate = () => {
    setIsRotating(true);
    setRotationY(prev => prev + 180);
    setTimeout(() => {
      setCurrentView(prev => prev === 'anterior' ? 'posterior' : 'anterior');
      setIsRotating(false);
    }, 500);
  };

  const resetView = () => {
    setCurrentView('anterior');
    setRotationX(0);
    setRotationY(0);
    setRotationZ(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => Math.max(-30, Math.min(30, prev - deltaY * 0.3)));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Mapa Corporal 3D
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              disabled={isRotating}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              {currentView === 'anterior' ? 'Ver Posterior' : 'Ver Anterior'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotationY(prev => prev + 90)}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Rotacionar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Clique em uma região do corpo para selecionar a localização da ferida
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Indicador de Vista */}
          <div className="flex items-center gap-4 text-sm">
            <div className={cn(
              "px-3 py-1 rounded-full transition-colors",
              currentView === 'anterior' 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              Vista Anterior
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full transition-colors",
              currentView === 'posterior' 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              Vista Posterior
            </div>
          </div>

          {/* Indicador de Rotação 3D */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>X: {Math.round(rotationX)}°</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Y: {Math.round(rotationY)}°</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Z: {Math.round(rotationZ)}°</span>
            </div>
          </div>

          {/* Mapa Corporal SVG */}
          <div className="relative">
            <div
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              <svg
                ref={svgRef}
                viewBox="0 0 100 320"
                className={cn(
                  "w-64 h-96 transition-transform duration-300 cursor-grab",
                  isDragging && "cursor-grabbing",
                  isRotating && "transition-transform duration-500"
                )}
                style={{
                  transform: `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg) translateZ(0)`,
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
              {/* Corpo Base */}
              <g className="body-base">
                {visibleParts.map((part) => (
                  <path
                    key={part.id}
                    d={part.path}
                    fill={
                      selectedLocation?.includes(part.name)
                        ? "#ef4444"
                        : hoveredPart === part.id
                        ? "#fbbf24"
                        : "#e5e7eb"
                    }
                    stroke="#374151"
                    strokeWidth="0.5"
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => handlePartClick(part)}
                    onMouseEnter={() => setHoveredPart(part.id)}
                    onMouseLeave={() => setHoveredPart(null)}
                    style={{
                      filter: selectedLocation?.includes(part.name)
                        ? "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))"
                        : hoveredPart === part.id
                        ? "drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))"
                        : undefined
                    }}
                  />
                ))}
              </g>
            </svg>
            </div>

            {/* Efeito 3D com CSS */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.3) 100%)',
                borderRadius: '8px',
                transform: 'perspective(1000px) rotateX(5deg)',
                zIndex: -1,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
              }}
            />
            
            {/* Sombra 3D dinâmica */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,${Math.abs(rotationX) * 0.01 + 0.1}) 100%)`,
                borderRadius: '8px',
                zIndex: -2
              }}
            />
            
            {/* Instruções de uso */}
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <p className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Arraste para rotacionar • Clique para selecionar
              </p>
            </div>
          </div>

          {/* Informações da Seleção */}
          {selectedLocation && (
            <div className="w-full p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Localização Selecionada:</h4>
              <p className="text-sm text-primary/80">{selectedLocation}</p>
            </div>
          )}

          {/* Legenda das Regiões */}
          <div className="w-full">
            <h4 className="font-semibold mb-3">Regiões Disponíveis:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['cabeça', 'pescoço', 'tórax', 'costas', 'ombro', 'braço', 'antebraço', 'mão', 'abdômen', 'sacral', 'coxa', 'perna', 'pé'].map((region) => (
                <div
                  key={region}
                  className={cn(
                    "px-2 py-1 rounded text-center transition-colors cursor-pointer",
                    selectedLocation?.toLowerCase().includes(region)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                  onClick={() => {
                    const part = bodyParts.find(p => 
                      p.region === region && 
                      p.view === currentView
                    );
                    if (part) handlePartClick(part);
                  }}
                >
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
