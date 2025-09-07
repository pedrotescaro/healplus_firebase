# 🏥 HealPlus - Sistema Inteligente de Avaliação de Feridas

<div align="center">

![HealPlus Logo](https://img.shields.io/badge/HealPlus-Healthcare%20AI-blue?style=for-the-badge&logo=medical-cross)

**Sistema de análise de feridas com Inteligência Artificial para profissionais de saúde**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini-purple?style=flat-square&logo=google)](https://ai.google.dev/)

</div>

## 📋 Sobre o Projeto

O **HealPlus** é uma plataforma inovadora que utiliza Inteligência Artificial para auxiliar profissionais de saúde na avaliação, análise e acompanhamento de feridas. O sistema combina o framework TIMERS com tecnologia de visão computacional para gerar relatórios clínicos precisos e comparativos.

### 🎯 Objetivo

Democratizar o acesso a análises especializadas de feridas, fornecendo ferramentas de IA que auxiliam profissionais de saúde na tomada de decisões clínicas baseadas em evidências visuais e dados estruturados.

## ✨ Funcionalidades Principais

### 🔬 **Análise de Feridas com IA**
- **Análise de Imagens**: Processamento inteligente de imagens de feridas
- **Classificação Automática**: Identificação de tipos de tecido (granulação, esfacelo, necrose)
- **Medição Precisa**: Cálculo automático de área, perímetro e dimensões
- **Avaliação de Progressão**: Análise temporal da cicatrização

### 📊 **Geração de Relatórios**
- **Relatórios Estruturados**: Documentação clínica padronizada
- **Análise Comparativa**: Comparação entre diferentes momentos de avaliação
- **Exportação PDF**: Relatórios profissionais para prontuários
- **Linguagem Clínica**: Terminologia médica apropriada

### 📝 **Sistema de Anamnese TIMERS**
- **Framework TIMERS**: Avaliação estruturada de feridas
- **Formulários Inteligentes**: Interface guiada para coleta de dados
- **Histórico Completo**: Acompanhamento longitudinal dos casos
- **Validação de Dados**: Verificação automática de consistência

### 👥 **Gestão de Usuários**
- **Perfis Diferenciados**: Profissionais de saúde e pacientes
- **Autenticação Segura**: Sistema de login com Firebase Auth
- **Controle de Acesso**: Permissões baseadas em roles
- **Dados Protegidos**: Conformidade com LGPD

### 📅 **Agenda e Acompanhamento**
- **Agenda Inteligente**: Retornos automáticos baseados em avaliações
- **Notificações**: Lembretes de reavaliações
- **Histórico Clínico**: Acompanhamento completo do paciente
- **Dashboard Analytics**: Métricas de produtividade

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Next.js 15.3.3** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Radix UI** - Componentes acessíveis
- **Framer Motion** - Animações fluidas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### **Backend & Infraestrutura**
- **Firebase** - Backend as a Service
  - **Firestore** - Banco de dados NoSQL
  - **Authentication** - Autenticação de usuários
  - **Storage** - Armazenamento de imagens
- **Google AI (Gemini)** - Inteligência Artificial
- **Genkit** - Framework para AI workflows

### **Ferramentas de Desenvolvimento**
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **PostCSS** - Processamento de CSS
- **jsPDF** - Geração de PDFs

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta Firebase
- Chave API do Google Gemini

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/healplus.git
cd healplus
```

### **2. Instale as Dependências**
```bash
npm install
# ou
yarn install
```

### **3. Configure as Variáveis de Ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### **4. Configure o Firebase**
```bash
# Instale o Firebase CLI
npm install -g firebase-tools

# Faça login no Firebase
firebase login

# Configure o projeto
firebase use your-project-id

# Deploy das regras do Firestore
firebase deploy --only firestore:rules
```

### **5. Execute o Projeto**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 📱 Como Usar

### **Para Profissionais de Saúde**

1. **Cadastro e Login**
   - Acesse a plataforma e crie sua conta profissional
   - Faça login com suas credenciais

2. **Criar Nova Avaliação**
   - Navegue para "Nova Avaliação"
   - Preencha o formulário TIMERS com os dados do paciente
   - Faça upload da imagem da ferida

3. **Gerar Relatório**
   - Acesse "Gerar Relatório"
   - Selecione a avaliação desejada
   - Aguarde a análise da IA
   - Revise e exporte o relatório em PDF

4. **Comparar Progressão**
   - Use "Comparar Relatórios" para analisar evolução
   - Visualize mudanças quantitativas e qualitativas
   - Gere relatórios comparativos

### **Para Pacientes**

1. **Acesso aos Relatórios**
   - Faça login com suas credenciais
   - Visualize seus relatórios de avaliação
   - Acompanhe a progressão do tratamento

## 🏗️ Arquitetura do Sistema

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── dashboard/         # Páginas do dashboard
│   ├── login/            # Autenticação
│   └── layout.tsx        # Layout principal
├── components/           # Componentes React
│   ├── dashboard/        # Componentes do dashboard
│   ├── ui/              # Componentes de interface
│   └── auth/            # Componentes de autenticação
├── lib/                 # Utilitários e configurações
│   ├── anamnesis-schema.ts  # Schema de validação
│   └── i18n.ts          # Internacionalização
├── ai/                  # Fluxos de IA
│   └── flows/           # Workflows do Gemini
├── hooks/               # Custom hooks
└── firebase/            # Configuração Firebase
```

### Documentação detalhada

- Arquitetura: docs/architecture.md
- Modelo de dados (TIMERS + FHIR): docs/data-model.md
- APIs e contratos: docs/apis.md
- Roadmap 90 dias: docs/roadmap.md
- KPIs e métricas: docs/kpis.md
- Compliance (ANVISA/LGPD/Segurança): docs/compliance.md

### Exportar documentação em PDF

- Guia: docs/EXPORT.md
- Comando: `npm run export:docs`

### Serviços locais (stubs)

- API Gateway: `npm run services:api` (porta 4000)
- AI Engine: `npm run services:ai` (porta 5000)

## 🔒 Segurança e Privacidade

- **Autenticação Segura**: Firebase Authentication com múltiplos provedores
- **Dados Criptografados**: Transmissão e armazenamento seguros
- **Controle de Acesso**: Regras de segurança do Firestore
- **LGPD Compliance**: Conformidade com a Lei Geral de Proteção de Dados
- **Auditoria**: Logs de acesso e modificações

## 📊 Métricas e Analytics

- **Dashboard Analytics**: Métricas de uso e produtividade
- **Relatórios de Performance**: Análise de eficiência do sistema
- **Monitoramento de IA**: Acompanhamento da precisão das análises
- **Feedback Loop**: Sistema de melhoria contínua

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Código**
- Use TypeScript para tipagem
- Siga as convenções do ESLint
- Escreva testes para novas funcionalidades
- Documente APIs e componentes

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/healplus/wiki)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/healplus/issues)
- **Email**: suporte@healplus.com
- **Discord**: [Comunidade HealPlus](https://discord.gg/healplus)

## 🙏 Agradecimentos

- **Google AI** - Pela API Gemini
- **Firebase** - Pela infraestrutura robusta
- **Next.js Team** - Pelo framework excepcional
- **Comunidade Open Source** - Pelas bibliotecas incríveis

---

<div align="center">

**Desenvolvido com ❤️ para melhorar o cuidado em saúde**

[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Firebase](https://img.shields.io/badge/Powered%20by-Firebase-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![AI Powered](https://img.shields.io/badge/AI%20Powered-Google%20Gemini-purple?style=for-the-badge&logo=google)](https://ai.google.dev/)

</div>
