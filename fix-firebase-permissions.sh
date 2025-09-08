#!/bin/bash

# Script para corrigir permissões do Firebase via Git Bash
# Execute este script no Git Bash

echo "🚀 Iniciando correção das permissões do Firebase..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Node.js está instalado
print_status "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado. Instale Node.js primeiro:"
    echo "https://nodejs.org/"
    exit 1
fi

print_success "Node.js encontrado: $(node --version)"

# Verificar se npm está instalado
print_status "Verificando npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm não está instalado"
    exit 1
fi

print_success "npm encontrado: $(npm --version)"

# Instalar Firebase CLI globalmente
print_status "Instalando Firebase CLI..."
if npm install -g firebase-tools; then
    print_success "Firebase CLI instalado com sucesso"
else
    print_error "Falha ao instalar Firebase CLI"
    exit 1
fi

# Verificar instalação do Firebase CLI
print_status "Verificando Firebase CLI..."
if firebase --version; then
    print_success "Firebase CLI funcionando: $(firebase --version)"
else
    print_error "Firebase CLI não está funcionando"
    exit 1
fi

# Fazer login no Firebase
print_status "Fazendo login no Firebase..."
print_warning "Será aberto o navegador para autenticação"
if firebase login; then
    print_success "Login no Firebase realizado com sucesso"
else
    print_error "Falha no login do Firebase"
    exit 1
fi

# Configurar projeto
print_status "Configurando projeto Firebase..."
if firebase use woundwise-g3zb9; then
    print_success "Projeto configurado: woundwise-g3zb9"
else
    print_error "Falha ao configurar projeto"
    exit 1
fi

# Deploy das regras do Firestore
print_status "Aplicando regras do Firestore..."
if firebase deploy --only firestore:rules; then
    print_success "Regras do Firestore aplicadas com sucesso"
else
    print_error "Falha ao aplicar regras do Firestore"
    print_warning "Tentando método alternativo..."
    
    # Método alternativo: criar arquivo temporário
    cat > firestore.rules.temp << 'EOF'
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
EOF
    
    # Tentar deploy novamente
    if firebase deploy --only firestore:rules; then
        print_success "Regras do Firestore aplicadas com sucesso (método alternativo)"
    else
        print_error "Falha total ao aplicar regras do Firestore"
        print_warning "Você precisará aplicar as regras manualmente no Firebase Console"
    fi
fi

# Deploy das regras do Realtime Database
print_status "Aplicando regras do Realtime Database..."
if firebase deploy --only database; then
    print_success "Regras do Realtime Database aplicadas com sucesso"
else
    print_warning "Falha ao aplicar regras do Realtime Database (pode não existir)"
fi

# Verificar status do projeto
print_status "Verificando status do projeto..."
firebase projects:list

# Limpar arquivos temporários
if [ -f "firestore.rules.temp" ]; then
    rm firestore.rules.temp
fi

print_success "✅ Correção das permissões concluída!"
print_status "Aguarde 2-3 minutos para as regras entrarem em vigor"
print_status "Teste o sistema em: https://studio--woundwise-g3zb9.us-central1.hosted.app/dashboard/report"

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Aguarde 2-3 minutos para propagação das regras"
echo "2. Recarregue a página do aplicativo"
echo "3. Teste a geração de relatórios"
echo "4. Verifique se não há mais erros de permissão"
echo ""
echo "🔗 Links úteis:"
echo "- Firebase Console: https://console.firebase.google.com/"
echo "- Projeto: woundwise-g3zb9"
echo "- Página de teste: https://studio--woundwise-g3zb9.us-central1.hosted.app/dashboard/report"
echo ""
echo "🆘 Se ainda houver problemas:"
echo "- Verifique o arquivo FIX_FIRESTORE_PERMISSIONS_NOW.md"
echo "- Aplique as regras manualmente no Firebase Console"
