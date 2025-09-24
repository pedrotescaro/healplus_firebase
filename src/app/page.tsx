
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
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };


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
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300">
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
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
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
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-foreground leading-tight animate-fade-in-up delay-200">
              A plataforma inteligente para{" "}
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent animate-gradient">
                gestão de feridas
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-3 sm:px-4 animate-fade-in-up delay-400">
              Utilize IA com Gemini para análise de imagens, 
              geração de relatórios e acompanhamento de progressão de feridas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center pt-4 sm:pt-6 px-3 sm:px-4 animate-fade-in-up delay-600">
              <Button size="lg" asChild className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                <Link href="/signup">
                  <span className="hidden sm:inline">Começar Gratuitamente</span>
                  <span className="sm:hidden">Começar Grátis</span>
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 pt-8 sm:pt-12 md:pt-16 lg:pt-20 max-w-3xl mx-auto animate-fade-in-up delay-800">
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">IA</div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">Gemini 2.0</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">TIMERS</div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">Framework</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">PDF</div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">Relatórios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-muted/10 via-background to-muted/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          <div className="absolute top-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full blur-2xl animate-pulse delay-1200"></div>
        </div>

        <div className="container mx-auto">
           <motion.div 
              className="text-center mb-16 sm:mb-24"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
            <motion.div variants={featureVariants} className="inline-flex items-center px-4 sm:px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm sm:text-base font-semibold border border-primary/20 shadow-lg backdrop-blur-sm mb-6 sm:mb-8">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
              Recursos Avançados
            </motion.div>
            <motion.h2 variants={featureVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8">
              Tecnologia que{" "}
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                transforma
              </span>
            </motion.h2>
            <motion.p variants={featureVariants} className="text-lg sm:text-2xl text-muted-foreground max-w-4xl mx-auto px-4 leading-relaxed">
              Nossa plataforma combina inteligência artificial, análise de dados e experiência do usuário 
              para revolucionar o cuidado com feridas
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            <motion.div variants={featureVariants}>
              <FeatureCard
                icon={Brain}
                title="Análise com IA"
                description="Utiliza Gemini 2.0 Flash para análise de imagens de feridas e geração de relatórios comparativos"
              />
            </motion.div>
            <motion.div variants={featureVariants}>
              <FeatureCard
                icon={FileText}
                title="Relatórios PDF"
                description="Geração de relatórios estruturados com protocolo terapêutico e referências bibliográficas"
              />
            </motion.div>
             <motion.div variants={featureVariants}>
                <FeatureCard
                  icon={Users}
                  title="Gestão de Pacientes"
                  description="Sistema TIMERS para avaliação estruturada e acompanhamento de pacientes"
                />
            </motion.div>
            <motion.div variants={featureVariants}>
                <FeatureCard
                  icon={BarChart3}
                  title="Comparação Temporal"
                  description="Análise comparativa de imagens com histogramas de cores e métricas de evolução"
                />
            </motion.div>
            <motion.div variants={featureVariants}>
                <FeatureCard
                  icon={Shield}
                  title="Segurança"
                  description="Autenticação Firebase, dados protegidos e conformidade com LGPD"
                />
            </motion.div>
            <motion.div variants={featureVariants}>
                <FeatureCard
                  icon={Zap}
                  title="Interface Moderna"
                  description="Design responsivo com sidebar animada e sistema de badges"
                />
            </motion.div>
             <motion.div variants={featureVariants}>
                <FeatureCard
                  icon={Heart}
                  title="Framework TIMERS"
                  description="Avaliação estruturada seguindo padrões clínicos para feridas"
                />
            </motion.div>
            <motion.div variants={featureVariants}>
                <FeatureCard
                  icon={Stethoscope}
                  title="Anamnese Digital"
                  description="Formulários inteligentes para coleta de dados clínicos estruturados"
                />
            </motion.div>
            <motion.div variants={featureVariants}>
                <FeatureCard
                  icon={Activity}
                  title="Dashboard Analytics"
                  description="Métricas de uso, produtividade e acompanhamento de atividades"
                />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/10 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Veja o <span className="text-primary">Heal+</span> em Ação
            </h2>
            <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Descubra como nossa plataforma simplifica a avaliação de feridas em menos de 2 minutos.
            </p>
          </div>
          <Card className="max-w-4xl mx-auto shadow-2xl border-border/50 overflow-hidden">
            <CardContent className="p-2 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-md"
                  src="https://www.youtube.com/embed/T2X_ZV_T-u0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/90">
          <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/95 via-primary/90 to-primary/95"></div>
              <div className="absolute top-1/4 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 left-1/4 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          <div className="container mx-auto text-center relative z-10">
              <div className="max-w-4xl mx-auto p-8 sm:p-12 lg:p-16 rounded-2xl bg-black/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-primary/10">
                  <div className="space-y-8 sm:space-y-10">
                      <div className="inline-flex items-center px-4 sm:px-6 py-3 rounded-full bg-white/10 text-white text-sm sm:text-base font-semibold border border-white/20 shadow-lg">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-300 animate-pulse" />
                          Junte-se à revolução da saúde
                      </div>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                          Pronto para <span className="bg-gradient-to-r from-blue-300 to-blue-200 bg-clip-text text-transparent">transformar</span> sua prática médica?
                      </h2>
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                          Sistema desenvolvido para auxiliar profissionais de saúde na avaliação e documentação de feridas com IA.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 sm:pt-6">
                          <Button size="lg" asChild className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl bg-white text-primary hover:bg-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                              <Link href="/signup">
                                  Começar Agora - É Grátis
                                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                              </Link>
                          </Button>
                          <Button size="lg" variant="ghost" asChild className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl text-white hover:bg-white/10 hover:text-white transition-all duration-300 transform hover:scale-105">
                              <Link href="/login">Já tenho conta</Link>
                          </Button>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 pt-6 sm:pt-8 text-sm text-blue-100">
                          <div className="flex items-center gap-2 cta-feature-badge px-3 py-1 rounded-full border-blue-300/30 bg-blue-400/10">
                              <CheckCircle className="w-4 h-4 text-blue-200" />
                              Sem compromisso
                          </div>
                          <div className="flex items-center gap-2 cta-feature-badge px-3 py-1 rounded-full border-blue-300/30 bg-blue-400/10">
                              <CheckCircle className="w-4 h-4 text-blue-200" />
                              Configuração em 5 minutos
                          </div>
                          <div className="flex items-center gap-2 cta-feature-badge px-3 py-1 rounded-full border-blue-300/30 bg-blue-400/10">
                              <CheckCircle className="w-4 h-4 text-blue-200" />
                              Suporte 24/7
                          </div>
                      </div>
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
                <a href="https://www.youtube.com/@GrupoHealplus" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-all duration-300 transform hover:scale-110" aria-label="YouTube">
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
                <Link href="/references" className="text-sm text-gray-300 hover:text-primary transition-colors hover:underline">
                  Referências
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
