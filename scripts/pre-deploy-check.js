#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração para Firebase App Hosting...\n');

// Verificar arquivos necessários
const requiredFiles = [
  'apphosting.yaml',
  'firebase.json',
  'next.config.ts',
  'package.json',
  '.firebaseignore'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - OK`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
    allFilesExist = false;
  }
});

// Verificar configuração do next.config.ts
try {
  const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
  if (nextConfig.includes('output: \'standalone\'')) {
    console.log('✅ next.config.ts - Configuração standalone OK');
  } else {
    console.log('❌ next.config.ts - Configuração standalone FALTANDO');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ next.config.ts - ERRO ao ler arquivo');
  allFilesExist = false;
}

// Verificar configuração do apphosting.yaml
try {
  const apphostingConfig = fs.readFileSync('apphosting.yaml', 'utf8');
  if (apphostingConfig.includes('nodeVersion: "20"')) {
    console.log('✅ apphosting.yaml - Node.js version OK');
  } else {
    console.log('❌ apphosting.yaml - Node.js version FALTANDO');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ apphosting.yaml - ERRO ao ler arquivo');
  allFilesExist = false;
}

// Verificar package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('✅ package.json - Script de build OK');
  } else {
    console.log('❌ package.json - Script de build FALTANDO');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ package.json - ERRO ao ler arquivo');
  allFilesExist = false;
}

console.log('\n📋 Checklist de Secrets:');
console.log('Verifique se os seguintes secrets estão configurados no Cloud Secret Manager:');
console.log('- NEXT_PUBLIC_FIREBASE_API_KEY');
console.log('- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID');
console.log('- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
console.log('- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
console.log('- NEXT_PUBLIC_FIREBASE_APP_ID');
console.log('- GEMINI_API_KEY');

if (allFilesExist) {
  console.log('\n🎉 Configuração OK! Pronto para deploy.');
  console.log('\n🚀 Para fazer o deploy:');
  console.log('npm run firebase:deploy:apphosting');
} else {
  console.log('\n❌ Configuração incompleta. Corrija os problemas acima antes do deploy.');
  process.exit(1);
}
