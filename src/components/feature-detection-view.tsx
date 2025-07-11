'use client'

import React, { useState, type ChangeEvent } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { detectLunarFeatures, type DetectLunarFeaturesInput } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Upload, Locate, CheckCircle, AlertTriangle } from 'lucide-react'
import type { DetectLunarFeaturesOutput } from '@/ai/flows/ai-feature-detection'

export function FeatureDetectionView() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DetectLunarFeaturesOutput | null>(null)
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async () => {
    if (!file || !previewUrl) {
      toast({
        title: 'No file selected',
        description: 'Please select an image file to analyze.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const input: DetectLunarFeaturesInput = {
        photoDataUri: previewUrl,
        additionalContext: 'Analyze for potential landing hazards.',
      }
      const response = await detectLunarFeatures(input)
      setResult(response)
      toast({
        title: 'Analysis Complete',
        description: 'Lunar features have been successfully detected.',
      })
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Analysis Failed',
        description: `There was an error processing the image. ${errorMessage}`,
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
          <CardTitle>Upload Lunar Image</CardTitle>
          <CardDescription>Select a Chandrayaan image to detect landslides and boulders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lunar-image">Image File</Label>
            <Input id="lunar-image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {file ? file.name : 'Select an Image'}
            </Button>
          </div>
          {previewUrl && (
            <div className="relative aspect-video w-full rounded-md overflow-hidden border">
              <Image src={previewUrl} alt="Lunar surface preview" layout="fill" objectFit="cover" data-ai-hint="lunar surface" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Locate className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Analyzing...' : 'Detect Features'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>Detected features and hazard summary will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Performing AI-powered feature detection...</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Detected Features</h3>
                <ul className="space-y-2">
                  {result.detectedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start p-2 rounded-md bg-secondary/50">
                      {feature.type.toLowerCase().includes('boulder') ? 
                        <CheckCircle className="h-5 w-5 mr-3 mt-1 text-primary" /> :
                        <AlertTriangle className="h-5 w-5 mr-3 mt-1 text-destructive" />
                      }
                      <div>
                        <p className="font-medium capitalize">{feature.type}</p>
                        <p className="text-sm text-muted-foreground">{feature.locationDescription}</p>
                        <p className="text-xs text-muted-foreground">Confidence: {(feature.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Upload an image to begin analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
