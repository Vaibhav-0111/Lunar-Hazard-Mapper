'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { enhanceGeologicalReasoning, type EnhanceGeologicalReasoningInput } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Bot, BrainCircuit } from 'lucide-react'
import type { EnhanceGeologicalReasoningOutput } from '@/ai/flows/enhance-geological-reasoning'

export function GeologicalReasoningView() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<EnhanceGeologicalReasoningOutput | null>(null)
  const [formState, setFormState] = useState<EnhanceGeologicalReasoningInput>({
    extractedFeatures: '{"type": "landslide", "location": "15.S, 30.W", "size": "500m^2"}, {"type": "boulder_field", "location": "15.2S, 30.1W", "density": "high"}',
    knownGeologicalData: 'The area is known for steep slopes and frequent seismic activity, consistent with the Tycho crater region. Soil composition is primarily anorthositic regolith.',
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formState.extractedFeatures || !formState.knownGeologicalData) {
      toast({
        title: 'Input missing',
        description: 'Please provide both extracted features and geological data.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await enhanceGeologicalReasoning(formState)
      setResult(response)
      toast({
        title: 'Reasoning Complete',
        description: 'Geological context and risk zones have been generated.',
      })
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Reasoning Failed',
        description: `There was an error during analysis. ${errorMessage}`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const prettyPrintJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return jsonString; // Return original string if it's not valid JSON
    }
  };


  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Input Data</CardTitle>
          <CardDescription>Provide extracted features and known geological data for analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="extractedFeatures">Extracted Features (JSON)</Label>
            <Textarea
              id="extractedFeatures"
              name="extractedFeatures"
              value={formState.extractedFeatures}
              onChange={handleChange}
              rows={5}
              placeholder='e.g., {"type": "landslide", "location": "..."}'
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="knownGeologicalData">Known Geological Data</Label>
            <Textarea
              id="knownGeologicalData"
              name="knownGeologicalData"
              value={formState.knownGeologicalData}
              onChange={handleChange}
              rows={5}
              placeholder="e.g., The area is known for steep slopes..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
            {isLoading ? 'Analyzing...' : 'Enhance with AI Reasoning'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Enhanced Analysis</CardTitle>
          <CardDescription>Contextual analysis and risk mapping from the LLM.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Correlating data and generating insights...</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Bot className="mr-2 h-4 w-4 text-primary" /> LLM Contextual Analysis
                </h3>
                <p className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md whitespace-pre-wrap">{result.llmContextualAnalysis}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Risk Zone Mapping (GeoJSON)</h3>
                <Textarea
                  readOnly
                  value={prettyPrintJson(result.riskZoneMapping)}
                  className="font-mono text-xs bg-secondary/50"
                  rows={10}
                />
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Provide input data to begin analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
