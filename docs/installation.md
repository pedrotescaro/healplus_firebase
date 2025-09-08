# 🚀 Instalação e Configuração - Heal+

## 📋 Pré-requisitos

### **Sistema Operacional**
- **Windows 10/11** ou **macOS 10.15+** ou **Linux Ubuntu 18.04+**
- **Node.js 18.0+** (recomendado: 20.x LTS)
- **npm 9.0+** ou **yarn 1.22+**
- **Git 2.30+**

### **Contas Necessárias**
- **Conta Google** (para Firebase e Gemini AI)
- **Conta GitHub** (para repositório)
- **Acesso ao Firebase Console**
- **Chave API do Google Gemini**

## 🔧 Instalação Passo a Passo

### **1. Clone o Repositório**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/healplus.git
cd healplus

# Verifique a versão do Node.js
node --version  # Deve ser 18.0+
npm --version   # Deve ser 9.0+
```

### **2. Instale as Dependências**

```bash
# Instalação com npm
npm install

# OU instalação com yarn
yarn install

# Verifique se não há erros
npm run build
```

### **3. Configure as Variáveis de Ambiente**

Crie o arquivo `.env.local` na raiz do projeto:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDX0mJJt5SW2L55Fs5SPWHsXP2gQHFbRPY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=woundwise-g3zb9.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=woundwise-g3zb9
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=woundwise-g3zb9.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=315167035013
NEXT_PUBLIC_FIREBASE_APP_ID=1:315167035013:web:189654d5723c779cf963ec
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://woundwise-g3zb9-default-rtdb.firebaseio.com/

# Google AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# API Configuration
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_AI_BASE=http://localhost:5000
```

### **4. Configure o Firebase**

#### **4.1. Instale o Firebase CLI**

```bash
# Instalação global
npm install -g firebase-tools

# Verifique a instalação
firebase --version
```

#### **4.2. Faça Login no Firebase**

```bash
# Login no Firebase
firebase login

# Verifique se está logado
firebase projects:list
```

#### **4.3. Configure o Projeto**

```bash
# Use o projeto correto
firebase use woundwise-g3zb9

# Verifique a configuração
firebase projects:list
```

### **5. Configure as Regras do Firestore**

#### **5.1. Deploy das Regras (Recomendado)**

```bash
# Deploy das regras do Firestore
firebase deploy --only firestore:rules

# Deploy das regras do Realtime Database
firebase deploy --only database
```

#### **5.2. Configuração Manual (Alternativa)**

Se não conseguir usar o Firebase CLI:

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: `woundwise-g3zb9`
3. Vá para **Firestore Database** > **Regras**
4. Cole o conteúdo do arquivo `firestore.rules`
5. Clique em **Publicar**

### **6. Configure o Google Gemini AI**

#### **6.1. Obtenha a Chave API**

1. Acesse: https://aistudio.google.com/
2. Faça login com sua conta Google
3. Vá para **Get API Key**
4. Crie uma nova chave API
5. Copie a chave e cole no `.env.local`

#### **6.2. Teste a Configuração**

```bash
# Teste se a chave está funcionando
npm run test:ai
```

### **7. Execute o Projeto**

#### **7.1. Modo Desenvolvimento**

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# O projeto estará disponível em:
# http://localhost:3000
```

#### **7.2. Build para Produção**

```bash
# Build do projeto
npm run build

# Inicie o servidor de produção
npm start
```

## 🔍 Verificação da Instalação

### **1. Teste de Conectividade**

```bash
# Teste Firebase
npm run test:firebase

# Teste Gemini AI
npm run test:ai

# Teste completo
npm run test
```

### **2. Verificação Manual**

1. **Acesse**: http://localhost:3000
2. **Teste o Login**: Crie uma conta ou faça login
3. **Teste a Anamnese**: Crie uma nova avaliação
4. **Teste a IA**: Gere um relatório
5. **Verifique o Console**: Não deve haver erros

### **3. Checklist de Verificação**

- [ ] **Node.js 18+** instalado
- [ ] **Dependências** instaladas sem erros
- [ ] **Variáveis de ambiente** configuradas
- [ ] **Firebase CLI** instalado e logado
- [ ] **Regras do Firestore** deployadas
- [ ] **Chave Gemini AI** configurada
- [ ] **Projeto executando** em localhost:3000
- [ ] **Login funcionando**
- [ ] **Criação de anamnese** funcionando
- [ ] **Geração de relatórios** funcionando

## 🚨 Troubleshooting

### **Erro: "Missing or insufficient permissions"**

```bash
# Solução: Deploy das regras do Firestore
firebase deploy --only firestore:rules
```

### **Erro: "Firebase error. Please ensure that you have the URL"**

```bash
# Solução: Verificar configuração do Realtime Database
firebase use woundwise-g3zb9
firebase deploy --only database
```

### **Erro: "Module not found"**

```bash
# Solução: Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### **Erro: "Port 3000 already in use"**

```bash
# Solução: Usar porta diferente
npm run dev -- -p 3001
```

### **Erro: "Invalid API key"**

1. Verifique se a chave Gemini está correta no `.env.local`
2. Confirme se a chave está ativa no Google AI Studio
3. Reinicie o servidor após alterar variáveis

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. **Leia o [Guia de Primeiros Passos](getting-started.md)**
2. **Explore a [Arquitetura](architecture.md)**
3. **Configure o [Sistema TIMERS](timers-framework.md)**
4. **Teste as [Funcionalidades](getting-started.md)**

## 🆘 Suporte

Se encontrar problemas:

1. **Verifique os logs** no console do navegador
2. **Consulte o [Troubleshooting](troubleshooting.md)**
3. **Abra uma issue** no GitHub
4. **Entre em contato** via email: suporte@healplus.com

---

**✅ Instalação concluída com sucesso!**
