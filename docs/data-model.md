## Modelo de Dados TIMERS + FHIR

Entidades nucleares e campos principais:

- Patient: id, demographics, comorbidades, fatores S (literacia, transporte, suporte social)
- Wound: id, localização anatômica, etiologia, data de início, status
- Assessment (TIMERS): id, woundId, assessorId, timestamp, T/I/M/E/R/S
- MediaAsset: id, assessmentId, tipo, uri, metadados de captura (distância, iluminação, escala)
- AIAnalysis: id, assessmentId, segmentationMaskUri, tissueQuant[{class, percent}], perimeter, area, gradcamUri
- RiskScore: id, assessmentId, infectionRisk{level, score, factors[]}, healingTrajectory{probHealXDays, timeToHeal, stagnationFlag, factors[]}
- Recommendation: id, assessmentId, categories[], rationale, clinicianOverride
- ScheduleEvent: id, patientId, type, datetime, channel
- Consent: id, patientId, scopes[], version, grantedAt, revokedAt?
- AuditLog: id, actor, action, entity, timestamp

TIMERS por componente:

- T: tissueDistribution[{granulation, slough, necrosis, epithelial, other}], debridementNeeded, methodSuggested
- I: signs[{erythema, edema, odor, warmth, purulence, pain}], biofilmSuspected
- M: moistureLevel{dry, balanced, moist, high}, exudate{low, moderate, high, purulent, serous}
- E: edgeStatus{advancing, stalled, epibole}, contractionRate
- R: basicCareAdequate, advancedTherapyConsidered, referSuggested
- S: socialFactors{transport, literacy, caregiver, mentalHealth, financial}, adherenceBarriers[]

Eventos principais:

- assessment.created, media.uploaded, ai.analysis.completed, risk.updated, recommendation.issued, consent.updated, appointment.scheduled, fhir.sync.sent/received

Mapeamento FHIR:

- Patient -> Patient + extensions (fatores S)
- Wound -> Condition (code SNOMED/ICD), bodySite
- Assessment -> Observation (perfil custom com components T/I/M/E/R/S)
- MediaAsset -> Media (content.attachment) referenciando Observation
- AIAnalysis -> Observation (component: area, perimeter; tissue %) + DocumentReference (máscaras/XAI)
- RiskScore -> RiskAssessment ou Observation com profile
- Recommendation -> ServiceRequest/CarePlan (categoria "dressing recommendation")
- ScheduleEvent -> Appointment + CommunicationRequest (lembretes)
- Consent -> Consent
- AuditLog -> AuditEvent


