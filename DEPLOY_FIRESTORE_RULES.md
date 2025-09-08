# 🚀 Deploy das Regras do Firestore - Heal+

## 📋 Regras Atualizadas

Copie e cole as regras abaixo no Firebase Console:

### **Firestore Rules**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
  
    // Regras para a coleção 'users'
    match /users/{userId} {
      // Usuários autenticados podem ler/escrever seus próprios documentos
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Permitir listagem para usuários autenticados (para busca de pacientes)
      allow list: if request.auth != null;
    }

    // Regras para subcoleções dentro de 'users' (anamnesis, reports, assessments, etc.)
    match /users/{userId}/{collection}/{docId} {
      // Usuários autenticados podem ler/escrever suas próprias subcoleções
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Permitir listagem para usuários autenticados
      allow list: if request.auth != null;
    }
    
    // Regras para a coleção 'chats'
    match /chats/{chatId} {
    	allow read, update, delete: if request.auth != null && request.auth.uid in resource.data.participants;
      allow create: if request.auth != null && request.auth.uid in request.resource.data.participants;
      
      // Regras para a subcoleção 'messages'
      match /messages/{messageId} {
      	allow read: if request.auth != null && get(/databases/$(database)/documents/chats/$(chatId)).data.participants.hasAny([request.auth.uid]);
        allow create: if request.auth != null && get(/databases/$(database)/documents/chats/$(chatId)).data.participants.hasAny([request.auth.uid])
                      && request.resource.data.senderId == request.auth.uid;
      }
    }
  }
}
```

## 🔧 Como Aplicar

### **Passo 1: Acessar Firebase Console**
1. Vá para: https://console.firebase.google.com/
2. Selecione o projeto: `woundwise-g3zb9`

### **Passo 2: Atualizar Regras do Firestore**
1. No menu lateral, clique em **"Firestore Database"**
2. Vá para a aba **"Regras"**
3. **Substitua todo o conteúdo** pelas regras acima
4. Clique em **"Publicar"**

### **Passo 3: Verificar**
1. Aguarde alguns segundos para propagação
2. Teste o sistema novamente
3. Os erros de permissão devem desaparecer

## ✅ O que essas regras fazem:

- ✅ **Permitem** que usuários autenticados leiam/escrevam seus próprios dados
- ✅ **Permitem** listagem de usuários para busca de pacientes
- ✅ **Permitem** operações em subcoleções (anamnesis, reports, assessments)
- ✅ **Mantêm** segurança básica (apenas usuários autenticados)
- ✅ **Simplificam** as regras para evitar erros de permissão

## 🚨 Importante:

- **Aguarde 1-2 minutos** após publicar para as regras entrarem em vigor
- **Teste** criando uma nova anamnese após o deploy
- **Verifique** o console do navegador para confirmar que não há mais erros

---

**✅ Após aplicar essas regras, o sistema deve funcionar normalmente!**
