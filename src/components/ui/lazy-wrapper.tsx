"use client";

import { memo, Suspense, lazy, ComponentType, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}

const DefaultFallback = memo(function DefaultFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
});

export const LazyWrapper = memo(function LazyWrapper({ 
  children, 
  fallback = <DefaultFallback />,
  delay = 0 
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
});

// Função helper para criar componentes lazy
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return memo(function LazyComponentWrapper(props: any) {
    return (
      <LazyWrapper fallback={fallback}>
        <LazyComponent {...props} />
      </LazyWrapper>
    );
  });
}

// Componentes lazy específicos do projeto
export const LazyReportGenerator = createLazyComponent(
  () => import('@/components/dashboard/report-generator').then(m => ({ default: m.ReportGenerator })),
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Carregando gerador de relatórios...</p>
    </div>
  </div>
);

export const LazyAnamnesisForm = createLazyComponent(
  () => import('@/components/dashboard/anamnesis-form').then(m => ({ default: m.AnamnesisForm })),
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Carregando formulário de anamnese...</p>
    </div>
  </div>
);

export const LazyWoundCapture = createLazyComponent(
  () => import('@/components/dashboard/wound-capture').then(m => ({ default: m.WoundCapture })),
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Carregando captura de feridas...</p>
    </div>
  </div>
);
