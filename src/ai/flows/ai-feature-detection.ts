// src/ai/flows/ai-feature-detection.ts
'use server';

/**
 * @fileOverview AI-powered feature detection flow for identifying landslides and boulders in lunar imagery.
 *
 * - detectLunarFeatures - A function that handles the lunar feature detection process.
 * - DetectLunarFeaturesInput - The input type for the detectLunarFeatures function.
 * - DetectLunarFeaturesOutput - The return type for the detectLunarFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectLunarFeaturesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the lunar surface, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  additionalContext: z
    .string()
    .optional()
    .describe('Any additional context or information about the image.'),
});
export type DetectLunarFeaturesInput = z.infer<typeof DetectLunarFeaturesInputSchema>;

const DetectLunarFeaturesOutputSchema = z.object({
  detectedFeatures: z.array(
    z.object({
      type: z.string().describe('The type of feature detected (e.g., landslide, boulder).'),
      confidence: z.number().describe('The confidence level of the detection (0-1).'),
      locationDescription: z
        .string()
        .describe('A textual description of the feature location within the image.'),
    })
  ).describe('A list of detected lunar features.'),
  summary: z.string().describe('A summary of the detected features and potential hazards.'),
});
export type DetectLunarFeaturesOutput = z.infer<typeof DetectLunarFeaturesOutputSchema>;

export async function detectLunarFeatures(input: DetectLunarFeaturesInput): Promise<DetectLunarFeaturesOutput> {
  return detectLunarFeaturesFlow(input);
}

const detectLunarFeaturesPrompt = ai.definePrompt({
  name: 'detectLunarFeaturesPrompt',
  input: {schema: DetectLunarFeaturesInputSchema},
  output: {schema: DetectLunarFeaturesOutputSchema},
  prompt: `You are an expert in lunar geology and image analysis. Your task is to analyze lunar images and detect potential hazards, specifically landslides and boulders.

  Analyze the following image and any additional context to identify landslides, boulders, and other notable geological features.

  Image: {{media url=photoDataUri}}
  Additional Context: {{{additionalContext}}}

  Based on your analysis, provide a list of detected features, their confidence levels, and location descriptions. Also, provide a summary of the detected features and any potential hazards they pose to lunar missions.

  Ensure that your response adheres to the DetectLunarFeaturesOutputSchema.
  `, // Ensure the prompt is well-formatted and clear
});

const detectLunarFeaturesFlow = ai.defineFlow(
  {
    name: 'detectLunarFeaturesFlow',
    inputSchema: DetectLunarFeaturesInputSchema,
    outputSchema: DetectLunarFeaturesOutputSchema,
  },
  async input => {
    const {output} = await detectLunarFeaturesPrompt(input);
    return output!;
  }
);
