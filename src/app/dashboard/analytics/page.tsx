"use client";

import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { useTranslation } from "@/contexts/app-provider";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6 page-responsive">
      <div className="container-responsive">
        <h1 className="text-responsive-2xl sm:text-responsive-3xl lg:text-responsive-4xl font-bold tracking-tight">
          Analytics Avançados
        </h1>
        <p className="text-muted-foreground text-responsive-sm sm:text-responsive-base">
          Insights detalhados sobre seu trabalho e progressão dos pacientes.
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
