
"use client";

import { Cat, ClipboardList, FileText, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function CatSupport() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg"
          >
            <Cat className="h-7 w-7" />
            <span className="sr-only">Ajuda</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-4" side="top" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-primary flex items-center">
                <Cat className="mr-2" />
                Olá! Sou o Gato-Curativo.
              </h3>
              <p className="text-sm text-muted-foreground">
                Estou aqui para te ajudar a usar o Heal+. Veja o que você pode fazer:
              </p>
            </div>
            <Separator />
            <div className="grid gap-3 text-sm">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold">Ficha de Anamnese</p>
                        <p className="text-muted-foreground">
                            Clique em "Nova Anamnese" para criar uma ficha detalhada do paciente e da ferida.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold">Gerar Relatório com IA</p>
                        <p className="text-muted-foreground">
                            Carregue uma foto da ferida e uma ficha salva para receber uma análise completa e sugestões de tratamento.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <GitCompareArrows className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold">Comparar Imagens</p>
                        <p className="text-muted-foreground">
                           Envie duas fotos da mesma ferida para que a IA analise o progresso da cicatrização ao longo do tempo.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
