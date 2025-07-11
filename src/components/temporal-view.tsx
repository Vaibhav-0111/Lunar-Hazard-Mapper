'use client'

import React, { useState, type ChangeEvent } from 'react';
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, GitCompareArrows, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { analyzeTemporalChanges, type TemporalAnalysisInput } from '@/lib/actions';
import type { TemporalAnalysisOutput } from '@/ai/flows/temporal-analysis';

interface ImageState {
  file: File | null;
  previewUrl: string | null;
  date: string;
}

const initialImageState = { file: null, previewUrl: null, date: new Date().toISOString().split('T')[0] };

export function TemporalView() {
  const [imageBefore, setImageBefore] = useState<ImageState>(initialImageState);
  const [imageAfter, setImageAfter] = useState<ImageState>({ ...initialImageState, date: new Date(Date.now() + 86400000).toISOString().split('T')[0] });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TemporalAnalysisOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, imageSetter: React.Dispatch<React.SetStateAction<ImageState>>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageSetter(prev => ({ ...prev, file: selectedFile, previewUrl: reader.result as string }));
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>, imageSetter: React.Dispatch<React.SetStateAction<ImageState>>) => {
    imageSetter(prev => ({ ...prev, date: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!imageBefore.file || !imageAfter.file || !imageBefore.previewUrl || !imageAfter.previewUrl) {
      toast({
        title: 'Files missing',
        description: 'Please select both "before" and "after" images.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const input: TemporalAnalysisInput = {
        imageBeforeUri: imageBefore.previewUrl,
        imageAfterUri: imageAfter.previewUrl,
        dateBefore: imageBefore.date,
        dateAfter: imageAfter.date,
      };
      const response = await analyzeTemporalChanges(input);
      setResult(response);
      toast({
        title: 'Analysis Complete',
        description: 'Temporal analysis finished successfully.',
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Analysis Failed',
        description: `There was an error processing the images. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const significanceIcons = {
    low: <CheckCircle className="h-5 w-5 text-green-500" />,
    medium: <Info className="h-5 w-5 text-yellow-500" />,
    high: <AlertTriangle className="h-5 w-5 text-destructive" />,
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Temporal Image Comparison</CardTitle>
          <CardDescription>Upload two images from different dates to detect changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Before */}
            <div className="space-y-4">
              <Label>Image Before</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setImageBefore)} />
              <Input type="date" value={imageBefore.date} onChange={(e) => handleDateChange(e, setImageBefore)} />
              {imageBefore.previewUrl && (
                <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                  <Image src={imageBefore.previewUrl} alt="Before" layout="fill" objectFit="cover" data-ai-hint="lunar landscape" />
                </div>
              )}
            </div>
            {/* Image After */}
            <div className="space-y-4">
              <Label>Image After</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setImageAfter)} />
              <Input type="date" value={imageAfter.date} onChange={(e) => handleDateChange(e, setImageAfter)} />
              {imageAfter.previewUrl && (
                <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                  <Image src={imageAfter.previewUrl} alt="After" layout="fill" objectFit="cover" data-ai-hint="lunar landscape" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading || !imageBefore.file || !imageAfter.file} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GitCompareArrows className="mr-2 h-4 w-4" />}
            {isLoading ? 'Analyzing...' : 'Analyze Changes'}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>Detected changes will be listed here.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Comparing images for temporal changes...</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Change Summary</h3>
                <p className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">{result.changeSummary}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Detailed Changes</h3>
                {result.detailedChanges.length > 0 ? (
                  <ul className="space-y-2">
                    {result.detailedChanges.map((change, index) => (
                      <li key={index} className="flex items-start p-2 rounded-md bg-secondary/50">
                        <div className="mr-3 mt-1">{significanceIcons[change.significance]}</div>
                        <div>
                          <p className="font-medium">{change.location}</p>
                          <p className="text-sm text-muted-foreground">{change.description}</p>
                          <p className="text-xs text-muted-foreground">Significance: <span className="capitalize">{change.significance}</span></p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No significant changes were detected.</p>
                )}
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Upload two images to begin analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
