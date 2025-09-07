## Guia rápido de testes (MVP Heal+)

Pré-requisitos
- Docker e Node 18+
- `.env.local` com:
  - NEXT_PUBLIC_API_BASE=http://localhost:4000
  - NEXT_PUBLIC_AI_BASE=http://localhost:5000

Passos
1) Subir serviços mocks
```
docker compose up -d
```

2) Rodar app
```
npm run dev
```

3) Gerar relatório e análises
- Dashboard > Relatório
- Selecione avaliação com imagem > “Gerar Relatório”
- Clique “Analisar Imagem (mock)” e “Teste AI (mock)”
- Ajuste opacidade da máscara

4) Persistência
- Verifique em Dashboard > Assessments listagem e detalhe
- Verifique Dashboard > FHIR Logs ao usar Push/Pull

5) FHIR mock
- No card do relatório, use “Push FHIR (mock)” e “Pull FHIR (mock)”
- Confirme toast e registro em `fhirLogs`

6) Reprocessamento
- Abra um assessment no detalhe e use “Reprocessar (mock)”
- Confirme `modelVersion` incrementado

Exportar docs
```
npm i -D md-to-pdf
npm run export:docs
```


