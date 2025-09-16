
"use client";

import { ImageComparator } from "@/components/dashboard/image-comparator";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function CompareReportsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{t.comparativeReportTitle}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Análise comparativa de progressão de feridas com IA.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <ImageComparator />
        </CardContent>
      </Card>
    </div>
  );
}
