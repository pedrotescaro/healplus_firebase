
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
  Instagram,
  Accessibility,
  ChevronDown,
  ChevronUp,
  Crown,
  Calendar,
  UserCheck,
  Lock,
  Smartphone,
  Headphones
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
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-sm px-3 sm:px-4">
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
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Plataforma #1 em Gestão de Feridas</span>
              <span className="sm:hidden">#1 em Gestão de Feridas</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight">
              A plataforma inteligente para{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                gestão de feridas
              </span>
            </h1>
            
            <p className="text-base sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Utilize tecnologia de ponta com IA para análise automática, 
              acompanhamento médico e relatórios detalhados de feridas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4">
              <Button size="lg" asChild className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/signup">
                  <span className="hidden sm:inline">Começar Gratuitamente</span>
                  <span className="sm:hidden">Começar Grátis</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-2 hover:bg-primary/5 transition-all duration-300">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 sm:pt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">98%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Precisão</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">10k+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Profissionais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">50k+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Feridas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Recursos Avançados
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Tecnologia que transforma
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Nossa plataforma combina inteligência artificial, análise de dados e experiência do usuário 
              para revolucionar o cuidado com feridas
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={Brain}
              title="Análise com IA"
              description="Algoritmos de deep learning treinados com milhares de casos reais para análise precisa e instantânea"
            />
            <FeatureCard
              icon={FileText}
              title="Relatórios Automáticos"
              description="Geração automática de relatórios médicos detalhados em segundos, prontos para impressão"
            />
            <FeatureCard
              icon={Users}
              title="Acompanhamento Médico"
              description="Sistema completo de gestão de pacientes com histórico completo e evolução temporal"
            />
            <FeatureCard
              icon={BarChart3}
              title="Análise de Progresso"
              description="Comparação temporal avançada com métricas de evolução e previsão de cicatrização"
            />
            <FeatureCard
              icon={Shield}
              title="Segurança Total"
              description="Conformidade LGPD, criptografia end-to-end e backup automático de todos os dados"
            />
            <FeatureCard
              icon={Zap}
              title="Interface Intuitiva"
              description="Design responsivo e acessível, otimizado para uso em qualquer dispositivo"
            />
            <FeatureCard
              icon={Heart}
              title="Cuidado Humanizado"
              description="Tecnologia que amplifica o cuidado humano, não o substitui"
            />
            <FeatureCard
              icon={Stethoscope}
              title="Integração Médica"
              description="Compatível com sistemas hospitalares e prontuários eletrônicos existentes"
            />
            <FeatureCard
              icon={Activity}
              title="Monitoramento 24/7"
              description="Alertas automáticos e acompanhamento contínuo do estado das feridas"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="space-y-6 sm:space-y-10">
              <div>
                <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Resultados Comprovados
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                  Por que escolher o Heal+?
                </h2>
                <p className="text-base sm:text-xl text-muted-foreground">
                  Nossa plataforma já transformou o cuidado com feridas em milhares de instituições de saúde
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-8">
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Precisão Médica</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Algoritmos de IA treinados com mais de 100.000 casos reais para máxima precisão diagnóstica
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Economia de Tempo</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Reduza o tempo de documentação em até 70% com automação inteligente e relatórios instantâneos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Acesso Universal</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Funciona em qualquer dispositivo, a qualquer hora, com sincronização automática em nuvem
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary">98%</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Precisão na análise</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary">70%</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Redução no tempo</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary">24/7</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Disponibilidade</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary">10k+</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Profissionais</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary/80 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/90 to-primary/70"></div>
          <div className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-white/20 text-white text-xs sm:text-sm font-medium">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Junte-se à revolução da saúde
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
              Pronto para revolucionar sua prática médica?
            </h2>
            
            <p className="text-base sm:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              Junte-se a mais de 10.000 profissionais que já transformaram o cuidado com feridas usando o Heal+
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4">
              <Button size="lg" asChild className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Link href="/signup">
                  <span className="hidden sm:inline">Começar Agora - É Grátis</span>
                  <span className="sm:hidden">Começar Grátis</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            
            <div className="pt-6 sm:pt-8 text-white/80 text-xs sm:text-sm px-4">
              ✨ Sem compromisso • 🚀 Configuração em 5 minutos • 💯 Suporte 24/7
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Perguntas Frequentes
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground">
              Tire suas dúvidas sobre o Heal
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <FAQAccordion items={[
              {
                question: "Como o Heal ajuda no acompanhamento de feridas?",
                answer: "O Heal permite registrar fotos, medidas e observações de cada ferida, criando um histórico completo e organizado. O app também gera relatórios automáticos de evolução e oferece lembretes para próximos atendimentos."
              },
              {
                question: "Quais profissionais podem utilizar o Heal?",
                answer: "Médicos, enfermeiros e profissionais de saúde especializados em tratamento de feridas."
              },
              {
                question: "Os dados dos pacientes ficam seguros?",
                answer: "Utilizamos criptografia de ponta a ponta e seguimos rigorosamente as normas da LGPD para garantir total segurança das informações."
              },
              {
                question: "Posso usar o Heal em mais de um dispositivo?",
                answer: "Sim! Seus dados são sincronizados em tempo real entre todos os dispositivos conectados à sua conta."
              },
              {
                question: "Como funciona o suporte técnico?",
                answer: "Nossa equipe está disponível 24/7 por chat, e-mail e telefone para auxiliar com qualquer necessidade."
              }
            ]} />
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Nossos Planos
            </h2>
            <p className="text-base sm:text-xl text-gray-300">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Plano Básico */}
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Básico</h3>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">Grátis</div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Até 10 pacientes</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Registro básico de feridas</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Calendário simples</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm sm:text-base"
                    asChild
                  >
                    <Link href="/signup">Começar Agora</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Premium</h3>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">R$ 99/mês</div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Pacientes ilimitados</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Análise avançada de feridas</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Relatórios personalizados</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">Suporte prioritário</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary text-white hover:bg-primary/90 transition-colors text-sm sm:text-base"
                    asChild
                  >
                    <Link href="/signup">Começar Agora</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Contato */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-primary">Contato</h3>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <a href="mailto:healgrupo@gmail.com" className="text-white hover:text-primary transition-colors text-sm sm:text-base break-all">
                  healgrupo@gmail.com
                </a>
              </div>
            </div>
            
            {/* Navegação */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-primary">Navegação</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-white hover:text-primary transition-colors text-sm sm:text-base">Home</Link></li>
                <li><Link href="#recursos" className="text-white hover:text-primary transition-colors text-sm sm:text-base">Recursos</Link></li>
                <li><Link href="#depoimentos" className="text-white hover:text-primary transition-colors text-sm sm:text-base">Depoimentos</Link></li>
                <li><Link href="#planos" className="text-white hover:text-primary transition-colors text-sm sm:text-base">Planos</Link></li>
                <li><Link href="#faq" className="text-white hover:text-primary transition-colors text-sm sm:text-base">Perguntas Frequentes</Link></li>
              </ul>
            </div>
            
            {/* Conecte-se */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-primary">Conecte-se</h3>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <a href="#" className="text-white hover:text-primary transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="text-white hover:text-primary transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="text-white hover:text-primary transition-colors" aria-label="YouTube">
                  <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="text-white hover:text-primary transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
              <p className="text-xs sm:text-sm text-gray-300">Siga-nos para atualizações</p>
            </div>
          </div>
          
          {/* Linha divisória */}
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-xs sm:text-sm text-gray-300 text-center md:text-left">
                © 2025 Heal. Todos os direitos reservados.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <Link href="#" className="text-xs sm:text-sm text-gray-300 hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
                <Link href="#" className="text-xs sm:text-sm text-gray-300 hover:text-primary transition-colors">
                  Privacidade
                </Link>
                <Link href="#" className="text-xs sm:text-sm text-gray-300 hover:text-primary transition-colors">
                  Cookies
                </Link>
                <Link href="#" className="text-xs sm:text-sm text-gray-300 hover:text-primary transition-colors">
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
