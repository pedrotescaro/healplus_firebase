
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/ui/feature-card";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { Logo } from "@/components/logo";
import { 
  Brain, 
  FileText, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Heart,
  Stethoscope,
  Activity,
  Mail,
  MessageCircle,
  Linkedin,
  Youtube,
  Instagram
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo />
              <div className="hidden sm:block">
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Heal+
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex hover:bg-primary/10 transition-all duration-300">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-sm px-3 sm:px-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/signup">
                  <span className="hidden sm:inline">Começar Agora</span>
                  <span className="sm:hidden">Começar</span>
                </Link>
              </Button>
              <div className="sm:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 lg:w-[32rem] h-64 sm:h-96 lg:h-[32rem] bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-r from-primary/15 to-transparent rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto text-center">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
            {/* Badge */}
            <div className="inline-flex items-center px-4 sm:px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm sm:text-base font-semibold border border-primary/20 shadow-lg backdrop-blur-sm animate-fade-in-up">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
              <span className="hidden sm:inline">Sistema Inteligente de Avaliação de Feridas</span>
              <span className="sm:hidden">Sistema Inteligente</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground leading-tight animate-fade-in-up delay-200">
              A plataforma inteligente para{" "}
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent animate-gradient">
                gestão de feridas
              </span>
            </h1>
            
            <p className="text-lg sm:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 animate-fade-in-up delay-400">
              Utilize IA com Gemini para análise de imagens, 
              geração de relatórios e acompanhamento de progressão de feridas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 px-4 animate-fade-in-up delay-600">
              <Button size="lg" asChild className="h-14 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                <Link href="/signup">
                  <span className="hidden sm:inline">Começar Gratuitamente</span>
                  <span className="sm:hidden">Começar Grátis</span>
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl border-2 hover:bg-primary/10 transition-all duration-300 transform hover:scale-105">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 sm:gap-12 pt-12 sm:pt-20 max-w-3xl mx-auto animate-fade-in-up delay-800">
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">IA</div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">Gemini 2.0</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">TIMERS</div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">Framework</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">PDF</div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">Relatórios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/10 via-background to-muted/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          <div className="absolute top-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full blur-2xl animate-pulse delay-1200"></div>
        </div>

        <div className="container mx-auto">
          <div className="text-center mb-16 sm:mb-24">
            <div className="inline-flex items-center px-4 sm:px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm sm:text-base font-semibold border border-primary/20 shadow-lg backdrop-blur-sm mb-6 sm:mb-8">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
              Recursos Avançados
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8">
              Tecnologia que{" "}
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                transforma
              </span>
            </h2>
            <p className="text-lg sm:text-2xl text-muted-foreground max-w-4xl mx-auto px-4 leading-relaxed">
              Nossa plataforma combina inteligência artificial, análise de dados e experiência do usuário 
              para revolucionar o cuidado com feridas
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <FeatureCard
              icon={Brain}
              title="Análise com IA"
              description="Utiliza Gemini 2.0 Flash para análise de imagens de feridas e geração de relatórios comparativos"
            />
            <FeatureCard
              icon={FileText}
              title="Relatórios PDF"
              description="Geração de relatórios estruturados com protocolo terapêutico e referências bibliográficas"
            />
            <FeatureCard
              icon={Users}
              title="Gestão de Pacientes"
              description="Sistema TIMERS para avaliação estruturada e acompanhamento de pacientes"
            />
            <FeatureCard
              icon={BarChart3}
              title="Comparação Temporal"
              description="Análise comparativa de imagens com histogramas de cores e métricas de evolução"
            />
            <FeatureCard
              icon={Shield}
              title="Segurança"
              description="Autenticação Firebase, dados protegidos e conformidade com LGPD"
            />
            <FeatureCard
              icon={Zap}
              title="Interface Moderna"
              description="Design responsivo com sidebar animada e sistema de badges"
            />
            <FeatureCard
              icon={Heart}
              title="Framework TIMERS"
              description="Avaliação estruturada seguindo padrões clínicos para feridas"
            />
            <FeatureCard
              icon={Stethoscope}
              title="Anamnese Digital"
              description="Formulários inteligentes para coleta de dados clínicos estruturados"
            />
            <FeatureCard
              icon={Activity}
              title="Dashboard Analytics"
              description="Métricas de uso, produtividade e acompanhamento de atividades"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          <div className="absolute top-1/4 right-1/3 w-80 sm:w-96 lg:w-[28rem] h-80 sm:h-96 lg:h-[28rem] bg-gradient-to-r from-primary/15 to-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-2xl animate-pulse delay-1500"></div>
        </div>

        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <div className="space-y-8 sm:space-y-12">
              <div>
                <div className="inline-flex items-center px-4 sm:px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm sm:text-base font-semibold border border-primary/20 shadow-lg backdrop-blur-sm mb-6 sm:mb-8">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
                  Resultados Comprovados
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8">
                  Por que escolher o{" "}
                  <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Heal+?
                  </span>
                </h2>
                <p className="text-lg sm:text-2xl text-muted-foreground leading-relaxed">
                  Sistema desenvolvido para auxiliar profissionais de saúde na avaliação e documentação de feridas
                </p>
              </div>
              
              <div className="space-y-6 sm:space-y-10">
                <div className="flex items-start space-x-4 sm:space-x-6 p-4 sm:p-6 rounded-xl bg-gradient-to-r from-background/80 to-background/60 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] backdrop-blur-sm">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">Análise com Gemini</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Utiliza Gemini 2.0 Flash para análise multimodal de imagens e geração de relatórios comparativos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 sm:space-x-6 p-4 sm:p-6 rounded-xl bg-gradient-to-r from-background/80 to-background/60 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] backdrop-blur-sm">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">Automação Inteligente</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Geração automática de relatórios PDF com protocolo terapêutico e análise comparativa de imagens
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 sm:space-x-6 p-4 sm:p-6 rounded-xl bg-gradient-to-r from-background/80 to-background/60 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] backdrop-blur-sm">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">Interface Responsiva</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Design moderno e responsivo com sidebar animada, funcionando em desktop e mobile
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <Card className="p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-background/90 to-background/70 border border-border/50 backdrop-blur-sm group">
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">Gemini</div>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium">2.0 Flash</p>
                  </CardContent>
                </Card>
                
                <Card className="p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-background/90 to-background/70 border border-border/50 backdrop-blur-sm group">
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">TIMERS</div>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium">Framework</p>
                  </CardContent>
                </Card>
                
                <Card className="p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-background/90 to-background/70 border border-border/50 backdrop-blur-sm group">
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">PDF</div>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium">Relatórios</p>
                  </CardContent>
                </Card>
                
                <Card className="p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-background/90 to-background/70 border border-border/50 backdrop-blur-sm group">
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">Firebase</div>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium">Backend</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/95 to-primary/75"></div>
          <div className="absolute top-1/4 right-1/4 w-80 sm:w-96 lg:w-[32rem] h-80 sm:h-96 lg:h-[32rem] bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-white/8 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
            <div className="inline-flex items-center px-4 sm:px-6 py-3 rounded-full bg-white/20 text-white text-sm sm:text-base font-semibold border border-white/30 shadow-lg backdrop-blur-sm">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
              Junte-se à revolução da saúde
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
              Pronto para{" "}
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                revolucionar
              </span>{" "}
              sua prática médica?
            </h2>
            
            <p className="text-lg sm:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed px-4">
              Sistema desenvolvido para auxiliar profissionais de saúde na avaliação e documentação de feridas com IA
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-8 px-4">
              <Button size="lg" asChild className="h-14 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl bg-white text-primary hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                <Link href="/signup">
                  <span className="hidden sm:inline">Começar Agora - É Grátis</span>
                  <span className="sm:hidden">Começar Grátis</span>
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            
            <div className="pt-8 sm:pt-12 text-white/80 text-sm sm:text-base px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
              <span className="flex items-center gap-2">
                <span className="text-xl">✨</span> Sem compromisso
              </span>
              <span className="flex items-center gap-2">
                <span className="text-xl">🚀</span> Configuração em 5 minutos
              </span>
              <span className="flex items-center gap-2">
                <span className="text-xl">💯</span> Suporte 24/7
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/10 via-background to-muted/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          <div className="absolute top-1/3 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/3 left-1/4 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full blur-2xl animate-pulse delay-2500"></div>
        </div>

        <div className="container mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8">
              Perguntas{" "}
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                Frequentes
              </span>
            </h2>
            <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tire suas dúvidas sobre o Heal+ e descubra como nosso sistema pode auxiliar sua prática médica
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <FAQAccordion items={[
              {
                question: "Como o Heal+ funciona?",
                answer: "O Heal+ é um sistema que utiliza IA (Gemini 2.0 Flash) para análise de imagens de feridas, geração de relatórios PDF estruturados e comparação temporal de progressão. Inclui formulários TIMERS para avaliação clínica."
              },
              {
                question: "Quais profissionais podem utilizar o Heal+?",
                answer: "Profissionais de saúde que trabalham com avaliação e tratamento de feridas, incluindo enfermeiros especializados, médicos dermatologistas e outros profissionais da área."
              },
              {
                question: "Os dados ficam seguros?",
                answer: "Sim, utilizamos Firebase para autenticação e armazenamento, com conformidade LGPD. Os dados são protegidos e acessíveis apenas ao profissional responsável."
              },
              {
                question: "Preciso de treinamento para usar?",
                answer: "O sistema possui interface intuitiva e documentação completa. O framework TIMERS segue padrões clínicos estabelecidos, facilitando a adaptação."
              },
              {
                question: "Como funciona a análise com IA?",
                answer: "A IA analisa imagens de feridas para identificar características visuais, gerar histogramas de cores e comparar progressão temporal. Os relatórios incluem protocolo terapêutico baseado em evidências."
              }
            ]} />
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95"></div>
          <div className="absolute top-1/4 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-primary/5 rounded-full blur-2xl animate-pulse delay-3500"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {/* Contato */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contato
              </h3>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:healgrupo@gmail.com" className="text-white hover:text-primary transition-colors text-sm sm:text-base break-all">
                  healgrupo@gmail.com
                </a>
              </div>
            </div>
            
            {/* Navegação */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-primary">Navegação</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-white hover:text-primary transition-colors text-sm sm:text-base flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">Home</Link></li>
                <li><Link href="#recursos" className="text-white hover:text-primary transition-colors text-sm sm:text-base flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">Recursos</Link></li>
                <li><Link href="#depoimentos" className="text-white hover:text-primary transition-colors text-sm sm:text-base flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">Depoimentos</Link></li>
                <li><Link href="#faq" className="text-white hover:text-primary transition-colors text-sm sm:text-base flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">Perguntas Frequentes</Link></li>
              </ul>
            </div>
            
            {/* Conecte-se */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-primary">Conecte-se</h3>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <a href="#" className="text-white hover:text-primary transition-all duration-300 transform hover:scale-110" aria-label="WhatsApp">
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
                <a href="#" className="text-white hover:text-primary transition-all duration-300 transform hover:scale-110" aria-label="LinkedIn">
                  <Linkedin className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
                <a href="#" className="text-white hover:text-primary transition-all duration-300 transform hover:scale-110" aria-label="YouTube">
                  <Youtube className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
                <a href="#" className="text-white hover:text-primary transition-all duration-300 transform hover:scale-110" aria-label="Instagram">
                  <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              </div>
              <p className="text-sm text-gray-300">Siga-nos para atualizações</p>
            </div>
          </div>
          
          {/* Linha divisória */}
          <div className="border-t border-slate-700/50 mt-8 sm:mt-12 pt-8 sm:pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-300 text-center md:text-left">
                © 2025 Heal+. Todos os direitos reservados.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                <Link href="#" className="text-sm text-gray-300 hover:text-primary transition-colors hover:underline">
                  Termos de Uso
                </Link>
                <Link href="#" className="text-sm text-gray-300 hover:text-primary transition-colors hover:underline">
                  Privacidade
                </Link>
                <Link href="#" className="text-sm text-gray-300 hover:text-primary transition-colors hover:underline">
                  Cookies
                </Link>
                <Link href="#" className="text-sm text-gray-300 hover:text-primary transition-colors hover:underline">
                  Acessibilidade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
