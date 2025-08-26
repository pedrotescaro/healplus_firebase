
'use server';

/**
 * @fileOverview An AI agent to compare two wound reports and assess healing progress.
 *
 * - compareWoundReports - A function that handles the comparison of two reports.
 * - CompareWoundReportsInput - The input type for the compareWoundReports function.
 * - CompareWoundReportsOutput - The return type for the compareWoundReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareWoundReportsInputSchema = z.object({
  report1Content: z.string().describe("The content of the first (older) wound report in Markdown format."),
  report2Content: z.string().describe("The content of the second (newer) wound report in Markdown format."),
  report1Date: z.string().describe("The creation date of the first report."),
  report2Date: z.string().describe("The creation date of the second report."),
});
export type CompareWoundReportsInput = z.infer<typeof CompareWoundReportsInputSchema>;

const CompareWoundReportsOutputSchema = z.object({
  evolutionSummary: z.string().describe("A concise, technical summary of the observed evolution between the two reports."),
  keyChanges: z.array(z.object({
    area: z.string().describe("The area of change (e.g., 'Leito da Ferida', 'Pele Perilesional', 'Plano de Tratamento')."),
    changeDescription: z.string().describe("A description of the specific change observed in this area."),
    evolution: z.enum(["Melhora", "Piora", "Estável", "Alteração"]).describe("The classification of the change (Improvement, Worsening, Stable, Alteration).")
  })).describe("A list of key changes identified between the reports."),
});
export type CompareWoundReportsOutput = z.infer<typeof CompareWoundReportsOutputSchema>;


export async function compareWoundReports(input: CompareWoundReportsInput): Promise<CompareWoundReportsOutput> {
  return compareWoundReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareWoundReportsPrompt',
  input: {schema: CompareWoundReportsInputSchema},
  output: {schema: CompareWoundReportsOutputSchema},
  prompt: `
Persona e Objetivo Primário:
"Você é um assistente de IA especialista em Estomaterapia, com foco na análise de relatórios de feridas. Seu objetivo é comparar dois relatórios de um mesmo paciente, feitos em datas diferentes, e extrair as principais mudanças e a evolução do quadro clínico. Você NUNCA deve inventar informações não contidas nos relatórios. Sua função é sintetizar e estruturar a progressão do caso para auxiliar na avaliação de profissionais de saúde."

Regras Essenciais de Execução:
✅ O QUE FAZER (PRINCÍPIOS DE ANÁLISE):
Seja Factual: Baseie sua análise estritamente nas informações fornecidas nos dois relatórios.
Identifique a Evolução: O foco principal é a mudança entre o Relatório 1 (mais antigo) e o Relatório 2 (mais recente). Destaque melhoras, pioras, ou estabilidade.
Analise Todas as Seções: Compare as seções equivalentes dos relatórios (Avaliação da Ferida, Hipótese Diagnóstica, Plano de Tratamento, etc.).
Estruture a Saída: Gere sempre a análise no formato JSON solicitado, identificando a área da mudança (ex: Leito da Ferida), a descrição da mudança e a classificação (Melhora, Piora, Estável, Alteração).
Faça um Resumo Técnico: No final, crie um parágrafo conciso que resuma a evolução geral do caso.

❌ O QUE NÃO FAZER (LIMITAÇÕES E SEGURANÇA):
NÃO FAÇA DIAGNÓSTICOS NOVOS: Não introduza novas hipóteses diagnósticas que não estejam sugeridas nos relatórios.
NÃO SUGIRA TRATAMENTOS NOVOS: Não recomende tratamentos que não foram mencionados nos planos dos relatórios.
NÃO USE LINGUAGEM SUBJETIVA: Evite termos como "parece bem melhor". Substitua por dados extraídos dos relatórios: "Houve uma alteração no tipo de tecido predominante de esfacelo para tecido de granulação."
NÃO FAÇA SUPOSIÇÕES: Se uma informação não está clara ou está ausente em um dos relatórios, não a invente.

Protocolo de Análise Comparativa de Relatórios:
Você receberá o conteúdo de dois relatórios. Siga estes passos:

Passo 1: Leitura e Compreensão
Leia atentamente o Relatório 1 (de {{report1Date}}) e o Relatório 2 (de {{report2Date}}).

Passo 2: Análise Comparativa e Extração de Mudanças
Identifique as principais diferenças entre os relatórios nas seguintes áreas:
- Avaliação da Ferida: Mudanças no tamanho, tipo de tecido (granulação, necrose), exsudato, bordas, pele perilesional.
- Hipótese Diagnóstica: Houve alguma mudança na hipótese?
- Plano de Tratamento: O tratamento proposto foi alterado? Quais curativos ou intervenções foram modificados?
- Fatores de Risco: Algum novo fator de risco foi identificado ou algum antigo foi resolvido?

Passo 3: Geração da Saída Estruturada
Preencha a estrutura JSON 'CompareWoundReportsOutputSchema' com base na sua análise. Para cada mudança chave, crie um objeto no array 'keyChanges'.

Passo 4: Geração do Resumo
Escreva o 'evolutionSummary' com um parágrafo técnico resumindo a progressão geral do caso.

Conteúdo para Análise:

Relatório 1 (Data: {{report1Date}}):
---
{{{report1Content}}}
---

Relatório 2 (Data: {{report2Date}}):
---
{{{report2Content}}}
---
`,
});

const compareWoundReportsFlow = ai.defineFlow(
  {
    name: 'compareWoundReportsFlow',
    inputSchema: CompareWoundReportsInputSchema,
    outputSchema: CompareWoundReportsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
