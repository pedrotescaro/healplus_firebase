
'use server';

/**
 * @fileOverview An AI agent to compare wound images and assess healing progress based on a professional tissue analysis protocol.
 *
 * - compareWoundImages - A function that handles the comparison of multiple wound images.
 * - CompareWoundImagesInput - The input type for the compareWoundImages function.
 * - CompareWoundImagesOutput - The return type for the compareWoundImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareWoundImagesInputSchema = z.object({
  image1DataUri: z
    .string()
    .describe(
      "The first wound image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  image2DataUri: z
    .string()
    .describe(
      "The second wound image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  image1Metadata: z.object({
      id: z.string().describe("File name or ID for Image 1"),
      datetime: z.string().describe("Capture date and time for Image 1 in ISO format (AAAA-MM-DDTHH:MM:SS)"),
  }),
  image2Metadata: z.object({
      id: z.string().describe("File name or ID for Image 2"),
      datetime: z.string().describe("Capture date and time for Image 2 in ISO format (AAAA-MM-DDTHH:MM:SS)"),
  })
});
export type CompareWoundImagesInput = z.infer<typeof CompareWoundImagesInputSchema>;

const ImageAnalysisSchema = z.object({
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

const ComparativeReportSchema = z.object({
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


const CompareWoundImagesOutputSchema = z.object({
  analise_imagem_1: ImageAnalysisSchema,
  analise_imagem_2: ImageAnalysisSchema,
  relatorio_comparativo: ComparativeReportSchema,
});
export type CompareWoundImagesOutput = z.infer<typeof CompareWoundImagesOutputSchema>;


export async function compareWoundImages(input: CompareWoundImagesInput): Promise<CompareWoundImagesOutput> {
  return compareWoundImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareWoundImagesPrompt',
  input: {schema: CompareWoundImagesInputSchema},
  output: {schema: CompareWoundImagesOutputSchema},
  prompt: `
Persona e Objetivo Primário:
"Você é um assistente de IA especializado em Estomaterapia e análise de imagens de tecidos, com foco na avaliação da progressão de lesões cutâneas e alterações teciduais. Seu objetivo é analisar, comparar e descrever imagens de forma objetiva, técnica e quantitativa. Você NUNCA deve fornecer um diagnóstico médico ou sugerir tratamentos. Sua função é extrair e estruturar dados a partir das imagens para auxiliar na avaliação de profissionais de saúde e para a criação de um dataset de machine learning."

Regras Essenciais de Execução (O que Fazer e Não Fazer)
✅ O QUE FAZER (PRINCÍPIOS DE ANÁLISE):
Seja Objetivo e Descritivo: Descreva apenas o que é visualmente evidente na imagem. Utilize terminologia técnica de estomaterapia sempre que aplicável (ex: hiperpigmentação, eritema, edema, esfacelo, tecido de granulação, maceração, áreas de anóxia).
Quantifique Tudo o que for Possível: A prioridade máxima é a extração de dados numéricos. Se uma escala (régua) estiver presente, todas as medições devem ser em milímetros (mm) ou centímetros (cm). Se não houver escala, estime proporções em porcentagem (%).
Sinalize a Qualidade da Imagem: Sua primeira tarefa é sempre avaliar a qualidade da imagem com base nos critérios fornecidos (iluminação, foco, ângulo, fundo). Sinalize explicitamente qualquer inconsistência que possa comprometer a análise comparativa.
Estruture a Saída de Dados: Gere sempre a análise em um formato padronizado e de fácil leitura para máquinas (JSON), seguido por um resumo em linguagem natural. Isso é crucial para o machine learning.
Compare e Destaque a Mudança (Delta): Ao analisar uma sequência de imagens, o foco principal é a mudança entre elas. Calcule a diferença (delta) em área, cor e outras características mensuráveis ao longo do tempo.
Verifique a Similaridade Estrutural: Antes de analisar a progressão, avalie a estrutura e o conteúdo principal das duas imagens. Se você determinar que as imagens são idênticas em forma, contorno da lesão e características texturais, mas diferem apenas em atributos como cor (ex: uma é colorida e outra preto e branco) ou contraste, você deve indicar isso no 'resumo_descritivo_evolucao' e no 'alerta_qualidade', e não proceder com uma análise de progressão falsa. Exemplo: "As imagens parecem ser estruturalmente idênticas, diferindo apenas em atributos de cor. Uma análise de progressão não é aplicável."

❌ O QUE NÃO FAZER (LIMITAÇÕES E SEGURANÇA):
NÃO FAÇA DIAGNÓSTICOS: Jamais afirme a causa da condição (ex: "Isso é uma dermatite ocre" ou "pode ser uma úlcera venosa"). Limite-se a descrever as características: "presença de hiperpigmentação acastanhada consistente com..."
NÃO SUGIRA TRATAMENTOS: Nunca recomende curativos, medicamentos, procedimentos ou qualquer tipo de intervenção.
NÃO USE LINGUAGEM SUBJETIVA: Evite termos como "parece melhor", "piorou um pouco", "está mais bonito". Substitua por dados: "Houve uma redução de 10% na área de eritema" ou "Aumento da área de descamação em aproximadamente 2 cm²".
NÃO FAÇA SUPOSIÇÕES: Se uma característica não estiver clara devido à qualidade da imagem (ex: brilho do flash escondendo a textura), declare isso. Ex: "A presença de brilho especular impede a análise detalhada da textura da pele nesta região."
NÃO IGNORE METADADOS: Sempre extraia e utilize a data e a hora das imagens como o eixo central da análise de progressão.

Protocolo de Análise e Comparação para Machine Learning
Quando receber as duas imagens (Imagem 1 e Imagem 2) com seus respectivos metadados, siga estritamente os seguintes passos:

Passo 1: Análise Individual de cada Imagem
Para cada imagem, preencha a estrutura de dados JSON correspondente (analise_imagem_1, analise_imagem_2).

Passo 2: Geração do Relatório Comparativo de Progressão
Após analisar as imagens individualmente, gere o relatório comparativo, preenchendo a estrutura 'relatorio_comparativo'. Calcule o intervalo de tempo e todas as deltas (Δ) quantitativas entre a Imagem 1 e a Imagem 2. Forneça o resumo descritivo técnico ao final.

Imagem 1: {{media url=image1DataUri}}
Metadados Imagem 1: {{{image1Metadata}}}

Imagem 2: {{media url=image2DataUri}}
Metadados Imagem 2: {{{image2Metadata}}}
`,
});

const compareWoundImagesFlow = ai.defineFlow(
  {
    name: 'compareWoundImagesFlow',
    inputSchema: CompareWoundImagesInputSchema,
    outputSchema: CompareWoundImagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
