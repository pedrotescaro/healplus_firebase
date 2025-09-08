
"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function SignupPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex-col justify-center items-center p-12">
        <div className="max-w-md text-center space-y-6">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Junte-se ao <span className="text-primary">Heal+</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Comece sua jornada na plataforma mais avançada de gestão de feridas.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Cadastro gratuito e rápido</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Acesso a todas as funcionalidades</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Suporte especializado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Logo />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{t.createAccount}</h2>
            <p className="text-muted-foreground">{t.createAccountPrompt}</p>
          </div>

          <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <SignupForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
