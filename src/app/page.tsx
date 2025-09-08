
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/ui/feature-card";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { Logo } from "@/components/logo";
import { 
  Brain, 
  FileText, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once the loading state is resolved.
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);
  
  if (loading) {
    return <LoadingPage message="Carregando Heal+..." />;
  }

  if (user) {
    return <LoadingPage message="Redirecionando para o dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold">Heal+</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Começar Agora</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground">
              A plataforma inteligente para{" "}
              <span className="text-primary">gestão de feridas</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Utilize tecnologia de ponta com IA para análise automática, 
              acompanhamento médico e relatórios detalhados de feridas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Recursos Avançados
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnologia de ponta para profissionais de saúde e pacientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="Análise com IA"
              description="Inteligência artificial para análise automática de feridas com precisão médica"
            />
            <FeatureCard
              icon={FileText}
              title="Relatórios Automáticos"
              description="Geração automática de relatórios detalhados e profissionais"
            />
            <FeatureCard
              icon={Users}
              title="Acompanhamento Médico"
              description="Sistema completo de acompanhamento e gestão de pacientes"
            />
            <FeatureCard
              icon={BarChart3}
              title="Análise de Progresso"
              description="Comparação temporal e análise de evolução das feridas"
            />
            <FeatureCard
              icon={Shield}
              title="Segurança Total"
              description="Dados protegidos com criptografia e conformidade médica"
            />
            <FeatureCard
              icon={Zap}
              title="Interface Intuitiva"
              description="Design moderno e fácil de usar para todos os usuários"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Por que escolher o Heal+?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Precisão Médica</h3>
                    <p className="text-muted-foreground">
                      Algoritmos de IA treinados com dados médicos reais para máxima precisão
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Economia de Tempo</h3>
                    <p className="text-muted-foreground">
                      Reduza o tempo de documentação em até 70% com automação inteligente
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Acesso Universal</h3>
                    <p className="text-muted-foreground">
                      Funciona em qualquer dispositivo, a qualquer hora, em qualquer lugar
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8">
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">98%</div>
                    <p className="text-muted-foreground">Precisão na análise</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">70%</div>
                    <p className="text-muted-foreground">Redução no tempo de documentação</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                    <p className="text-muted-foreground">Disponibilidade da plataforma</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Pronto para revolucionar sua prática médica?
            </h2>
            <p className="text-xl text-muted-foreground">
              Junte-se a milhares de profissionais que já confiam no Heal+
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">
                Começar Agora - É Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Logo />
              <span className="text-lg font-semibold">Heal+</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Heal+. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
