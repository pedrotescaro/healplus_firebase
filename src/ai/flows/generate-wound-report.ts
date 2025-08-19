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
    .describe('Anamnesis data related to the wound.'),
});
export type GenerateWoundReportInput = z.infer<typeof GenerateWoundReportInputSchema>;

const GenerateWoundReportOutputSchema = z.object({
  report: z.string().describe('The comprehensive wound report.'),
});
export type GenerateWoundReportOutput = z.infer<typeof GenerateWoundReportOutputSchema>;

export async function generateWoundReport(input: GenerateWoundReportInput): Promise<GenerateWoundReportOutput> {
  return generateWoundReportFlow(input);
}

const generateWoundReportPrompt = ai.definePrompt({
  name: 'generateWoundReportPrompt',
  input: {schema: GenerateWoundReportInputSchema},
  output: {schema: GenerateWoundReportOutputSchema},
  prompt: `You are a medical expert specializing in wound care. Analyze the wound image and the provided anamnesis data to generate a comprehensive wound report.

Wound Image: {{media url=woundImage}}
Anamnesis Data: {{{anamnesisData}}}

Generate a detailed report including wound type, healing stage, potential complications, and recommended care steps. Provide a summary and recommendations based on your analysis.`,
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
