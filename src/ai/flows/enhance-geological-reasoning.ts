// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Enhances geological reasoning by correlating extracted lunar features with known geological data using an LLM.
 *
 * - enhanceGeologicalReasoning - A function that enhances geological reasoning for lunar risk assessment.
 * - EnhanceGeologicalReasoningInput - The input type for the enhanceGeologicalReasoning function.
 * - EnhanceGeologicalReasoningOutput - The return type for the enhanceGeologicalReasoning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceGeologicalReasoningInputSchema = z.object({
  extractedFeatures: z
    .string()
    .describe('Extracted lunar features such as landslides and boulders.'),
  knownGeologicalData: z
    .string()
    .describe('Known geological data of the lunar surface.'),
});
export type EnhanceGeologicalReasoningInput = z.infer<
  typeof EnhanceGeologicalReasoningInputSchema
>;

const EnhanceGeologicalReasoningOutputSchema = z.object({
  riskZoneMapping: z
    .string()
    .describe('A risk zone map based on the analyzed features and data.'),
  llmContextualAnalysis: z
    .string()
    .describe('Contextual analysis provided by the LLM.'),
});
export type EnhanceGeologicalReasoningOutput = z.infer<
  typeof EnhanceGeologicalReasoningOutputSchema
>;

export async function enhanceGeologicalReasoning(
  input: EnhanceGeologicalReasoningInput
): Promise<EnhanceGeologicalReasoningOutput> {
  return enhanceGeologicalReasoningFlow(input);
}

const enhanceGeologicalReasoningPrompt = ai.definePrompt({
  name: 'enhanceGeologicalReasoningPrompt',
  input: {schema: EnhanceGeologicalReasoningInputSchema},
  output: {schema: EnhanceGeologicalReasoningOutputSchema},
  prompt: `You are a geologist specializing in lunar risk assessment. Analyze the extracted lunar features and correlate them with known geological data to identify and map risk zones accurately.

  Extracted Features: {{{extractedFeatures}}}
  Known Geological Data: {{{knownGeologicalData}}}

  Based on your analysis, provide a risk zone mapping and contextual analysis.
  Output a string that can be put into a geojson file for the riskZoneMapping field, and then a paragraph form analysis for the llmContextualAnalysis field.
  `,
});

const enhanceGeologicalReasoningFlow = ai.defineFlow(
  {
    name: 'enhanceGeologicalReasoningFlow',
    inputSchema: EnhanceGeologicalReasoningInputSchema,
    outputSchema: EnhanceGeologicalReasoningOutputSchema,
  },
  async input => {
    const {output} = await enhanceGeologicalReasoningPrompt(input);
    return output!;
  }
);
