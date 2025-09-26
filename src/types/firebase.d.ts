// Tipos específicos para Firebase

import { User } from 'firebase/auth';

export interface AppUser extends User {
  role: 'professional' | 'patient';
  name: string;
  photoURL?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface AnamnesisData {
  id: string;
  nome_cliente: string;
  data_consulta: string;
  data_nascimento: string;
  idade: number;
  sexo: string;
  peso: number;
  altura: number;
  imc: number;
  localizacao_ferida: string;
  tempo_evolucao: string;
  etiologia_ferida: string;
  etiologia_outra?: string;
  ferida_comprimento: number;
  ferida_largura: number;
  ferida_profundidade: number;
  percentual_granulacao_leito: number;
  percentual_epitelizacao_leito: number;
  percentual_esfacelo_leito: number;
  percentual_necrose_seca_leito: number;
  quantidade_exsudato: string;
  tipo_exsudato: string;
  bordas_caracteristicas: string;
  pele_perilesional_umidade: string;
  dor_escala: number;
  odor: string;
  temperatura_perilesional: string;
  edema: string;
  pigmentacao: string;
  dmi: boolean;
  dmii: boolean;
  has: boolean;
  neoplasia: boolean;
  fumante: boolean;
  insuficiencia_cardiaca: boolean;
  insuficiencia_renal: boolean;
  avc: boolean;
  artrite: boolean;
  lupus: boolean;
  outras_comorbidades?: string;
  alergias?: string;
  medicamentos_uso?: string;
  tratamentos_anteriores?: string;
  fatores_causais?: string;
  queixa_principal?: string;
  sintomas?: string;
  observacoes?: string;
  woundImageUri?: string;
  profissional_responsavel?: string;
  coren?: string;
  instituicao?: string;
  patientId?: string;
  createdAt: any;
  updatedAt: any;
}

export interface ReportData {
  id: string;
  anamnesisId: string;
  patientName: string;
  reportContent: string;
  woundImageUri: string;
  professionalId: string;
  patientId: string;
  createdAt: any;
  updatedAt: any;
}
