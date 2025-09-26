# 🚀 Deploy no Firebase App Hosting - Heal+

Este guia explica como fazer o deploy do projeto Heal+ no Firebase App Hosting.

## 📋 Pré-requisitos

1. **Firebase CLI instalado e configurado**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Projeto Firebase configurado**
   - Projeto criado no Firebase Console
   - App Hosting habilitado
   - Secrets configurados no Cloud Secret Manager

## 🔧 Configuração

### 1. Secrets no Cloud Secret Manager

Configure os seguintes secrets no Cloud Secret Manager:

```bash
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Configuração do Projeto

O projeto já está configurado com:
- ✅ `apphosting.yaml` - Configuração do App Hosting
- ✅ `firebase.json` - Configuração do Firebase
- ✅ `next.config.ts` - Configuração do Next.js
- ✅ `.firebaseignore` - Arquivos ignorados no deploy

## 🚀 Deploy

### 1. Build Local (Opcional)
```bash
npm install
npm run build
```

### 2. Deploy para App Hosting
```bash
# Deploy completo (hosting + apphosting)
npm run firebase:deploy

# Ou apenas App Hosting
npm run firebase:deploy:apphosting

# Ou usando Firebase CLI diretamente
firebase deploy --only apphosting
```

### 3. Verificar Deploy
```bash
# Ver status do deploy
firebase apphosting:backends:list

# Ver logs
firebase apphosting:backends:logs
```

## 🔍 Troubleshooting

### Problemas Comuns

1. **Erro de Build**
   ```bash
   # Limpar cache e reinstalar
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Erro de Secrets**
   - Verificar se os secrets estão configurados no Cloud Secret Manager
   - Verificar se os nomes dos secrets estão corretos no `apphosting.yaml`

3. **Erro de Dependências**
   ```bash
   # Verificar dependências
   npm audit
   npm audit fix
   ```

4. **Erro de Memória**
   ```bash
   # Aumentar memória do Node.js
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

### Logs e Debug

```bash
# Ver logs do backend
firebase apphosting:backends:logs --backend=your-backend-id

# Ver logs em tempo real
firebase apphosting:backends:logs --backend=your-backend-id --follow
```

## 📊 Monitoramento

### 1. Firebase Console
- Acesse o Firebase Console
- Vá para App Hosting
- Verifique o status do backend
- Monitore métricas de performance

### 2. Cloud Logging
- Acesse o Cloud Logging no Google Cloud Console
- Filtre por `apphosting` para ver logs específicos

### 3. Cloud Monitoring
- Configure alertas para métricas importantes
- Monitore CPU, memória e latência

## 🔄 CI/CD

### GitHub Actions (Opcional)

```yaml
name: Deploy to Firebase App Hosting
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## 📝 Notas Importantes

1. **Secrets**: Nunca commite secrets no código
2. **Build**: O build é feito automaticamente pelo Firebase App Hosting
3. **Dependências**: Todas as dependências são instaladas automaticamente
4. **Cache**: O cache é gerenciado automaticamente pelo Firebase

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do Firebase App Hosting
2. Consulte a documentação oficial do Firebase App Hosting
3. Verifique se todos os secrets estão configurados corretamente
4. Teste o build localmente antes do deploy

## 📚 Recursos Adicionais

- [Firebase App Hosting Documentation](https://firebase.google.com/docs/app-hosting)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Cloud Secret Manager](https://cloud.google.com/secret-manager)
