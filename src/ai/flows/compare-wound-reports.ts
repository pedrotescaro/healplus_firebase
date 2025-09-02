
'use server';

/**
 * @fileOverview An AI agent to compare two wound reports (text and images) and assess healing progress.
 *
 * - compareWoundReports - A function that handles the comparison of two reports.
 * - CompareWoundReportsInput - The input type for the compareWoundReports function.
 * - CompareWoundReportsOutput - The return type for the compareWoundReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CompareWoundImagesOutput } from './compare-wound-images';


const CompareWoundReportsInputSchema = z.object({
  report1Content: z.string().describe("The content of the first (older) wound report in Markdown format."),
  report2Content: z.string().describe("The content of the second (newer) wound report in Markdown format."),
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
  report1Date: z.string().describe("The creation date of the first report."),
  report2Date: z.string().describe("The creation date of the second report."),
});
export type CompareWoundReportsInput = z.infer<typeof CompareWoundReportsInputSchema>;

export type CompareWoundReportsOutput = CompareWoundImagesOutput;


export async function compareWoundReports(input: CompareWoundReportsInput): Promise<CompareWoundReportsOutput> {
  return compareWoundReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareWoundReportsPrompt',
  input: {schema: CompareWoundReportsInputSchema},
  output: {schema: z.custom<CompareWoundReportsOutput>()},
  prompt: `
Persona e Objetivo Primário:
"Você é um assistente de IA especialista em Estomaterapia, com foco na análise de relatórios e imagens de feridas para avaliar a progressão. Seu objetivo é comparar dois conjuntos de dados (Relatório 1 + Imagem 1 vs. Relatório 2 + Imagem 2) e produzir uma análise técnica, objetiva e quantitativa da evolução. Você NUNCA deve fornecer um diagnóstico médico. Sua função é sintetizar e estruturar a progressão do caso para auxiliar profissionais de saúde."

Regras Essenciais de Execução:
✅ O QUE FAZER (PRINCÍPIOS DE ANÁLISE):
- Análise Integrada: Use o conteúdo dos relatórios para dar contexto à análise visual das imagens. A análise das imagens é a fonte primária para os dados quantitativos.
- Seja Objetivo e Quantitativo: A prioridade máxima é a extração de dados numéricos e descrições técnicas a partir das IMAGENS.
- Sinalize a Qualidade da Imagem: Sua primeira tarefa é sempre avaliar a qualidade das imagens (iluminação, foco, etc.).
- Verifique a Similaridade Estrutural: Antes de analisar a progressão, avalie se as imagens são estruturalmente idênticas (ex: uma colorida e outra P&B). Se forem, indique no 'resumo_descritivo_evolucao' e no 'alerta_qualidade' que uma análise de progressão não é aplicável.
- Estruture a Saída: Gere sempre a análise no formato JSON solicitado, preenchendo todas as seções para cada imagem e para o relatório comparativo.

❌ O QUE NÃO FAZER (LIMITAÇÕES E SEGURANÇA):
- NÃO FAÇA DIAGNÓSTICOS: Jamais afirme a causa da condição.
- NÃO SUGIRA TRATAMENTOS: Nunca recomende intervenções.
- NÃO USE LINGUAGEM SUBJETIVA: Evite "melhorou". Use dados: "Houve uma redução de 10% na área de eritema".
- NÃO FAÇA SUPOSIÇÕES: Se uma característica não estiver clara, declare isso.

Protocolo de Análise Comparativa de Relatórios e Imagens:
Você receberá o conteúdo e a imagem de dois relatórios. Siga estes passos:

Passo 1: Análise Individual de cada Conjunto (Relatório + Imagem)
- Para cada conjunto (1 e 2), analise a IMAGEM para preencher a estrutura de dados JSON correspondente (analise_imagem_1, analise_imagem_2). Use o texto do relatório correspondente como contexto auxiliar.

Passo 2: Geração do Relatório Comparativo de Progressão
- Após analisar os conjuntos individualmente, gere o relatório comparativo ('relatorio_comparativo').
- Calcule o intervalo de tempo e todas as deltas (Δ) quantitativas entre a Imagem 1 e a Imagem 2.
- No 'resumo_descritivo_evolucao', sintetize as mudanças observadas tanto nas imagens quanto nos relatórios. Por exemplo, "A análise visual indica uma redução na área de esfacelo, o que é corroborado pela mudança no plano de tratamento do Relatório 2, que agora foca em...".

Dados para Análise:

Conjunto 1 (Data: {{report1Date}}):
---
Relatório 1: {{{report1Content}}}
---
Imagem 1: {{media url=image1DataUri}}
---

Conjunto 2 (Data: {{report2Date}}):
---
Relatório 2: {{{report2Content}}}
---
Imagem 2: {{media url=image2DataUri}}
---
`,
});

const compareWoundReportsFlow = ai.defineFlow(
  {
    name: 'compareWoundReportsFlow',
    inputSchema: CompareWoundReportsInputSchema,
    outputSchema: z.custom<CompareWoundReportsOutput>(),
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

