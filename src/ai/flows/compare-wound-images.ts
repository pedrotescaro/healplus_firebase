'use server';

/**
 * @fileOverview An AI agent to compare wound images and assess healing progress.
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
  additionalNotes: z.string().optional().describe('Any additional notes or context for the comparison.'),
});
export type CompareWoundImagesInput = z.infer<typeof CompareWoundImagesInputSchema>;

const CompareWoundImagesOutputSchema = z.object({
  comparisonSummary: z.string().describe('A summary of the comparison between the two wound images, highlighting key differences and improvements.'),
  suggestedActions: z.string().describe('Suggested actions based on the comparison, such as changes to treatment or further monitoring.'),
});
export type CompareWoundImagesOutput = z.infer<typeof CompareWoundImagesOutputSchema>;

export async function compareWoundImages(input: CompareWoundImagesInput): Promise<CompareWoundImagesOutput> {
  return compareWoundImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareWoundImagesPrompt',
  input: {schema: CompareWoundImagesInputSchema},
  output: {schema: CompareWoundImagesOutputSchema},
  prompt: `You are an expert in wound care. Compare the two wound images provided, considering any additional notes. Highlight key differences, improvements, or areas of concern. Provide a summary of the comparison and suggest actions based on your analysis.

Image 1: {{media url=image1DataUri}}
Image 2: {{media url=image2DataUri}}

Additional Notes: {{{additionalNotes}}}`,
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
