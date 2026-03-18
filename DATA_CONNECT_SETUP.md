# Firebase Data Connect Setup Guide

## O que mudou?

Seu projeto foi migrado para usar **Firebase Data Connect** com **PostgreSQL** em vez do Realtime Database. Todas as chaves de API foram removidas do código e agora usam variáveis de ambiente.

## Passos de Configuração

### 1. Configure as Variáveis de Ambiente

Copie o arquivo `.env.example` e renomeie para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione seus valores reais do Firebase Console.

### 2. Habilitar Firebase Data Connect

No Firebase Console:

1. Vá para **Data Connect** (em Produtos)
2. Clique em **Habilitar Data Connect**
3. Escolha ou crie uma instância do Cloud SQL (PostgreSQL)
4. Copie o **Connector ID** e adicione em `.env.local`

```
NEXT_PUBLIC_DATA_CONNECT_CONNECTOR_ID=seu_connector_id
```

### 3. Definir Variáveis em Produção (Vercel)

Add no Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_DATA_CONNECT_CONNECTOR_ID
GEMINI_API_KEY
```

### 4. Exemplo de Uso com Data Connect

```typescript
import { initializeApp } from "firebase/app";
import { getDataConnect } from "firebase/data-connect";

// Configuration loaded from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... outros campos
};

const app = initializeApp(firebaseConfig);

// Usar Data Connect
const dataConnect = getDataConnect();

// Exemplo de query SQL via Data Connect
// Você definirá as queries no Firebase Console
```

## Segurança

✅ **Nenhuma chave de API exposta no repositório**
✅ **Variáveis de ambiente usadas em produção**
✅ **Arquivo `.env.local` está no .gitignore**
✅ **Apenas valores públicos começam com `NEXT_PUBLIC_`**

## Variáveis Privadas (Servidor)

O `GEMINI_API_KEY` é privado e **não começa com `NEXT_PUBLIC_`**, então:
- É seguro em produção (Vercel)
- Não é exposto ao cliente
- Use apenas em funções server-side

```typescript
// ✅ Seguro - Server-side
const apiKey = process.env.GEMINI_API_KEY;

// ❌ Evitar - Seria exposto
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
```

## Firebase App Hosting Secrets

O `apphosting.yaml` foi atualizado com todas as variáveis necessárias como secrets:

```bash
# Deploy secrets para Firebase App Hosting:
firebase secrets:create NEXT_PUBLIC_FIREBASE_API_KEY --data="seu_valor"
firebase secrets:create GEMINI_API_KEY --data="seu_valor"
# ... etc
```

## Próximos Passos

1. ✅ Configure as variáveis de ambiente localmente
2. ✅ Habilite Data Connect no Firebase Console
3. ✅ Teste localmente: `npm run dev`
4. ✅ Configure secrets em Vercel
5. ✅ Deploy: `vercel`

---

**IMPORTANTE**: Nunca commite o arquivo `.env.local` com valores reais. Use `.env.example` como template.
