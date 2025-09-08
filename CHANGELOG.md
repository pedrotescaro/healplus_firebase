# 📝 Changelog - Heal+

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado
- Documentação completa do projeto
- Guia de instalação e configuração
- Guia de primeiros passos
- Guia de desenvolvimento
- Guia de contribuição
- Troubleshooting abrangente

## [1.0.0] - 2025-01-08

### Adicionado
- Sistema de autenticação com Firebase
- Login com Google, Microsoft, Apple e Email/Senha
- Framework TIMERS para avaliação de feridas
- Análise de imagens com IA (Google Gemini)
- Geração de relatórios em PDF
- Chat inteligente com assistente Zelo
- Interface responsiva e moderna
- Sistema de temas (claro/escuro)
- Landing page completa
- FAQ e seção de planos
- Sistema de anamnese completo
- Captura e upload de imagens
- Armazenamento de imagens como data URIs
- Comparação de progressões
- Dashboard para profissionais e pacientes
- Sistema de perfil de usuário
- Agenda inteligente
- Analytics básicos

### Corrigido
- Problemas de permissão do Firestore
- Avisos do Firebase Realtime Database
- Responsividade da página de anamnese
- Duplicação de sliders
- Espaço extra na parte inferior
- Erros de linting no report-generator
- Problemas de armazenamento de imagens
- Configuração do Firebase
- Regras de segurança do Firestore

### Alterado
- Sistema de armazenamento de imagens (de Realtime Database para Firestore)
- Regras do Firestore simplificadas
- Interface de login modernizada
- Landing page redesenhada
- Logo atualizado para "Heal" com gradiente azul
- Footer da landing page atualizado
- Remoção de botão de acessibilidade
- Melhoria na responsividade geral

### Removido
- Dependência do ImageStorageService para anamnese
- Dependência do ImageRetrievalService para anamnese
- Opções de login social (GitHub, Facebook, Twitter)
- Duplicação de texto "Heal+" na landing page
- Botão de acessibilidade do footer

## [0.9.0] - 2025-01-07

### Adicionado
- Sistema básico de anamnese
- Integração com Firebase
- Interface básica do dashboard
- Sistema de autenticação inicial

### Corrigido
- Problemas de configuração inicial
- Erros de build

## [0.8.0] - 2025-01-06

### Adicionado
- Estrutura inicial do projeto
- Configuração do Next.js
- Configuração do TypeScript
- Configuração do Tailwind CSS
- Configuração do Firebase

---

## 🔄 Tipos de Mudanças

- **Adicionado** - para novas funcionalidades
- **Alterado** - para mudanças em funcionalidades existentes
- **Depreciado** - para funcionalidades que serão removidas
- **Removido** - para funcionalidades removidas
- **Corrigido** - para correções de bugs
- **Segurança** - para vulnerabilidades

## 📋 Formato das Versões

Este projeto usa [Semantic Versioning](https://semver.org/lang/pt-BR/):

- **MAJOR** (1.0.0): Mudanças incompatíveis na API
- **MINOR** (0.1.0): Funcionalidades adicionadas de forma compatível
- **PATCH** (0.0.1): Correções de bugs compatíveis

## 🎯 Próximas Versões

### [1.1.0] - Planejado
- [ ] Sistema de notificações
- [ ] Integração com FHIR
- [ ] Analytics avançados
- [ ] Sistema de backup automático
- [ ] API REST completa

### [1.2.0] - Planejado
- [ ] App mobile (React Native)
- [ ] Integração com prontuários eletrônicos
- [ ] Sistema de telemedicina
- [ ] IA para predição de cicatrização
- [ ] Sistema de alertas inteligentes

### [2.0.0] - Planejado
- [ ] Arquitetura microserviços
- [ ] Sistema de plugins
- [ ] Integração com wearables
- [ ] IA generativa para relatórios
- [ ] Sistema de gamificação

---

**📝 Para mais detalhes sobre as mudanças, consulte os [commits](https://github.com/seu-usuario/healplus/commits/main) no GitHub.**
