
import { z } from "zod";

// Personal Data
export const personalDataSchema = z.object({
  patientId: z.string().optional(), // Added to link to a user account
  patientUniqueId: z.string().optional(), // Unique patient identifier for versioning
  evaluationVersion: z.number().default(1), // Version number of this evaluation
  evaluationId: z.string().optional(), // Unique ID for this specific evaluation
  nome_cliente: z.string().min(1, "Nome é obrigatório"),
  data_nascimento: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  profissao: z.string().optional(),
  estado_civil: z.string().optional(),
});

// S - Social/Self-Care
export const socialSchema = z.object({
  nivel_atividade: z.string().optional(),
  suporte_social: z.string().optional(),
  compreensao_adesao: z.string().optional(),
  fumante: z.boolean().default(false),
  ingestao_alcool: z.boolean().default(false),
  frequencia_alcool: z.string().optional(),
  pratica_atividade_fisica: z.boolean().default(false),
  qual_atividade: z.string().optional(),
  frequencia_atividade: z.string().optional(),
  estado_nutricional: z.string().optional(),
  ingestao_agua_dia: z.string().optional(),
});

// Clinical History & Comorbidities (part of S and I)
export const clinicalHistorySchema = z.object({
  objetivo_tratamento: z.string().optional(),
  historico_cicrizacao: z.string().optional(),
  possui_alergia: z.boolean().default(false),
  qual_alergia: z.string().optional(),
  realizou_cirurgias: z.boolean().default(false),
  quais_cirurgias: z.string().optional(),
  claudicacao_intermitente: z.boolean().default(false),
  dor_repouso: z.boolean().default(false),
  pulsos_perifericos: z.string().optional(),
  dmi: z.boolean().default(false),
  dmii: z.boolean().default(false),
  has: z.boolean().default(false),
  neoplasia: z.boolean().default(false),
  hiv_aids: z.boolean().default(false),
  obesidade: z.boolean().default(false),
  cardiopatia: z.boolean().default(false),
  dpoc: z.boolean().default(false),
  doenca_hematologica: z.boolean().default(false),
  doenca_vascular: z.boolean().default(false),
  demencia_senil: z.boolean().default(false),
  insuficiencia_renal: z.boolean().default(false),
  hanseniase: z.boolean().default(false),
  insuficiencia_hepatica: z.boolean().default(false),
  doenca_autoimune: z.boolean().default(false),
  outros_hpp: z.string().optional(),
  anti_hipertensivo: z.boolean().default(false),
  anti_hipertensivo_nome: z.string().optional(),
  anti_hipertensivo_dose: z.string().optional(),
  corticoides: z.boolean().default(false),
  corticoides_nome: z.string().optional(),
  corticoides_dose: z.string().optional(),
  hipoglicemiantes_orais: z.boolean().default(false),
  hipoglicemiantes_orais_nome: z.string().optional(),
  hipoglicemiantes_orais_dose: z.string().optional(),
  aines: z.boolean().default(false),
  aines_nome: z.string().optional(),
  aines_dose: z.string().optional(),
  insulina: z.boolean().default(false),
  insulina_nome: z.string().optional(),
  insulina_dose: z.string().optional(),
  drogas_vasoativa: z.boolean().default(false),
  drogas_vasoativa_nome: z.string().optional(),
  drogas_vasoativa_dose: z.string().optional(),
  suplemento: z.boolean().default(false),
  suplemento_nome: z.string().optional(),
  suplemento_dose: z.string().optional(),
  anticoagulante: z.boolean().default(false),
  anticoagulante_nome: z.string().optional(),
  anticoagulante_dose: z.string().optional(),
  vitaminico: z.boolean().default(false),
  vitaminico_nome: z.string().optional(),
  vitaminico_dose: z.string().optional(),
  antirretroviral: z.boolean().default(false),
  antirretroviral_nome: z.string().optional(),
  antirretroviral_dose: z.string().optional(),
  outros_medicamento: z.string().optional(),
});

