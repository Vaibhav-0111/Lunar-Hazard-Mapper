'use server';

/**
 * @fileOverview Analyzes shadow and slope-based features to differentiate between natural terrain and displaced mass.
 *
 * - analyzeShadowSlope - A function that handles the shadow and slope analysis process.
 * - AnalyzeShadowSlopeInput - The input type for the analyzeShadowSlope function.
 * - AnalyzeShadowSlopeOutput - The return type for the analyzeShadowSlope function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeShadowSlopeInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "A lunar surface image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  dtmUri: z
    .string()
    .describe(
      'A lunar Digital Terrain Model (DTM) data URI, which must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  description: z.string().describe('The description of the area being analyzed.'),
});
export type AnalyzeShadowSlopeInput = z.infer<typeof AnalyzeShadowSlopeInputSchema>;

const AnalyzeShadowSlopeOutputSchema = z.object({
  analysisResults: z.string().describe('The analysis results of shadow and slope-based features.'),
  riskAssessment: z.string().describe('The risk assessment based on the analysis of displaced mass.'),
});
export type AnalyzeShadowSlopeOutput = z.infer<typeof AnalyzeShadowSlopeOutputSchema>;

export async function analyzeShadowSlope(input: AnalyzeShadowSlopeInput): Promise<AnalyzeShadowSlopeOutput> {
  return analyzeShadowSlopeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeShadowSlopePrompt',
  input: {schema: AnalyzeShadowSlopeInputSchema},
  output: {schema: AnalyzeShadowSlopeOutputSchema},
  prompt: `You are an expert lunar geologist specializing in analyzing lunar terrain.

You will use the image and DTM data provided to analyze shadow and slope-based features to differentiate between natural terrain and displaced mass. Provide a risk assessment based on your findings.

Description: {{{description}}}
Image: {{media url=imageUri}}
DTM: {{media url=dtmUri}}`,
});

const analyzeShadowSlopeFlow = ai.defineFlow(
  {
    name: 'analyzeShadowSlopeFlow',
    inputSchema: AnalyzeShadowSlopeInputSchema,
    outputSchema: AnalyzeShadowSlopeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
