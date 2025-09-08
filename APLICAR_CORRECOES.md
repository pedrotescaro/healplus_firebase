# 🚀 Aplicar Correções via Git Bash

## 📋 **Opções Disponíveis**

### **Opção 1: Git Bash (Recomendado)**

1. **Abra o Git Bash** no diretório do projeto
2. **Execute o script**:
   ```bash
   ./fix-firebase-permissions.sh
   ```

### **Opção 2: PowerShell**

1. **Abra o PowerShell** como administrador
2. **Navegue para o diretório**:
   ```powershell
   cd C:\Users\SALA\Documents\GitHub\healplus
   ```
3. **Execute o script**:
   ```powershell
   .\fix-firebase-permissions.ps1
   ```

### **Opção 3: Comandos Manuais**

Se os scripts não funcionarem, execute os comandos manualmente:

#### **1. Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

#### **2. Fazer Login**
```bash
firebase login
```

#### **3. Configurar Projeto**
```bash
firebase use woundwise-g3zb9
```

#### **4. Aplicar Regras**
```bash
firebase deploy --only firestore:rules
firebase deploy --only database
```

## 🔧 **Se Firebase CLI Não Funcionar**

### **Método Manual (Firebase Console)**

1. **Acesse**: https://console.firebase.google.com/
2. **Selecione**: `woundwise-g3zb9`
3. **Vá para**: Firestore Database > Regras
4. **Cole as regras**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção 'users'
    match /users/{userId} {
      // Usuários autenticados podem ler/escrever seus próprios documentos
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Permitir listagem para usuários autenticados
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

5. **Clique em "Publicar"**

## 🧪 **Teste de Verificação**

Após aplicar as correções, teste se funcionou:

1. **Acesse**: https://studio--woundwise-g3zb9.us-central1.hosted.app/dashboard/report
2. **Tente gerar** um relatório
3. **Verifique** se não há mais erros de permissão

## 📞 **Suporte**

Se ainda houver problemas:

1. **Verifique** o arquivo `FIX_FIRESTORE_PERMISSIONS_NOW.md`
2. **Execute** o script de teste `test-firestore-permissions.js`
3. **Entre em contato**: suporte@healplus.com

---

**🚀 Escolha uma das opções acima e aplique as correções!**
