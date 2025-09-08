
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/ui/feature-card";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
  Accessibility
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
            <div className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Heal+
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Link href="/signup">Começar Agora</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Plataforma #1 em Gestão de Feridas
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-foreground leading-tight">
              A plataforma inteligente para{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                gestão de feridas
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Utilize tecnologia de ponta com IA para análise automática, 
              acompanhamento médico e relatórios detalhados de feridas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/signup">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg border-2 hover:bg-primary/5 transition-all duration-300">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Precisão na análise</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Profissionais ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50k+</div>
                <div className="text-sm text-muted-foreground">Feridas analisadas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Recursos Avançados
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Tecnologia que transforma
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossa plataforma combina inteligência artificial, análise de dados e experiência do usuário 
              para revolucionar o cuidado com feridas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Resultados Comprovados
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                  Por que escolher o Heal+?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Nossa plataforma já transformou o cuidado com feridas em milhares de instituições de saúde
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Precisão Médica</h3>
                    <p className="text-muted-foreground">
                      Algoritmos de IA treinados com mais de 100.000 casos reais para máxima precisão diagnóstica
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Economia de Tempo</h3>
                    <p className="text-muted-foreground">
                      Reduza o tempo de documentação em até 70% com automação inteligente e relatórios instantâneos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Acesso Universal</h3>
                    <p className="text-muted-foreground">
                      Funciona em qualquer dispositivo, a qualquer hora, com sincronização automática em nuvem
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary">98%</div>
                    <p className="text-sm text-muted-foreground">Precisão na análise</p>
                  </CardContent>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary">70%</div>
                    <p className="text-sm text-muted-foreground">Redução no tempo</p>
                  </CardContent>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary">24/7</div>
                    <p className="text-sm text-muted-foreground">Disponibilidade</p>
                  </CardContent>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary">10k+</div>
                    <p className="text-sm text-muted-foreground">Profissionais</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary/80 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/90 to-primary/70"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Junte-se à revolução da saúde
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
              Pronto para revolucionar sua prática médica?
            </h2>
            
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Junte-se a mais de 10.000 profissionais que já transformaram o cuidado com feridas usando o Heal+
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Link href="/signup">
                  Começar Agora - É Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            
            <div className="pt-8 text-white/80 text-sm">
              ✨ Sem compromisso • 🚀 Configuração em 5 minutos • 💯 Suporte 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Contato</h3>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:healgrupo@gmail.com" className="text-white hover:text-primary transition-colors">
                  healgrupo@gmail.com
                </a>
              </div>
            </div>
            
            {/* Navegação */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Navegação</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-white hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="#recursos" className="text-white hover:text-primary transition-colors">Recursos</Link></li>
                <li><Link href="#depoimentos" className="text-white hover:text-primary transition-colors">Depoimentos</Link></li>
                <li><Link href="#planos" className="text-white hover:text-primary transition-colors">Planos</Link></li>
                <li><Link href="#faq" className="text-white hover:text-primary transition-colors">Perguntas Frequentes</Link></li>
              </ul>
            </div>
            
            {/* Conecte-se */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Conecte-se</h3>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-white hover:text-primary transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-primary transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-primary transition-colors" aria-label="YouTube">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-primary transition-colors" aria-label="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
              <p className="text-sm text-gray-300">Siga-nos para atualizações</p>
              
              {/* Botão de Acessibilidade */}
              <div className="flex justify-end">
                <button className="w-10 h-10 bg-primary rounded flex items-center justify-center hover:bg-primary/80 transition-colors" aria-label="Acessibilidade">
                  <Accessibility className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Linha divisória */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-300">
                © 2025 Heal. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <Link href="#" className="text-sm text-gray-300 hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
                <Link href="#" className="text-sm text-gray-300 hover:text-primary transition-colors">
                  Privacidade
                </Link>
                <Link href="#" className="text-sm text-gray-300 hover:text-primary transition-colors">
                  Cookies
                </Link>
                <Link href="#" className="text-sm text-gray-300 hover:text-primary transition-colors">
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
