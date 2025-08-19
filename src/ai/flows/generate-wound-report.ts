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
  prompt: `Você é um médico especialista em tratamento de feridas. Sua tarefa é gerar um relatório de avaliação e plano de tratamento detalhado, em **português**, com base na imagem da ferida e nos dados de anamnese do paciente fornecidos.

**Instruções:**
1.  **Análise Integrada:** Analise a imagem da ferida em conjunto com os dados da anamnese. Correlacione as características visuais da ferida com o histórico do paciente (ex: comorbidades como diabetes, uso de medicamentos, hábitos de vida) para fornecer um diagnóstico mais preciso.
2.  **Estrutura do Relatório:** O relatório deve ser bem estruturado, usando Markdown para formatação (títulos, listas). Siga a estrutura:
    *   **Avaliação da Ferida:** Descreva detalhadamente o que você observa na imagem (tipo de tecido, bordas, exsudato, sinais de infecção, etc.).
    *   **Diagnóstico Provável:** Com base na análise integrada, forneça um diagnóstico provável da etiologia e do estado atual da ferida.
    *   **Plano de Tratamento Sugerido:** Recomende os próximos passos, incluindo tipos de curativo, frequência de troca, e outras intervenções necessárias.
    *   **Fatores de Risco e Recomendações:** Destaque como os fatores da anamnese (ex: nutrição, doenças) podem impactar a cicatrização e forneça recomendações gerais ao paciente.

**Dados para Análise:**

**1. Imagem da Ferida:**
{{media url=woundImage}}

**2. Dados de Anamnese (JSON):**
\`\`\`json
{{{anamnesisData}}}
\`\`\`

Gere agora o relatório completo e formatado.`,
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
