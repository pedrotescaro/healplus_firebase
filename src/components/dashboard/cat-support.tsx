
"use client";

import { Cat, ClipboardList, FileText, GitCompareArrows, MessageSquare, Bot, User, X, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useState, useMemo, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/contexts/app-provider";

const chatTopics = {
  anamnesis: {
    question: "Como crio uma ficha de anamnese?",
    icon: ClipboardList,
    answer: "Para criar uma nova ficha, vá para a página 'Nova Avaliação'. Preencha o máximo de informações que puder. Quanto mais detalhada a ficha, mais precisa será a análise da IA para o relatório da ferida!",
  },
  report: {
    question: "Como gero um relatório com IA?",
    icon: FileText,
    answer: "Na página 'Gerar Relatório', escolha uma ficha salva, insira o email do paciente, envie uma foto nítida da ferida e deixe que eu analise! Vou te dar uma avaliação completa e sugestões de tratamento.",
  },
  compare: {
    question: "Para que serve a comparação de relatórios?",
    icon: GitCompareArrows,
    answer: "Use a página 'Comparar Relatórios' para selecionar dois relatórios do mesmo paciente. Vou analisar a evolução do caso, combinando os dados dos relatórios e das imagens.",
  },
  agenda: {
    question: "Como funciona a Agenda?",
    icon: CalendarDays,
    answer: "A Agenda mostra automaticamente os retornos marcados nas fichas de avaliação. É uma forma fácil de ver seus próximos compromissos e nunca perder uma reavaliação importante.",
  },
  chat: {
    question: "Como posso conversar com alguém?",
    icon: MessageSquare,
    answer: "É fácil! Seus contatos (pacientes ou profissionais) aparecerão na lista de 'Contatos' assim que você gerar ou receber um relatório. A partir daí, é só selecionar um contato para iniciar a conversa.",
  },
};

type ChatStep = 'intro' | 'anamnesis' | 'report' | 'compare' | 'agenda' | 'chat';

const greetings = [
  "Olá! Sou o Zelo.",
  "Miau! Precisando de uma pata?",
  "Olá de novo! O que vamos fazer hoje?",
  "Estou por aqui se precisar de ajuda!",
];

export function CatSupport({ currentPage }: { currentPage: string }) {
  const [step, setStep] = useState<ChatStep>('intro');
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  
  const randomGreeting = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  }, []);

  useEffect(() => {
    // Reset chat when popover is closed
    if (!isOpen) {
      setTimeout(() => setStep('intro'), 200);
    }
  }, [isOpen]);

  const ChatBlock = ({ icon: Icon, text, onClick, isUser = false }: { icon: React.ElementType, text: string, onClick?: () => void, isUser?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 w-full ${isUser ? "justify-end" : ""}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border-2 border-primary/50">
          <AvatarFallback className="bg-primary/20">
            <Cat className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        onClick={onClick}
        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : `bg-muted ${onClick ? "cursor-pointer hover:bg-muted/80" : ""}`
        }`}
      >
        <p className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span>{text}</span>
        </p>
      </div>
       {isUser && (
        <Avatar className="h-8 w-8">
            <AvatarFallback>
                <User className="h-5 w-5" />
            </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg hover:scale-110 transform transition-transform duration-200"
          >
            <Cat className="h-7 w-7" />
            <span className="sr-only">{t.chat}</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 mr-4 p-0 border-none shadow-2xl" side="top" align="end">
          <div className="flex items-center justify-between p-3 bg-card rounded-t-lg border-b">
               <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/20">
                          <Cat className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                  </Avatar>
                  <div>
                      <h3 className="font-bold text-md text-foreground">Zelo</h3>
                      <p className="text-xs text-muted-foreground">Seu assistente Heal+</p>
                  </div>
               </div>
               <PopoverClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                  </Button>
               </PopoverClose>
          </div>
        <div className="p-4 bg-background/95 space-y-4 h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
              <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 flex flex-col items-start"
              >
            {step === 'intro' && (
              <>
                  <ChatBlock icon={Bot} text={randomGreeting} />
                  <ChatBlock icon={Bot} text="Como posso te ajudar hoje?" />
                  <Separator className="my-2" />
                  <div className="w-full space-y-2">
                      {Object.entries(chatTopics).map(([key, topic]) => (
                          <ChatBlock 
                              key={key} 
                              icon={topic.icon} 
                              text={topic.question} 
                              onClick={() => setStep(key as ChatStep)} 
                          />
                      ))}
                  </div>
              </>
            )}
            {step !== 'intro' && (
              <>
                  <ChatBlock 
                      icon={User}
                      text={chatTopics[step].question} 
                      isUser 
                  />
                  <ChatBlock 
                      icon={Bot}
                      text={chatTopics[step].answer} 
                  />
                   <Button variant="link" size="sm" onClick={() => setStep('intro')} className="mt-4">
                      Ver outras opções
                  </Button>
              </>
            )}
            </motion.div>
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
}