// T - Tissue
export const tissueSchema = z.object({
  woundImageUri: z.string().optional(),
  ferida_largura: z.coerce.number().min(0, "Largura não pode ser negativa").optional(),
  ferida_comprimento: z.coerce.number().min(0, "Comprimento não pode ser negativo").optional(),
  ferida_profundidade: z.coerce.number().min(0, "Profundidade não pode ser negativa").optional(),
  localizacao_ferida: z.string().min(1, "Localização é obrigatória"),
  etiologia_ferida: z.string().optional(),
  etiologia_outra: z.string().optional(),
  tempo_evolucao: z.string().min(1, "Tempo de evolução é obrigatório"),
  percentual_granulacao_leito: z.coerce.number().min(0).max(100).optional(),
  percentual_epitelizacao_leito: z.coerce.number().min(0).max(100).optional(),
  percentual_esfacelo_leito: z.coerce.number().min(0).max(100).optional(),
  percentual_necrose_seca_leito: z.coerce.number().min(0).max(100).optional(),
});

// I - Infection/Inflammation
export const infectionSchema = z.object({
  dor_escala: z.coerce.number().min(0).max(10).optional(),
  dor_fatores: z.string().optional(),
  inflamacao_rubor: z.boolean().default(false),
  inflamacao_calor: z.boolean().default(false),
  inflamacao_edema: z.boolean().default(false),
  inflamacao_dor_local: z.boolean().default(false),
  inflamacao_perda_funcao: z.boolean().default(false),
  infeccao_eritema_perilesional: z.boolean().default(false),
  infeccao_calor_local: z.boolean().default(false),
  infeccao_edema: z.boolean().default(false),
  infeccao_dor_local: z.boolean().default(false),
  infeccao_exsudato: z.boolean().default(false),
  infeccao_odor: z.boolean().default(false),
  infeccao_retardo_cicatrizacao: z.boolean().default(false),
  cultura_realizada: z.boolean().default(false),
  resultado_cultura: z.string().optional(),
});

// M - Moisture
export const moistureSchema = z.object({
  quantidade_exsudato: z.string().optional(),
  tipo_exsudato: z.string().optional(),
  consistencia_exsudato: z.string().optional(),
});

// E - Edge
export const edgeSchema = z.object({
  bordas_caracteristicas: z.string().optional(),
  fixacao_bordas: z.string().optional(),
  tunel_cavidade: z.boolean().default(false),
  localizacao_tunel_cavidade: z.string().optional(),
  velocidade_cicatrizacao: z.string().optional(),
  pele_perilesional_umidade: z.string().optional(),
  pele_perilesional_extensao: z.string().optional(),
  pele_perilesional_integra: z.boolean().default(false),
  pele_perilesional_eritematosa: z.boolean().default(false),
  pele_perilesional_macerada: z.boolean().default(false),
  pele_perilesional_seca_descamativa: z.boolean().default(false),
  pele_perilesional_eczematosa: z.boolean().default(false),
  pele_perilesional_hiperpigmentada: z.boolean().default(false),
  pele_perilesional_hipopigmentada: z.boolean().default(false),
  pele_perilesional_indurada: z.boolean().default(false),
  pele_perilesional_sensivel: z.boolean().default(false),
  pele_perilesional_edema: z.boolean().default(false),
});

// R - Repair/Regeneration/Refer
export const repairSchema = z.object({
  observacoes: z.string().optional(),
  data_consulta: z.string().min(1, "Data da consulta é obrigatória"),
  hora_consulta: z.string().min(1, "Hora da consulta é obrigatória"),
  profissional_responsavel: z.string().optional(),
  coren: z.string().optional(),
  data_retorno: z.string().optional(),
});


// Unifying schema with all parts of TIMERS
export const anamnesisFormSchema = personalDataSchema
  .merge(socialSchema)
  .merge(clinicalHistorySchema)
  .merge(tissueSchema)
  .merge(infectionSchema)
  .merge(moistureSchema)
  .merge(edgeSchema)
  .merge(repairSchema);

export type AnamnesisFormValues = z.infer<typeof anamnesisFormSchema>;
