'use client';

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, Loader2 } from "lucide-react"

export function SurfaceModelView() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGeneration = () => {
    setIsGenerating(true)
    setIsGenerated(false)
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>3D Surface Model Generation</CardTitle>
          <CardDescription>
            Convert 2D lunar data into 3D surface models using photoclinometry integration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2D Source Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square w-full rounded-md overflow-hidden bg-muted">
                    <Image src="https://placehold.co/600x600.png" alt="2D Lunar Data" layout="fill" objectFit="cover" data-ai-hint="moon texture" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated 3D Model</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="relative aspect-square w-full rounded-md overflow-hidden bg-muted flex items-center justify-center">
                   {isGenerating && <Loader2 className="w-10 h-10 animate-spin text-primary"/>}
                   {isGenerated && <Image src="https://placehold.co/600x600.png" alt="3D Model of Lunar Surface" layout="fill" objectFit="cover" className="transform perspective-1000 rotate-y-30 -rotate-x-10 scale-90" data-ai-hint="3d render moon" />}
                   {!isGenerating && !isGenerated && <p className="text-muted-foreground text-sm">Click Generate</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleGeneration} disabled={isGenerating}>
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? "Generating..." : "Generate 3D Model"}
        </Button>
      </div>
    </div>
  )
}
