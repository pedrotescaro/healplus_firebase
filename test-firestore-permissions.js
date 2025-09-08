// Script de teste para verificar permissões do Firestore
// Execute este script no console do navegador (F12) na página do Heal+

console.log('🔍 Testando permissões do Firestore...');

// Função para testar escrita no Firestore
async function testFirestoreWrite() {
  try {
    // Importar Firebase (assumindo que está disponível globalmente)
    const { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    // Verificar se o usuário está autenticado
    const user = firebase.auth().currentUser;
    if (!user) {
      console.error('❌ Usuário não autenticado');
      return;
    }
    
    console.log('✅ Usuário autenticado:', user.uid);
    
    // Teste 1: Escrever na coleção reports
    console.log('🧪 Testando escrita na coleção reports...');
    const testReportData = {
      test: true,
      timestamp: serverTimestamp(),
      message: 'Teste de permissões'
    };
    
    const reportRef = await addDoc(collection(db, "users", user.uid, "reports"), testReportData);
    console.log('✅ Relatório de teste salvo com ID:', reportRef.id);
    
    // Teste 2: Ler o documento criado
    console.log('🧪 Testando leitura do documento...');
    const docSnap = await getDoc(doc(db, "users", user.uid, "reports", reportRef.id));
    if (docSnap.exists()) {
      console.log('✅ Documento lido com sucesso:', docSnap.data());
    } else {
      console.error('❌ Documento não encontrado');
    }
    
    // Teste 3: Escrever na coleção anamnesis
    console.log('🧪 Testando escrita na coleção anamnesis...');
    const testAnamnesisData = {
      test: true,
      timestamp: serverTimestamp(),
      message: 'Teste de anamnese'
    };
    
    const anamnesisRef = await addDoc(collection(db, "users", user.uid, "anamnesis"), testAnamnesisData);
    console.log('✅ Anamnese de teste salva com ID:', anamnesisRef.id);
    
    console.log('🎉 Todos os testes de permissão passaram!');
    
  } catch (error) {
    console.error('❌ Erro no teste de permissões:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem do erro:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('🔧 SOLUÇÃO: As regras do Firestore precisam ser atualizadas');
      console.log('1. Acesse: https://console.firebase.google.com/');
      console.log('2. Selecione o projeto: woundwise-g3zb9');
      console.log('3. Vá para Firestore Database > Regras');
      console.log('4. Aplique as regras do arquivo FIX_FIRESTORE_PERMISSIONS_NOW.md');
    }
  }
}

// Função para verificar configuração do Firebase
function checkFirebaseConfig() {
  console.log('🔍 Verificando configuração do Firebase...');
  
  // Verificar se Firebase está inicializado
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase não está carregado');
    return false;
  }
  
  console.log('✅ Firebase carregado');
  
  // Verificar se o usuário está autenticado
  const user = firebase.auth().currentUser;
  if (!user) {
    console.error('❌ Usuário não autenticado');
    return false;
  }
  
  console.log('✅ Usuário autenticado:', user.uid);
  console.log('✅ Email:', user.email);
  
  // Verificar se Firestore está disponível
  if (typeof db === 'undefined') {
    console.error('❌ Firestore não está inicializado');
    return false;
  }
  
  console.log('✅ Firestore inicializado');
  
  return true;
}

// Executar testes
console.log('🚀 Iniciando testes de permissões...');

if (checkFirebaseConfig()) {
  testFirestoreWrite();
} else {
  console.log('❌ Configuração do Firebase inválida. Verifique se está logado e na página correta.');
}

// Instruções para o usuário
console.log(`
📋 INSTRUÇÕES:

1. Execute este script no console do navegador (F12)
2. Se houver erros de permissão, siga as instruções do arquivo FIX_FIRESTORE_PERMISSIONS_NOW.md
3. Aguarde 2-3 minutos após aplicar as regras
4. Execute o teste novamente

🔗 Links úteis:
- Firebase Console: https://console.firebase.google.com/
- Projeto: woundwise-g3zb9
- Página de teste: https://studio--woundwise-g3zb9.us-central1.hosted.app/dashboard/report
`);
