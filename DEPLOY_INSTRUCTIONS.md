# Instruções para Deploy das Regras Firebase

## Problemas Identificados e Soluções

### 1. Firebase Realtime Database não configurado
✅ **RESOLVIDO**: Adicionada a URL do Realtime Database na configuração:
```javascript
databaseURL: "https://woundwise-g3zb9-default-rtdb.firebaseio.com/"
```

**Configuração atualizada**:
- ✅ Storage Bucket corrigido: `woundwise-g3zb9.firebasestorage.app`
- ✅ Realtime Database URL adicionada
- ✅ Todas as configurações sincronizadas

### 2. Permissões insuficientes no Firestore
✅ **RESOLVIDO**: Atualizadas as regras do Firestore para permitir que profissionais leiam dados de pacientes.

## Como fazer o Deploy das Regras

### Opção 1: Via Firebase Console (Recomendado)
1. Acesse: https://console.firebase.google.com/project/woundwise-g3zb9
2. Vá para **Firestore Database** > **Regras**
3. Cole o conteúdo do arquivo `firestore.rules` e clique em **Publicar**
4. Vá para **Realtime Database** > **Regras**
5. Cole o conteúdo do arquivo `database.rules.json` e clique em **Publicar**

### Opção 2: Via Firebase CLI
```bash
# Instalar Firebase CLI (se não estiver instalado)
npm install -g firebase-tools

# Fazer login
firebase login

# Deploy das regras
firebase deploy --only firestore:rules,database
```

### Opção 3: Via PowerShell (Windows)
```powershell
# Habilitar execução de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Instalar Firebase CLI
npm install -g firebase-tools

# Fazer login
firebase login

# Deploy das regras
firebase deploy --only firestore:rules,database
```

## Regras Atualizadas

### Firestore Rules (`firestore.rules`)
- ✅ Profissionais podem ler dados de pacientes
- ✅ Usuários podem ler/escrever seus próprios dados
- ✅ Pacientes podem ler relatórios criados para eles

### Realtime Database Rules (`database.rules.json`)
- ✅ Usuários podem ler/escrever suas próprias imagens
- ✅ Sistema de conversas com permissões adequadas
- ✅ Estrutura hierárquica para organização

## Verificação
Após o deploy, os erros devem desaparecer:
- ❌ `Firebase error. Please ensure that you have the URL of your Firebase Realtime Database instance configured correctly`
- ❌ `Missing or insufficient permissions`

### Teste de Conexão
Para testar se tudo está funcionando, você pode executar o teste de conexão:

```javascript
import { runFirebaseTests } from '@/lib/firebase-test';

// No console do navegador ou em um componente
runFirebaseTests();
```

Isso testará:
- ✅ Conexão com Realtime Database
- ✅ Conexão com Firestore
- ✅ Operações de leitura/escrita

## Estrutura do Realtime Database
```
images/
├── {userId}/
│   ├── anamnesis/
│   ├── profile-pictures/
│   └── assessments/
│       └── {assessmentId}/
conversations/
├── {conversationId}/
│   └── messages/
```
