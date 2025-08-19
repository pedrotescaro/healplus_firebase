export const TISSUE_TYPES = {
  percentual_granulacao_leito: {
    label: "Granulação",
    color: "#e53e3e", // red-600
  },
  percentual_epitelizacao_leito: {
    label: "Epitelização",
    color: "#fbb6ce", // pink-300
  },
  percentual_esfacelo_leito: {
    label: "Esfacelo",
    color: "#f6e05e", // yellow-400
  },
  percentual_necrose_seca_leito: {
    label: "Necrose",
    color: "#2d3748", // gray-800
  },
} as const;

export type TissueType = typeof TISSUE_TYPES;
export type TissueName = keyof TissueType;
