'use server';

import { z } from 'zod';
import {
  detectLunarFeatures as detectLunarFeaturesFlow,
  DetectLunarFeaturesInput as DetectLunarFeaturesInputType,
} from '@/ai/flows/ai-feature-detection';
import {
  analyzeShadowSlope as analyzeShadowSlopeFlow,
  AnalyzeShadowSlopeInput as AnalyzeShadowSlopeInputType,
} from '@/ai/flows/shadow-slope-analysis';
import {
  enhanceGeologicalReasoning as enhanceGeologicalReasoningFlow,
  EnhanceGeologicalReasoningInput as EnhanceGeologicalReasoningInputType,
} from '@/ai/flows/enhance-geological-reasoning';
import {
  analyzeTemporalChanges as analyzeTemporalChangesFlow,
  TemporalAnalysisInput as TemporalAnalysisInputType,
} from '@/ai/flows/temporal-analysis';


export type DetectLunarFeaturesInput = DetectLunarFeaturesInputType;
export type AnalyzeShadowSlopeInput = AnalyzeShadowSlopeInputType;
export type EnhanceGeologicalReasoningInput = EnhanceGeologicalReasoningInputType;
export type TemporalAnalysisInput = TemporalAnalysisInputType;


const DataUriSchema = z.string().refine(val => val.startsWith('data:'), {
    message: 'Must be a valid data URI.',
});

const DetectLunarFeaturesServerInputSchema = z.object({
  photoDataUri: DataUriSchema,
  additionalContext: z.string().optional(),
});

export async function detectLunarFeatures(input: DetectLunarFeaturesInput) {
    const validatedInput = DetectLunarFeaturesServerInputSchema.parse(input);
    return await detectLunarFeaturesFlow(validatedInput);
}


const AnalyzeShadowSlopeServerInputSchema = z.object({
    imageUri: DataUriSchema,
    dtmUri: DataUriSchema,
    description: z.string(),
});

export async function analyzeShadowSlope(input: AnalyzeShadowSlopeInput) {
    const validatedInput = AnalyzeShadowSlopeServerInputSchema.parse(input);
    return await analyzeShadowSlopeFlow(validatedInput);
}

const EnhanceGeologicalReasoningServerInputSchema = z.object({
    extractedFeatures: z.string(),
    knownGeologicalData: z.string(),
});

export async function enhanceGeologicalReasoning(input: EnhanceGeologicalReasoningInput) {
    const validatedInput = EnhanceGeologicalReasoningServerInputSchema.parse(input);
    return await enhanceGeologicalReasoningFlow(validatedInput);
}

const TemporalAnalysisServerInputSchema = z.object({
    imageBeforeUri: DataUriSchema,
    imageAfterUri: DataUriSchema,
    dateBefore: z.string(),
    dateAfter: z.string(),
});

export async function analyzeTemporalChanges(input: TemporalAnalysisInput) {
    const validatedInput = TemporalAnalysisServerInputSchema.parse(input);
    return await analyzeTemporalChangesFlow(validatedInput);
}
