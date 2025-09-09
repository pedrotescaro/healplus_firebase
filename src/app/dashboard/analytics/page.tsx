"use client";

import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { useTranslation } from "@/contexts/app-provider";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Analytics Avançados
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Insights detalhados sobre seu trabalho e progressão dos pacientes.
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
