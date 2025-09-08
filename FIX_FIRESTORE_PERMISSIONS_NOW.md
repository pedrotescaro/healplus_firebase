# 🚨 CORREÇÃO URGENTE - Permissões do Firestore

## ❌ **PROBLEMA ATUAL**

Você está recebendo erros de permissão ao tentar salvar relatórios:

```
Error generating report: FirebaseError: Missing or insufficient permissions.
```

**URL com problema**: https://studio--woundwise-g3zb9.us-central1.hosted.app/dashboard/report

## ✅ **SOLUÇÃO IMEDIATA**

### **Passo 1: Acessar Firebase Console**

1. **Abra o navegador** e vá para: https://console.firebase.google.com/
2. **Faça login** com sua conta Google
3. **Selecione o projeto**: `woundwise-g3zb9`

### **Passo 2: Atualizar Regras do Firestore**

1. **No menu lateral**, clique em **"Firestore Database"**
2. **Vá para a aba "Regras"**
3. **Substitua TODO o conteúdo** pelas regras abaixo:

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

4. **Clique em "Publicar"**

### **Passo 3: Verificar Realtime Database**

1. **No menu lateral**, clique em **"Realtime Database"**
2. **Vá para a aba "Regras"**
3. **Substitua o conteúdo** pelas regras abaixo:

```json
{
  "rules": {
    "images": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "conversations": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

4. **Clique em "Publicar"**

### **Passo 4: Aguardar Propagação**

- **Aguarde 2-3 minutos** para as regras entrarem em vigor
- **Recarregue a página** do aplicativo
- **Teste novamente** a geração de relatórios

## 🔍 **VERIFICAÇÃO**

### **Teste 1: Verificar Regras Aplicadas**

1. **Volte para Firestore Database > Regras**
2. **Confirme** que as regras foram salvas
3. **Verifique** se não há erros de sintaxe

### **Teste 2: Testar Aplicação**

1. **Acesse**: https://studio--woundwise-g3zb9.us-central1.hosted.app/dashboard/report
2. **Tente gerar** um relatório
3. **Verifique** se não há mais erros de permissão

### **Teste 3: Console do Navegador**

1. **Abra DevTools** (F12)
2. **Vá para Console**
3. **Não deve haver** erros de "Missing or insufficient permissions"

## 🚨 **SE AINDA NÃO FUNCIONAR**

### **Opção 1: Regras Temporárias (APENAS PARA TESTE)**

Se as regras acima não funcionarem, use estas regras temporárias **APENAS PARA TESTE**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **ATENÇÃO**: Estas regras são menos seguras. Use apenas para teste e depois volte para as regras originais.

### **Opção 2: Verificar Autenticação**

1. **Confirme** que você está logado
2. **Verifique** se o usuário tem UID válido
3. **Teste** com outro usuário

### **Opção 3: Limpar Cache**

1. **Limpe o cache** do navegador
2. **Recarregue** a página
3. **Faça logout** e login novamente

## 📞 **SUPORTE**

Se o problema persistir:

1. **Verifique** se você tem permissões de administrador no projeto Firebase
2. **Confirme** que está no projeto correto: `woundwise-g3zb9`
3. **Entre em contato** via email: suporte@healplus.com

## ✅ **RESULTADO ESPERADO**

Após aplicar as correções:

- ✅ **Sem erros** de permissão no console
- ✅ **Geração de relatórios** funcionando
- ✅ **Salvamento** no Firestore funcionando
- ✅ **Sistema estável** e funcional

---

**🚀 Aplique essas correções AGORA para resolver o problema de permissões!**
