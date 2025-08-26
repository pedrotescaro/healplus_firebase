
"use client";

import { ReportComparator } from "@/components/dashboard/report-comparator";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function CompareReportsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.compareReportsTitle}</h1>
        <p className="text-muted-foreground">{t.compareReportsDescription}</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <ReportComparator />
        </CardContent>
      </Card>
    </div>
  );
}
