/**
 * @fileOverview Shared Zod schemas for AI flows.
 */

import { z } from 'genkit';

export const ImageAnalysisSchema = z.object({
    id_imagem: z.string(),
    data_hora_captura: z.string(),
    avaliacao_qualidade: z.object({
        iluminacao: z.enum(["Adequada", "Superexposta", "Subexposta", "Sombras Presentes"]),
        foco: z.enum(["Nítido", "Levemente Desfocado", "Desfocado"]),
        angulo_consistente: z.enum(["Sim", "Não", "Não Aplicável"]),
        fundo: z.enum(["Neutro", "Distrativo"]),
        escala_referencia_presente: z.enum(["Sim", "Não"]),
    }),
    analise_dimensional: z.object({
        unidade_medida: z.enum(["mm", "cm", "pixels", "%"]),
        area_total_afetada: z.number(),
        dimensoes_lesao_principal: z.object({
            largura: z.number(),
            comprimento: z.number(),
        }).optional(),
    }),
    analise_colorimetrica: z.object({
        cores_dominantes: z.array(z.object({
            cor: z.string(),
            hex_aproximado: z.string(),
            area_percentual: z.number(),
        })),
    }),
    analise_textura_e_caracteristicas: z.object({
        edema: z.enum(["Ausente", "Leve", "Moderado", "Grave"]),
        descamacao: z.enum(["Ausente", "Presente"]),
        brilho_superficial: z.enum(["Fosco", "Acetinado", "Brilhante"]),
        presenca_solucao_continuidade: z.enum(["Sim", "Não"]),
        bordas_lesao: z.enum(["Definidas", "Indefinidas", "Irregulares", "Não Aplicável"]),
    }),
});

export const ComparativeReportSchema = z.object({
    periodo_analise: z.string().describe("Start and end datetime of the analysis period."),
    intervalo_tempo: z.string().describe("Time difference between the two images (e.g., '48 horas')."),
    consistencia_dados: z.object({
        alerta_qualidade: z.string().optional().describe("Warning message if there are significant inconsistencies between images."),
    }),
    analise_quantitativa_progressao: z.object({
        delta_area_total_afetada: z.string().describe("Change in total affected area (e.g., '+2.5 cm²' or '-5%')."),
        delta_coloracao: z.object({
            mudanca_area_hiperpigmentacao: z.string().describe("Change in hyperpigmentation area percentage."),
            mudanca_area_eritema_rubor: z.string().describe("Change in erythema/redness area percentage."),
            surgimento_novas_coloracoes: z.string().optional().describe("Description of any new colors that appeared."),
        }),
        delta_edema: z.string().describe("Evolution of edema (e.g., 'de Moderado para Leve')."),
        delta_textura: z.string().describe("Description of texture changes."),
    }),
    resumo_descritivo_evolucao: z.string().describe("A concise, technical summary of the observed changes."),
});


export const CompareWoundImagesOutputSchema = z.object({
  analise_imagem_1: ImageAnalysisSchema,
  analise_imagem_2: ImageAnalysisSchema,
  relatorio_comparativo: ComparativeReportSchema,
});
