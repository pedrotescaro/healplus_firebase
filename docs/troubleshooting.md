# 🔧 Troubleshooting - Heal+

Este guia contém soluções para os problemas mais comuns encontrados ao usar o Heal+.

## 📋 Índice

- [Problemas de Instalação](#problemas-de-instalação)
- [Problemas de Firebase](#problemas-de-firebase)
- [Problemas de Autenticação](#problemas-de-autenticação)
- [Problemas de IA](#problemas-de-ia)
- [Problemas de Interface](#problemas-de-interface)
- [Problemas de Performance](#problemas-de-performance)
- [Problemas de Deploy](#problemas-de-deploy)

## 🚀 Problemas de Instalação

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

# Ou matar o processo na porta 3000
npx kill-port 3000
```

### **Erro: "Node.js version incompatible"**

```bash
# Verificar versão do Node.js
node --version

# Instalar Node.js 18+ (recomendado: 20.x LTS)
# Windows: https://nodejs.org/
# macOS: brew install node@20
# Linux: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

### **Erro: "npm install failed"**

```bash
# Limpar cache do npm
npm cache clean --force

# Usar yarn como alternativa
yarn install
```

## 🔥 Problemas de Firebase

### **Erro: "Missing or insufficient permissions"**

```bash
# Solução: Deploy das regras do Firestore
firebase deploy --only firestore:rules

# Ou configuração manual no Firebase Console
# 1. Acesse: https://console.firebase.google.com/
# 2. Selecione o projeto: woundwise-g3zb9
# 3. Vá para Firestore Database > Regras
# 4. Cole o conteúdo do arquivo firestore.rules
# 5. Clique em "Publicar"
```

### **Erro: "Firebase error. Please ensure that you have the URL"**

```bash
# Solução: Verificar configuração do Realtime Database
firebase use woundwise-g3zb9
firebase deploy --only database

# Verificar se a URL está correta no .env.local
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://woundwise-g3zb9-default-rtdb.firebaseio.com/
```

### **Erro: "Firebase app not initialized"**

```typescript
// Verificar se o arquivo .env.local está configurado corretamente
// Verificar se as variáveis começam com NEXT_PUBLIC_
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDX0mJJt5SW2L55Fs5SPWHsXP2gQHFbRPY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=woundwise-g3zb9.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=woundwise-g3zb9
```

### **Erro: "Firebase CLI not found"**

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Verificar instalação
firebase --version

# Fazer login
firebase login
```

## 🔐 Problemas de Autenticação

### **Erro: "Invalid API key"**

1. **Verificar chave Gemini**:
   ```bash
   # Verificar se a chave está no .env.local
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Obter nova chave**:
   - Acesse: https://aistudio.google.com/
   - Faça login com sua conta Google
   - Vá para "Get API Key"
   - Crie uma nova chave API

### **Erro: "Authentication failed"**

```typescript
// Verificar se o usuário está logado
const { user, loading } = useAuth();

if (loading) return <LoadingSpinner />;
if (!user) return <LoginForm />;
```

### **Erro: "Google sign-in failed"**

1. **Verificar configuração**:
   - Acesse: https://console.firebase.google.com/
   - Vá para Authentication > Sign-in method
   - Verifique se Google está habilitado

2. **Verificar domínios autorizados**:
   - Adicione localhost:3000 para desenvolvimento
   - Adicione seu domínio de produção

## 🤖 Problemas de IA

### **Erro: "AI analysis failed"**

```typescript
// Verificar se a imagem está sendo enviada corretamente
const imageData = await fileToDataUri(file);
if (!imageData) {
  throw new Error('Falha ao processar imagem');
}
```

### **Erro: "Invalid image format"**

```typescript
// Verificar formatos suportados
const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
if (!supportedFormats.includes(file.type)) {
  throw new Error('Formato de imagem não suportado');
}
```

### **Erro: "Image too large"**

```typescript
// Verificar tamanho da imagem
const maxSize = 10 * 1024 * 1024; // 10MB
if (file.size > maxSize) {
  throw new Error('Imagem muito grande. Máximo 10MB.');
}
```

## 🎨 Problemas de Interface

### **Erro: "Component not found"**

```typescript
// Verificar se o componente está sendo importado corretamente
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

### **Erro: "CSS not loading"**

```bash
# Verificar se o Tailwind está configurado
npm run build

# Verificar se as classes estão sendo aplicadas
# Usar o DevTools para inspecionar elementos
```

### **Erro: "Responsive design broken"**

```typescript
// Verificar classes responsivas do Tailwind
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Conteúdo */}
</div>
```

## ⚡ Problemas de Performance

### **Erro: "Slow loading"**

```bash
# Verificar bundle size
npm run build
npm run analyze

# Otimizar imagens
# Usar next/image para imagens
import Image from 'next/image';
```

### **Erro: "Memory leak"**

```typescript
// Verificar se os event listeners estão sendo removidos
useEffect(() => {
  const handleResize = () => {
    // lógica
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

### **Erro: "Too many re-renders"**

```typescript
// Verificar se as dependências do useEffect estão corretas
useEffect(() => {
  // lógica
}, [dependency1, dependency2]); // Dependências corretas
```

## 🚀 Problemas de Deploy

### **Erro: "Build failed"**

```bash
# Verificar erros de build
npm run build

# Verificar se todas as dependências estão instaladas
npm install

# Verificar se as variáveis de ambiente estão configuradas
```

### **Erro: "Deploy failed"**

```bash
# Verificar se está logado no Firebase
firebase login

# Verificar se o projeto está configurado
firebase use woundwise-g3zb9

# Deploy passo a passo
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

### **Erro: "Environment variables not found"**

```bash
# Verificar se as variáveis estão no .env.local
# Verificar se começam com NEXT_PUBLIC_
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_GEMINI_API_KEY=...
```

## 🔍 Debugging

### **Console do Navegador**

```typescript
// Adicionar logs para debug
console.log('Debug info:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### **React DevTools**

```typescript
// Usar React DevTools para inspecionar componentes
// Verificar props, state e hooks
```

### **Firebase Console**

```bash
# Verificar logs no Firebase Console
# Acesse: https://console.firebase.google.com/
# Vá para Functions > Logs
```

## 📞 Suporte

### **Recursos de Ajuda**

1. **Documentação**: [docs/README.md](README.md)
2. **GitHub Issues**: [Abrir Issue](https://github.com/seu-usuario/healplus/issues)
3. **Email**: suporte@healplus.com
4. **Discord**: [Comunidade Heal+](https://discord.gg/healplus)

### **Informações para Suporte**

Ao reportar um problema, inclua:

- **Sistema operacional**: Windows, macOS, Linux
- **Versão do Node.js**: `node --version`
- **Versão do npm**: `npm --version`
- **Mensagem de erro completa**
- **Passos para reproduzir**
- **Screenshots** (se aplicável)

### **Logs Úteis**

```bash
# Logs do sistema
npm run dev 2>&1 | tee logs.txt

# Logs do Firebase
firebase functions:log

# Logs do navegador
# Abra DevTools > Console
```

## 🎯 Prevenção de Problemas

### **Boas Práticas**

1. **Mantenha dependências atualizadas**:
   ```bash
   npm update
   npm audit fix
   ```

2. **Use TypeScript**:
   ```bash
   npm run type-check
   ```

3. **Execute testes**:
   ```bash
   npm run test
   ```

4. **Verifique linting**:
   ```bash
   npm run lint
   ```

5. **Backup regular**:
   ```bash
   git add .
   git commit -m "Backup antes de mudanças"
   ```

---

**🔧 Se não encontrou a solução aqui, entre em contato conosco!**
