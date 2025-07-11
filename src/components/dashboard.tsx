'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { RiskDashboardView } from '@/components/risk-dashboard-view';
import { FeatureDetectionView } from '@/components/feature-detection-view';
import { TemporalView } from '@/components/temporal-view';
import { SurfaceModelView } from '@/components/surface-model-view';
import { ShadowSlopeView } from '@/components/shadow-slope-view';
import { GeologicalReasoningView } from '@/components/geological-reasoning-view';
import { FeatureDashboardView } from '@/components/feature-dashboard-view';
import {
  BotMessageSquare,
  BoxSelect,
  ChevronLeft,
  Image,
  Layers3,
  LayoutDashboard,
  LocateFixed,
  SlidersHorizontal,
  Grid3x3,
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type ActiveView =
  | 'dashboard'
  | 'feature-dashboard'
  | 'feature-detection'
  | 'temporal-view'
  | 'surface-model'
  | 'shadow-slope'
  | 'geological-reasoning';

const navItems = [
  { id: 'dashboard', label: 'Risk Dashboard', icon: LayoutDashboard },
  { id: 'feature-dashboard', label: 'Feature Dashboard', icon: Grid3x3 },
  { id: 'feature-detection', label: 'Feature Detection', icon: LocateFixed },
  { id: 'temporal-view', label: 'Temporal Analysis', icon: Image },
  { id: 'surface-model', label: '3D Surface Model', icon: Layers3 },
  { id: 'shadow-slope', label: 'Shadow & Slope', icon: SlidersHorizontal },
  { id: 'geological-reasoning', label: 'Geological Reasoning', icon: BotMessageSquare },
];

function SidebarNavigation({ activeView, setActiveView }: { activeView: ActiveView, setActiveView: (view: ActiveView) => void }) {
  const { open, setOpen } = useSidebar();
  return (
    <div className="flex flex-col h-full">
      <SidebarHeader className="p-4 flex items-center gap-3">
        <Logo className="w-8 h-8 text-primary" />
        <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Lunar Hazard
            </h2>
            <p className="text-sm text-muted-foreground -mt-1">Mapper</p>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => setActiveView(item.id as ActiveView)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </SidebarContent>
      <div className="mt-auto border-t p-2">
         <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Collapse
          </Button>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <RiskDashboardView />;
      case 'feature-dashboard':
        return <FeatureDashboardView setActiveView={setActiveView} />;
      case 'feature-detection':
        return <FeatureDetectionView />;
      case 'temporal-view':
        return <TemporalView />;
      case 'surface-model':
        return <SurfaceModelView />;
      case 'shadow-slope':
        return <ShadowSlopeView />;
      case 'geological-reasoning':
        return <GeologicalReasoningView />;
      default:
        return <RiskDashboardView />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Sidebar>
          <SidebarNavigation activeView={activeView} setActiveView={setActiveView} />
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold capitalize">{(navItems.find(item => item.id === activeView)?.label) || 'Dashboard'}</h1>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">{renderView()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
