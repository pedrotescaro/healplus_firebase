
"use client";

import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex-col justify-center items-center p-12">
        <div className="max-w-md text-center space-y-6">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Bem-vindo ao <span className="text-primary">Heal+</span>
            </h1>
            <p className="text-lg text-muted-foreground">
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Logo />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{t.welcomeBack}</h2>
            <p className="text-muted-foreground">{t.loginPrompt}</p>
          </div>

          <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
