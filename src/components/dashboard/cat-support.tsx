
"use client";

import { Cat, ClipboardList, FileText, GitCompareArrows, MessageSquare, Bot, User, X, CalendarDays, Sparkles, Heart, Zap, Shield, Brain, Star, ChevronLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/contexts/app-provider";

type ChatStep = 'intro' | 'anamnesis' | 'report' | 'compare' | 'agenda' | 'analytics' | 'support';

export function CatSupport({ currentPage }: { currentPage: string }) {
  const [step, setStep] = useState<ChatStep>('intro');
  const [isOpen, setIsOpen] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const { t } = useTranslation();
  
  const greetings = [
    t.zeloGreeting1,
    t.zeloGreeting2,
    t.zeloGreeting3,
    t.zeloGreeting4,
    t.zeloGreeting5,
    t.zeloGreeting6,
  ];

  const motivationalMessages = [
    t.zeloMotivation1,
    t.zeloMotivation2,
    t.zeloMotivation3,
    t.zeloMotivation4,
    t.zeloMotivation5,
  ];

  const chatTopics = {
    anamnesis: {
      question: t.zeloAnamnesisQuestion,
      icon: ClipboardList,
      badge: "Novo",
      color: "bg-blue-500",
      answer: t.zeloAnamnesisAnswer,
      tips: [
        t.zeloAnamnesisTip1,
        t.zeloAnamnesisTip2,
        t.zeloAnamnesisTip3
      ]
    },
    report: {
      question: t.zeloReportQuestion,
      icon: FileText,
      badge: "AI",
      color: "bg-purple-500",
      answer: t.zeloReportAnswer,
      tips: [
        t.zeloReportTip1,
        t.zeloReportTip2,
        t.zeloReportTip3
      ]
    },
    compare: {
      question: t.zeloCompareQuestion,
      icon: GitCompareArrows,
      badge: "Pro",
      color: "bg-orange-500",
      answer: t.zeloCompareAnswer,
      tips: [
        t.zeloCompareTip1,
        t.zeloCompareTip2,
        t.zeloCompareTip3
      ]
    },
    agenda: {
      question: t.zeloAgendaQuestion,
      icon: CalendarDays,
      badge: "Em Breve",
      color: "bg-green-500",
      answer: t.zeloAgendaAnswer,
      tips: [
        t.zeloAgendaTip1,
        t.zeloAgendaTip2,
        t.zeloAgendaTip3
      ]
    },
    analytics: {
      question: t.zeloAnalyticsQuestion,
      icon: Brain,
      badge: "Pro",
      color: "bg-indigo-500",
      answer: t.zeloAnalyticsAnswer,
      tips: [
        t.zeloAnalyticsTip1,
        t.zeloAnalyticsTip2,
        t.zeloAnalyticsTip3
      ]
    },
    support: {
      question: t.zeloSupportQuestion,
      icon: Heart,
      badge: "Suporte",
      color: "bg-red-500",
      answer: t.zeloSupportAnswer,
      tips: [
        t.zeloSupportTip1,
        t.zeloSupportTip2,
        t.zeloSupportTip3
      ]
    },
  };

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  const randomMotivation = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  useEffect(() => {
    // Reset chat when popover is closed
    if (!isOpen) {
      setTimeout(() => setStep('intro'), 200);
      setShowMotivation(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Show motivational message after 30 seconds of inactivity
    if (isOpen && step === 'intro') {
      const timer = setTimeout(() => {
        setShowMotivation(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  const ChatBlock = ({ 
    icon: Icon, 
    text, 
    onClick, 
    isUser = false, 
    badge, 
    badgeColor 
  }: { 
    icon: any, 
    text: string, 
    onClick?: () => void, 
    isUser?: boolean,
    badge?: string,
    badgeColor?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 w-full ${isUser ? "justify-end" : ""}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border-2 border-primary/50 shadow-lg">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
            <Cat className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        onClick={onClick}
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm shadow-lg transition-all duration-300 ${
          isUser
            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
            : `bg-gradient-to-r from-background to-muted/50 border border-border/50 ${
                onClick ? "cursor-pointer hover:shadow-xl hover:scale-105 hover:border-primary/30" : ""
              }`
        }`}
      >
        <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <span className="flex-1">{text}</span>
          {badge && (
            <span className={`ml-2 ${badgeColor} text-white text-xs px-2 py-0.5 rounded-full`}>
              {badge}
            </span>
          )}
        </div>
      </div>
       {isUser && (
        <Avatar className="h-8 w-8 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                <User className="h-5 w-5 text-primary" />
            </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );

  const TipBlock = ({ tip, index }: { tip: string, index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-start gap-2 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"
    >
      <Star className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <span className="text-sm text-foreground">{tip}</span>
    </motion.div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Button
            size="icon"
            className="rounded-full h-16 w-16 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-primary/25 transition-all duration-300 border-2 border-white/20"
          >
            <Cat className="h-8 w-8 text-white" />
            <span className="sr-only">{t.chat}</span>
          </Button>
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-96 mr-4 p-0 border-none shadow-2xl bg-gradient-to-br from-background via-background to-muted/10 backdrop-blur-xl" side="top" align="end">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-t-lg border-b border-primary/20">
               <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/30 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                          <Cat className="h-6 w-6 text-primary" />
                      </AvatarFallback>
                  </Avatar>
                  <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-foreground">Zelo</h3>
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                          AI
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{t.zeloSubtitle}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                  </div>
               </div>
               <PopoverClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 transition-colors">
                      <X className="h-4 w-4" />
                  </Button>
               </PopoverClose>
          </div>
        <div className="p-4 bg-background/95 space-y-4 h-[420px] overflow-y-auto scrollbar-thin">
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
                  <ChatBlock icon={Bot} text={t.zeloHelp} />
                  
                  {showMotivation && (
                    <div className="w-full animate-fade-in-up">
                      <ChatBlock 
                        icon={Heart} 
                        text={randomMotivation} 
                      />
                    </div>
                  )}
                  
                  <Separator className="my-3 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  
                  <div className="w-full space-y-3">
                      {Object.entries(chatTopics).map(([key, topic]) => (
                          <ChatBlock 
                              key={key}
                              icon={topic.icon} 
                              text={topic.question} 
                              badge={topic.badge}
                              badgeColor={topic.color}
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
                  
                  {chatTopics[step].tips && (
                    <div className="w-full space-y-2 mt-4 animate-fade-in-up">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{t.zeloImportantTips}</span>
                      </div>
                      {chatTopics[step].tips.map((tip, index) => (
                        <TipBlock tip={tip} index={index} />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setStep('intro')} 
                      className="flex-1 hover:bg-primary/10 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {t.back}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => window.location.reload()} 
                      className="hover:bg-primary/10 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                  </Button>
                  </div>
              </>
            )}
            </motion.div>
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
}
