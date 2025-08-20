
"use client";

import { Cat, ClipboardList, FileText, GitCompareArrows, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";

const pageTips = {
  "/dashboard": {
    icon: LayoutDashboard,
    title: "Seu Painel Principal",
    description: "Aqui você tem um resumo de tudo! Crie novas fichas ou acesse rapidamente as funcionalidades de IA para gerar relatórios e comparar imagens.",
  },
  "/dashboard/anamnesis": {
    icon: ClipboardList,
    title: "Criando uma Ficha de Anamnese",
    description: "Preencha o máximo de informações que puder. Quanto mais detalhada a ficha, mais precisa será a análise da IA para o relatório da ferida!",
  },
   "/dashboard/anamnesis-records": {
    icon: ClipboardList,
    title: "Gerenciando suas Fichas",
    description: "Nesta tela, você pode visualizar, editar ou excluir qualquer ficha de anamnese que já criou. Mantenha os registros dos seus pacientes sempre organizados.",
  },
  "/dashboard/report": {
    icon: FileText,
    title: "Gerando um Relatório com IA",
    description: "Escolha uma ficha salva, envie uma foto nítida da ferida e deixe que eu analise! Vou te dar uma avaliação completa e sugestões de tratamento.",
  },
  "/dashboard/compare": {
    icon: GitCompareArrows,
    title: "Comparando o Progresso",
    description: "Envie duas fotos da mesma ferida, tiradas em datas diferentes. Vou analisar as imagens e te mostrar como a cicatrização está progredindo.",
  },
};

const greetings = [
  "Olá! Sou o Miau-Lhor.",
  "Miau! Precisando de uma pata?",
  "Olá de novo! O que vamos fazer hoje?",
  "Estou por aqui se precisar de ajuda!",
];

export function CatSupport({ currentPage }: { currentPage: string }) {
  const currentTipKey = Object.keys(pageTips).find(key => currentPage.startsWith(key)) || "/dashboard";
  const currentTip = pageTips[currentTipKey as keyof typeof pageTips];

  const randomGreeting = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  }, []);
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg animate-pulse hover:scale-110 hover:animate-none transform transition-transform duration-200"
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
                {randomGreeting}
              </h3>
              <p className="text-sm text-muted-foreground">
                Aqui vai uma dica sobre a tela atual:
              </p>
            </div>
            <Separator />
            <div className="grid gap-3 text-sm">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <currentTip.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold">{currentTip.title}</p>
                        <p className="text-muted-foreground">
                           {currentTip.description}
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
