'use server';

/**
 * @fileOverview A temporal analysis AI flow for comparing lunar images over time.
 *
 * - analyzeTemporalChanges - A function that handles the temporal analysis process.
 * - TemporalAnalysisInput - The input type for the analyzeTemporalChanges function.
 * - TemporalAnalysisOutput - The return type for the analyzeTemporalChanges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TemporalAnalysisInputSchema = z.object({
  imageBeforeUri: z
    .string()
    .describe(
      "The first lunar image (before), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  imageAfterUri: z
    .string()
    .describe(
      "The second lunar image (after), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  dateBefore: z.string().describe('The date the "before" image was taken.'),
  dateAfter: z.string().describe('The date the "after" image was taken.'),
});
export type TemporalAnalysisInput = z.infer<typeof TemporalAnalysisInputSchema>;

const TemporalAnalysisOutputSchema = z.object({
  changeSummary: z.string().describe('A high-level summary of the detected changes between the two images.'),
  detailedChanges: z.array(
    z.object({
      description: z.string().describe('A detailed description of a specific change.'),
      location: z.string().describe('The location of the change within the image.'),
      significance: z.enum(['low', 'medium', 'high']).describe('The significance of the change.'),
    })
  ).describe('A list of detailed changes found.'),
});
export type TemporalAnalysisOutput = z.infer<typeof TemporalAnalysisOutputSchema>;


export async function analyzeTemporalChanges(input: TemporalAnalysisInput): Promise<TemporalAnalysisOutput> {
  return temporalAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'temporalAnalysisPrompt',
  input: {schema: TemporalAnalysisInputSchema},
  output: {schema: TemporalAnalysisOutputSchema},
  prompt: `You are an expert in lunar geology and temporal image analysis. Your task is to compare two images of the same lunar region taken at different times and identify any geological changes.

  Image Before (taken on {{dateBefore}}):
  {{media url=imageBeforeUri}}

  Image After (taken on {{dateAfter}}):
  {{media url=imageAfterUri}}

  Analyze these two images to identify any changes such as new craters, boulder movements, landslides, or any other surface disturbances. Provide a summary of your findings and a detailed list of each significant change you detect, including its location and significance for mission planning.
  `,
});

const temporalAnalysisFlow = ai.defineFlow(
  {
    name: 'temporalAnalysisFlow',
    inputSchema: TemporalAnalysisInputSchema,
    outputSchema: TemporalAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
