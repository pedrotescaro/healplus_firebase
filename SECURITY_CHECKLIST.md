# Checklist de Segurança - Firebase Data Connect

## ✅ O que foi feito

- [x] Removidas chaves de API do código (expostas no `client-app.ts`)
- [x] Criado arquivo `.env.local` com configurações
- [x] Criado arquivo `.env.example` com template
- [x] Atualizado `apphosting.yaml` com variáveis de ambiente
- [x] Configuração do Code usa `process.env` para todas as chaves
- [x] Arquivo `.gitignore` já contém `.env*` (seguro!)
- [x] Criado exemplo de uso com `data-connect-app.ts`

## 🔐 Segurança por Tipo de Variável

| Variável | Tipo | Visibilidade | Local |
|----------|------|--------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public | Exposto ao cliente | Browser OK |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Public | Exposto ao cliente | Browser OK |
| `GEMINI_API_KEY` | Private | Apenas Servidor | Nunca no Browser |

## 🚀 Próximos Passos

### 1. Teste Localmente

```bash
# Copiar template
cp .env.example .env.local

# Editar com seus valores do Firebase Console
nano .env.local

# Com valores corretos, o servidor vai iniciar
npm run dev
```

### 2. Configurar no Firebase Console

1. Vá para Data Connect
2. Habilite e crie uma instância PostgreSQL
3. Copie o Connector ID para `.env.local`

### 3. Deploy em Vercel

```bash
# Fazer login no Vercel
vercel login

# Deploy (vai pedir variáveis de ambiente)
vercel

# Ou configurar no Dashboard: Settings > Environment Variables
```

### 4. Deploy em Firebase App Hosting

```bash
# Criar secrets
firebase secrets:create NEXT_PUBLIC_FIREBASE_API_KEY --data="your_key"
firebase secrets:create GEMINI_API_KEY --data="your_key"

# Deploy
firebase deploy
```

## 📋 Verificação Final

Execute este comando para verificar se as variáveis estão carregadas:

```bash
# No projeto root
npm run dev

# Abra o navegador em http://localhost:3000
# Abra DevTools (F12) > Console
# Execute:
console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
// Deve retornar seu project ID (não undefined)
```

## ⚠️ Erros Comuns

### "Firebase error: apiKey is empty"
→ Checar se `.env.local` existe e está preenchido corretamente

### "Data Connect connector not found"
→ Copiar o Connector ID correto do Firebase Console para `.env.local`

### "GEMINI_API_KEY undefined"
→ Usar apenas em server-side code, nunca expor no cliente

---

**Seu projeto está seguro! Nenhuma chave sensível está exposta no repositório.** ✅
