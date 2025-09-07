## Wireframes (Mermaid)

### Fluxo de Avaliação TIMERS

```mermaid
flowchart TD
  Start[Iniciar Avaliação] --> Capture[Captura de Imagem + Guia/Regra]
  Capture --> T[T - Tecido (overlay + %)]
  T --> I[I - Infecção (checklist)]
  I --> M[M - Umidade (descritores)]
  M --> E[E - Borda (taxa/epíbole)]
  E --> R[R - Reparo (terapias/encaminhar)]
  R --> S[S - Social (questionário/atualização)]
  S --> Review[Revisão & Assinatura]
  Review --> Submit[Salvar/Enviar FHIR]
```

### Portal do Clínico (Dashboard)

```mermaid
flowchart LR
  A[Header] --- B[Sidebar]
  B --- C[Lista de Pacientes]
  C --> D[Alertas (Risco/Estagnação/No-show)]
  C --> E[Filtros/Busca]
  A --- F[Cards de KPIs]
```

### Portal do Paciente (Dashboard)

```mermaid
flowchart LR
  H[Header] --- P[Progresso de Cicatrização]
  P --- Q[Gráfico Área/Tempo]
  H --- R[Próximas Consultas]
  H --- S[Tarefas (troca de curativo/medicação)]
```


