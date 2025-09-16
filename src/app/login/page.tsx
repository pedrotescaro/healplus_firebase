
"use client";

import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/contexts/app-provider";

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex relative">
      {/* Back Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
        </Button>
      </div>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex-col justify-center items-center p-8 xl:p-12">
        <div className="max-w-md text-center space-y-6">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-3xl xl:text-4xl font-bold text-foreground">
              Bem-vindo ao <span className="text-primary">Heal+</span>
            </h1>
            <p className="text-base xl:text-lg text-muted-foreground">
              A plataforma inteligente para gestão e análise de feridas com tecnologia de ponta.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Análise com IA</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Relatórios Automáticos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Acompanhamento Médico</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Histórico Completo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Logo />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t.welcomeBack}</h2>
            <p className="text-sm sm:text-base text-muted-foreground">{t.loginPrompt}</p>
          </div>

          <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
