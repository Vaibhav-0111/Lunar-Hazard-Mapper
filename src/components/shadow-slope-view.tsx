'use client'

import React, { useState, type ChangeEvent } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { analyzeShadowSlope, type AnalyzeShadowSlopeInput } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Upload, SlidersHorizontal, FileJson, Mountain } from 'lucide-react'
import type { AnalyzeShadowSlopeOutput } from '@/ai/flows/shadow-slope-analysis'

export function ShadowSlopeView() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [dtmFile, setDtmFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeShadowSlopeOutput | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'image' | 'dtm') => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (fileType === 'image') {
        setImageFile(selectedFile)
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(selectedFile)
      } else {
        setDtmFile(selectedFile)
      }
      setResult(null)
    }
  }

  const handleSubmit = async () => {
    if (!imageFile || !dtmFile || !imagePreview) {
      toast({
        title: 'Files missing',
        description: 'Please select both an image and a DTM file.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const dtmDataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(dtmFile)
      })

      const input: AnalyzeShadowSlopeInput = {
        imageUri: imagePreview,
        dtmUri: dtmDataUri,
        description: `Analysis of ${imageFile.name}`,
      }
      const response = await analyzeShadowSlope(input)
      setResult(response)
      toast({
        title: 'Analysis Complete',
        description: 'Shadow and slope analysis finished successfully.',
      })
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Analysis Failed',
        description: `There was an error processing the files. ${errorMessage}`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Data</CardTitle>
          <CardDescription>Select a lunar image and its corresponding Digital Terrain Model (DTM).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lunar-image">Lunar Image</Label>
            <Input id="lunar-image" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dtm-file">DTM File</Label>
            <Input id="dtm-file" type="file" onChange={(e) => handleFileChange(e, 'dtm')} />
          </div>
          {imagePreview && (
            <div className="relative aspect-video w-full rounded-md overflow-hidden border">
              <Image src={imagePreview} alt="Lunar surface preview" layout="fill" objectFit="cover" data-ai-hint="lunar landscape" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading || !imageFile || !dtmFile} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SlidersHorizontal className="mr-2 h-4 w-4" />}
            {isLoading ? 'Analyzing...' : 'Analyze Shadow & Slope'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>Analysis of terrain vs. displaced mass and risk assessment.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Analyzing shadows and slopes...</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center"><Mountain className="mr-2 h-4 w-4 text-primary" /> Analysis Results</h3>
                <p className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">{result.analysisResults}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center"><FileJson className="mr-2 h-4 w-4 text-primary" /> Risk Assessment</h3>
                <p className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">{result.riskAssessment}</p>
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Upload files to begin analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
