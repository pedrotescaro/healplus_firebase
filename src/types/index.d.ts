// Arquivo principal de tipos para o projeto Heal+

export * from './global';
export * from './modules';
export * from './firebase';

// Re-exportar tipos comuns
export type { AppUser, AnamnesisData, ReportData } from './firebase';
