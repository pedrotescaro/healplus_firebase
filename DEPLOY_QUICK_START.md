# 🚀 Deploy Rápido - Firebase App Hosting

## ⚡ Deploy em 3 Passos

### 1. Configurar Secrets
```bash
# No Google Cloud Console, configure os secrets:
gcloud secrets create NEXT_PUBLIC_FIREBASE_API_KEY --data-file=api_key.txt
gcloud secrets create NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN --data-file=auth_domain.txt
gcloud secrets create NEXT_PUBLIC_FIREBASE_PROJECT_ID --data-file=project_id.txt
gcloud secrets create NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET --data-file=storage_bucket.txt
gcloud secrets create NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --data-file=messaging_sender_id.txt
gcloud secrets create NEXT_PUBLIC_FIREBASE_APP_ID --data-file=app_id.txt
gcloud secrets create GEMINI_API_KEY --data-file=gemini_api_key.txt
```

### 2. Verificar Configuração
```bash
npm run pre-deploy:check
```

### 3. Deploy
```bash
npm run deploy:apphosting
```

## 🔧 Comandos Úteis

```bash
# Verificar status
firebase apphosting:backends:list

# Ver logs
firebase apphosting:backends:logs --backend=your-backend-id

# Deploy apenas App Hosting
firebase deploy --only apphosting

# Deploy completo
firebase deploy
```

## 🆘 Problemas Comuns

### Erro de Build
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro de Secrets
- Verificar se os secrets estão configurados no Cloud Secret Manager
- Verificar se os nomes dos secrets estão corretos no `apphosting.yaml`

### Erro de Memória
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 📊 Monitoramento

- **Firebase Console**: https://console.firebase.google.com
- **Cloud Logging**: https://console.cloud.google.com/logs
- **Cloud Monitoring**: https://console.cloud.google.com/monitoring
