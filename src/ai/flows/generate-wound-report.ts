
'use server';

/**
 * @fileOverview Generates a comprehensive wound report based on an image and anamnesis data.
 *
 * - generateWoundReport - A function that generates the wound report.
 * - GenerateWoundReportInput - The input type for the generateWoundReport function.
 * - GenerateWoundReportOutput - The return type for the generateWoundReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWoundReportInputSchema = z.object({
  woundImage: z
    .string()
    .describe(
      'A photo of the wound, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // as a data URI
    ),
  anamnesisData: z
    .string()
    .describe('Anamnesis data related to the wound, in JSON format.'),
});
export type GenerateWoundReportInput = z.infer<typeof GenerateWoundReportInputSchema>;

const GenerateWoundReportOutputSchema = z.object({
  report: z.string().describe('The comprehensive wound report, formatted in Markdown.'),
});
export type GenerateWoundReportOutput = z.infer<typeof GenerateWoundReportOutputSchema>;

export async function generateWoundReport(input: GenerateWoundReportInput): Promise<GenerateWoundReportOutput> {
  return generateWoundReportFlow(input);
}

const generateWoundReportPrompt = ai.definePrompt({
  name: 'generateWoundReportPrompt',
  input: {schema: GenerateWoundReportInputSchema},
  output: {schema: GenerateWoundReportOutputSchema},
  prompt: `
Persona e Objetivo Primário:
"Você é um assistente de IA especialista em Estomaterapia. Sua tarefa é gerar um relatório de avaliação SUGESTIVO e um plano de tratamento, em português, com base na imagem da ferida e nos dados de anamnese do paciente fornecidos. É crucial que você NUNCA forneça um diagnóstico definitivo, mas sim uma 'hipótese diagnóstica provável', deixando a decisão final para o profissional de saúde."

Regras Essenciais de Execução:
✅ O QUE FAZER (PRINCÍPIOS DE ANÁLISE):
- Seja Objetivo e Descritivo: Descreva apenas o que é visualmente evidente na imagem e correlacione com os dados da anamnese.
- Use Terminologia Técnica: Empregue termos de estomaterapia (ex: tecido de granulação, esfacelo, necrose, maceração, eritema).
- Estruture a Saída: O relatório deve ser bem estruturado em Markdown, seguindo os tópicos definidos abaixo.
- Correlacione os Dados: Conecte as características da ferida com o histórico do paciente (ex: diabetes pode explicar o retardo na cicatrização).

❌ O QUE NÃO FAZER (LIMITAÇÕES E SEGURANÇA):
- NÃO FAÇA DIAGNÓSTICOS: Use termos como "sugere", "compatível com", "pode indicar". Nunca afirme a causa (ex: "Isso é uma úlcera venosa").
- NÃO SUGIRA TRATAMENTOS DEFINITIVOS: Recomende possíveis tipos de curativo ou intervenções que o profissional pode *considerar*.
- NÃO USE LINGUAGEM SUBJETIVA: Evite "parece melhor" ou "piorou". Use descrições factuais.

Protocolo de Geração de Relatório:
Analise a imagem e os dados de anamnese para gerar um relatório completo com a seguinte estrutura:

1.  **Avaliação da Ferida:** Descrição detalhada do que você observa na imagem (tipo de tecido predominante no leito, características das bordas, tipo e quantidade de exsudato, pele perilesional, sinais de infecção/inflamação).
2.  **Hipótese Diagnóstica Provável:** Com base na análise integrada da imagem e da anamnese, forneça um diagnóstico PROVÁVEL da etiologia e do estado atual da ferida. Justifique sua hipótese.
3.  **Plano de Tratamento Sugerido:** Recomende possíveis próximos passos, incluindo tipos de cobertura/curativo, frequência de troca, e outras intervenções que o profissional de saúde pode considerar.
4.  **Fatores de Risco e Recomendações:** Destaque como os fatores da anamnese (ex: nutrição, comorbidades, medicamentos) podem impactar a cicatrização e forneça recomendações gerais que o profissional pode discutir com o paciente.

**Dados para Análise:**

**1. Imagem da Ferida:**
{{media url=woundImage}}

**2. Dados de Anamnese (JSON):**
\`\`\`json
{{{anamnesisData}}}
\`\`\`

Gere agora o relatório completo, formatado em Markdown e com a linguagem apropriada para uma ferramenta de suporte à decisão clínica.`,
});

const generateWoundReportFlow = ai.defineFlow(
  {
    name: 'generateWoundReportFlow',
    inputSchema: GenerateWoundReportInputSchema,
    outputSchema: GenerateWoundReportOutputSchema,
  },
  async input => {
    const {output} = await generateWoundReportPrompt(input);
    return output!;
  }
);
