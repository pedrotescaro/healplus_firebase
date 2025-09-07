## Seeding e limpeza (dev)

Objetivo: criar dados mínimos para testar lists e detalhes.

1) Criar assessment de exemplo
- Gere um relatório e clique “Analisar Imagem (mock)” para persistir um assessment automaticamente.

2) Criar FHIR logs de exemplo
- Use “Push FHIR (mock)” e “Pull FHIR (mock)” no card de relatório.

3) Limpeza manual (Firestore)
- Remova docs em `users/{uid}/assessments` e `users/{uid}/fhirLogs` conforme necessário.

4) Limpeza de Storage
- Remova arquivos em `users/{uid}/assessments/{assessmentId}/` (mask.png, image.png).


