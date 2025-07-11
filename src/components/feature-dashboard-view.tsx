'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocateFixed, Image, Layers3, SlidersHorizontal, BotMessageSquare, ArrowRight } from "lucide-react";
import type { ActiveView } from '@/components/dashboard';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  view: ActiveView;
  onClick: (view: ActiveView) => void;
}

const features: Omit<FeatureCardProps, 'onClick'>[] = [
  {
    title: "Feature Detection",
    description: "Upload lunar images to automatically detect landslides and boulders using AI.",
    icon: LocateFixed,
    view: 'feature-detection'
  },
  {
    title: "Temporal Analysis",
    description: "Compare multi-temporal images to identify geological activity over time.",
    icon: Image,
    view: 'temporal-view'
  },
  {
    title: "3D Surface Modeling",
    description: "Convert 2D lunar data into interactive 3D surface models.",
    icon: Layers3,
    view: 'surface-model'
  },
  {
    title: "Shadow & Slope Analysis",
    description: "Differentiate natural terrain from displaced mass using DTM data.",
    icon: SlidersHorizontal,
    view: 'shadow-slope'
  },
  {
    title: "Geological Reasoning",
    description: "Enhance analysis with contextual geological data and AI-powered insights.",
    icon: BotMessageSquare,
    view: 'geological-reasoning'
  }
];

function FeatureCard({ title, description, icon: Icon, view, onClick }: FeatureCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button onClick={() => onClick(view)} className="w-full">
          Go to Tool <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function FeatureDashboardView({ setActiveView }: { setActiveView: (view: ActiveView) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Lunar Analysis Toolkit</h1>
        <p className="text-muted-foreground mt-2">
          Select a tool below to begin your analysis of the lunar surface.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.view}
            {...feature}
            onClick={setActiveView}
          />
        ))}
      </div>
    </div>
  );
}
