# 🚨 CORREÇÃO ESPECÍFICA - Erro ao Salvar Relatórios

## ❌ **PROBLEMA IDENTIFICADO**

O erro está ocorrendo na função `handleSubmit` do `ReportGenerator` na linha 139-147:

```typescript
await addDoc(collection(db, "users", user.uid, "reports"), {
  anamnesisId: selectedAnamnesisId,
  patientName: selectedRecord.nome_cliente,
  reportContent: result.report,
  woundImageUri: selectedRecord.woundImageUri,
  professionalId: user.uid,
  patientId: selectedRecord.patientId || "", 
  createdAt: serverTimestamp(),
});
```

**Erro**: `FirebaseError: Missing or insufficient permissions`

## ✅ **SOLUÇÃO IMEDIATA**

### **Passo 1: Aplicar Regras do Firestore**

1. **Acesse**: https://console.firebase.google.com/
2. **Selecione**: `woundwise-g3zb9`
3. **Vá para**: Firestore Database > Regras
4. **Substitua** por estas regras:

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

### **Passo 2: Verificar Estrutura de Dados**

O código está tentando salvar em:
```
users/{userId}/reports/{reportId}
```

Certifique-se de que a estrutura está correta no Firestore.

### **Passo 3: Teste Imediato**

1. **Aguarde 2-3 minutos** para propagação
2. **Acesse**: https://studio--woundwise-g3zb9.us-central1.hosted.app/dashboard/report
3. **Tente gerar** um relatório
4. **Verifique** se não há mais erros

## 🔍 **VERIFICAÇÃO ADICIONAL**

### **Teste 1: Verificar Autenticação**

```javascript
// No console do navegador (F12)
console.log('User:', firebase.auth().currentUser);
console.log('UID:', firebase.auth().currentUser?.uid);
```

### **Teste 2: Verificar Permissões**

```javascript
// Teste de escrita no Firestore
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase/client-app';

const testWrite = async () => {
  try {
    await setDoc(doc(db, 'users', 'test', 'reports', 'test'), {
      test: true,
      timestamp: new Date()
    });
    console.log('Write successful');
  } catch (error) {
    console.error('Write failed:', error);
  }
};
```

## 🚨 **SE AINDA NÃO FUNCIONAR**

### **Opção 1: Regras Temporárias (APENAS PARA TESTE)**

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

⚠️ **ATENÇÃO**: Use apenas para teste!

### **Opção 2: Verificar Projeto Firebase**

1. **Confirme** que está no projeto correto: `woundwise-g3zb9`
2. **Verifique** se tem permissões de administrador
3. **Teste** com outro usuário

### **Opção 3: Debug do Código**

Adicione logs para debug:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  console.log('User:', user);
  console.log('User UID:', user?.uid);
  console.log('Selected Record:', selectedRecord);
  
  if (!user) {
    console.error('No user found');
    return;
  }
  
  try {
    console.log('Attempting to save report...');
    
    const docRef = await addDoc(collection(db, "users", user.uid, "reports"), {
      anamnesisId: selectedAnamnesisId,
      patientName: selectedRecord.nome_cliente,
      reportContent: result.report,
      woundImageUri: selectedRecord.woundImageUri,
      professionalId: user.uid,
      patientId: selectedRecord.patientId || "", 
      createdAt: serverTimestamp(),
    });
    
    console.log('Report saved with ID:', docRef.id);
    
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
};
```

## 📞 **SUPORTE**

Se o problema persistir:

1. **Verifique** os logs do Firebase Console
2. **Confirme** que as regras foram aplicadas
3. **Teste** com um usuário diferente
4. **Entre em contato**: suporte@healplus.com

## ✅ **RESULTADO ESPERADO**

Após aplicar as correções:

- ✅ **Sem erros** de permissão
- ✅ **Relatórios salvos** com sucesso
- ✅ **Coleção reports** funcionando
- ✅ **Sistema estável**

---

**🚀 Aplique essas correções AGORA para resolver o problema de salvamento de relatórios!**
