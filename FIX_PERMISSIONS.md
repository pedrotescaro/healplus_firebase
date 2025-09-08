# 🔧 Correção de Permissões - Heal+

## 🚨 Problemas Identificados

### 1. **Erro de Permissões do Firestore**
```
Error querying for patient, assigning placeholder ID: FirebaseError: Missing or insufficient permissions.
```

### 2. **Aviso do Realtime Database**
```
@firebase/database: FIREBASE WARNING: Firebase error. Please ensure that you have the URL of your Firebase Realtime Database instance configured correctly.
```

## ✅ Soluções Implementadas

### 1. **Regras do Firestore Atualizadas**

As regras foram atualizadas em `firestore.rules` para permitir que profissionais consultem a coleção de usuários:

```javascript
// Regras para a coleção 'users'
match /users/{userId} {
  // Usuários podem ler/escrever seus próprios documentos
  allow read, write: if request.auth.uid == userId;

  // Profissionais podem ler dados de pacientes
  allow read: if request.auth.uid == userId || 
              (exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'professional');

  // Profissionais podem consultar a coleção de usuários (para encontrar pacientes)
  allow list: if exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'professional';
}
```

### 2. **Configuração do Firebase**

A configuração em `src/firebase/client-app.ts` está correta:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDX0mJJt5SW2L55Fs5SPWHsXP2gQHFbRPY",
  authDomain: "woundwise-g3zb9.firebaseapp.com",
  projectId: "woundwise-g3zb9",
  storageBucket: "woundwise-g3zb9.firebasestorage.app",
  messagingSenderId: "315167035013",
  appId: "1:315167035013:web:189654d5723c779cf963ec",
  databaseURL: "https://woundwise-g3zb9-default-rtdb.firebaseio.com/"
};
```

## 🚀 Como Aplicar as Correções

### **Opção 1: Firebase Console (Recomendado)**

1. **Acesse o Firebase Console:**
   - Vá para: https://console.firebase.google.com/
   - Selecione o projeto: `woundwise-g3zb9`

2. **Atualizar Regras do Firestore:**
   - No menu lateral, clique em "Firestore Database"
   - Vá para a aba "Regras"
   - Substitua o conteúdo pelas regras do arquivo `firestore.rules`
   - Clique em "Publicar"

3. **Verificar Realtime Database:**
   - No menu lateral, clique em "Realtime Database"
   - Verifique se a URL está correta: `https://woundwise-g3zb9-default-rtdb.firebaseio.com/`
   - Se não existir, crie um novo Realtime Database

4. **Atualizar Regras do Realtime Database:**
   - Vá para a aba "Regras"
   - Substitua o conteúdo pelas regras do arquivo `database.rules.json`
   - Clique em "Publicar"

### **Opção 2: Firebase CLI (Se disponível)**

Se conseguir executar comandos no terminal:

```bash
# Fazer login no Firebase
firebase login

# Deploy das regras
firebase deploy --only firestore:rules
firebase deploy --only database
```

## 🔍 Verificações Pós-Deploy

### 1. **Testar Login de Profissional**
- Faça login como profissional
- Tente criar uma nova anamnese
- Verifique se não há mais erros de permissão

### 2. **Testar Salvamento de Imagens**
- Capture uma imagem de ferida
- Verifique se salva no Realtime Database
- Confirme que não há avisos no console

### 3. **Verificar Console do Navegador**
- Abra as Ferramentas de Desenvolvedor (F12)
- Vá para a aba Console
- Não deve haver mais erros de permissão

## 📋 Checklist de Verificação

- [ ] Regras do Firestore atualizadas e publicadas
- [ ] Regras do Realtime Database atualizadas e publicadas
- [ ] URL do Realtime Database configurada corretamente
- [ ] Login como profissional funcionando
- [ ] Criação de anamnese funcionando
- [ ] Salvamento de imagens funcionando
- [ ] Console sem erros de permissão

## 🆘 Se Ainda Houver Problemas

### **Erro Persistente de Permissões:**
1. Verifique se o usuário tem role "professional" no Firestore
2. Confirme se as regras foram publicadas corretamente
3. Aguarde alguns minutos para propagação das regras

### **Erro do Realtime Database:**
1. Verifique se o Realtime Database está ativado no projeto
2. Confirme se a URL está correta na configuração
3. Teste a conexão diretamente no Firebase Console

### **Contato:**
Se os problemas persistirem, verifique:
- Logs do Firebase Console
- Console do navegador para erros específicos
- Status dos serviços Firebase

---

**✅ Após aplicar essas correções, o sistema deve funcionar normalmente sem erros de permissão!**
