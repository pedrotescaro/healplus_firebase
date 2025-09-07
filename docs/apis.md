## APIs e Contratos

Autenticação

- POST /auth/login {email, code?} -> {token, mfaRequired}
- POST /auth/mfa/verify -> {token}

Pacientes e Feridas

- GET /patients?query=
- POST /patients {...}
- GET /patients/{id}/wounds
- POST /patients/{id}/wounds {...}

Avaliações TIMERS

- POST /wounds/{woundId}/assessments
  - Body: {T:{...}, I:{...}, M:{...}, E:{...}, R:{...}, SRef:consentId}
  - Resp: {assessmentId}
- GET /assessments/{id}

Mídia

- POST /assessments/{id}/media:init -> {uploadUrl, mediaId}
- PUT uploadUrl (blob)
- POST /assessments/{id}/media/{mediaId}/finalize

IA Visão

- POST /assessments/{id}/analysis/vision -> 202
- GET /assessments/{id}/analysis -> {segmentationMaskUri, tissueQuant[], area, perimeter, gradcamUri}

Preditivo e Recomendações

- POST /assessments/{id}/risk -> {infection:{level,score,factors[]}, healing:{...}}
- POST /assessments/{id}/recommendations -> {items:[{category, rationale}], override?}

Telessaúde e Agendamento

- POST /appointments {...}
- GET /appointments/{id}/join-token
- POST /notifications {channel, template, to, context}

FHIR

- POST /fhir/sync/push {assessmentId}
- POST /fhir/sync/pull {patientId, resources:[Patient,Condition,MedicationRequest]}

Consentimento e Auditoria

- POST /patients/{id}/consents {scopes[],version}
- GET /audit?entityType=&entityId=

Exemplos

```json
POST /wounds/123/assessments
{
  "T": {"tissueDistribution": {"granulation": 0.45, "slough": 0.55}, "debridementNeeded": true},
  "I": {"signs": ["erythema","odor"], "biofilmSuspected": true},
  "M": {"moistureLevel": "moist", "exudate": "high"},
  "E": {"edgeStatus": "stalled"},
  "R": {"advancedTherapyConsidered": false},
  "SRef": "consent-789"
}
```

```json
GET /assessments/456/analysis
{
  "segmentationMaskUri": "s3://.../mask.png",
  "tissueQuant": [{"class": "granulation", "percent": 45}],
  "area": {"value": 12.3, "unit": "cm2"},
  "perimeter": {"value": 14.8, "unit": "cm"},
  "gradcamUri": "s3://.../gradcam.png"
}
```


