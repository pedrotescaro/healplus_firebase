# Script PowerShell para corrigir permissões do Firebase
Write-Host "Iniciando correção das permissões do Firebase..." -ForegroundColor Blue

# Verificar se Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js não está instalado. Instale Node.js primeiro:" -ForegroundColor Red
    Write-Host "https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

# Verificar se npm está instalado
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm não está instalado" -ForegroundColor Red
    exit 1
}

# Instalar Firebase CLI globalmente
Write-Host "Instalando Firebase CLI..." -ForegroundColor Yellow
try {
    npm install -g firebase-tools
    Write-Host "Firebase CLI instalado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Falha ao instalar Firebase CLI" -ForegroundColor Red
    exit 1
}

# Verificar instalação do Firebase CLI
Write-Host "Verificando Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version
    Write-Host "Firebase CLI funcionando: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "Firebase CLI não está funcionando" -ForegroundColor Red
    exit 1
}

# Fazer login no Firebase
Write-Host "Fazendo login no Firebase..." -ForegroundColor Yellow
Write-Host "Será aberto o navegador para autenticação" -ForegroundColor Yellow
try {
    firebase login
    Write-Host "Login no Firebase realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Falha no login do Firebase" -ForegroundColor Red
    exit 1
}

# Configurar projeto
Write-Host "Configurando projeto Firebase..." -ForegroundColor Yellow
try {
    firebase use woundwise-g3zb9
    Write-Host "Projeto configurado: woundwise-g3zb9" -ForegroundColor Green
} catch {
    Write-Host "Falha ao configurar projeto" -ForegroundColor Red
    exit 1
}

# Deploy das regras do Firestore
Write-Host "Aplicando regras do Firestore..." -ForegroundColor Yellow
try {
    firebase deploy --only firestore:rules
    Write-Host "Regras do Firestore aplicadas com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Falha ao aplicar regras do Firestore" -ForegroundColor Red
    Write-Host "Você precisará aplicar as regras manualmente no Firebase Console" -ForegroundColor Yellow
}

# Deploy das regras do Realtime Database
Write-Host "Aplicando regras do Realtime Database..." -ForegroundColor Yellow
try {
    firebase deploy --only database
    Write-Host "Regras do Realtime Database aplicadas com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Falha ao aplicar regras do Realtime Database (pode não existir)" -ForegroundColor Yellow
}

# Verificar status do projeto
Write-Host "Verificando status do projeto..." -ForegroundColor Yellow
firebase projects:list

Write-Host "Correção das permissões concluída!" -ForegroundColor Green
Write-Host "Aguarde 2-3 minutos para as regras entrarem em vigor" -ForegroundColor Yellow
Write-Host "Teste o sistema em: https://studio--woundwise-g3zb9.us-central1.hosted.app/dashboard/report" -ForegroundColor Cyan

Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Blue
Write-Host "1. Aguarde 2-3 minutos para propagação das regras" -ForegroundColor White
Write-Host "2. Recarregue a página do aplicativo" -ForegroundColor White
Write-Host "3. Teste a geração de relatórios" -ForegroundColor White
Write-Host "4. Verifique se não há mais erros de permissão" -ForegroundColor White

Write-Host ""
Write-Host "Links úteis:" -ForegroundColor Blue
Write-Host "- Firebase Console: https://console.firebase.google.com/" -ForegroundColor Cyan
Write-Host "- Projeto: woundwise-g3zb9" -ForegroundColor Cyan
Write-Host "- Página de teste: https://studio--woundwise-g3zb9.us-central1.hosted.app/dashboard/report" -ForegroundColor Cyan

Write-Host ""
Write-Host "Se ainda houver problemas:" -ForegroundColor Red
Write-Host "- Verifique o arquivo FIX_FIRESTORE_PERMISSIONS_NOW.md" -ForegroundColor White
Write-Host "- Aplique as regras manualmente no Firebase Console" -ForegroundColor White
