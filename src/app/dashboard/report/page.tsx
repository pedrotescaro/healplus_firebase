
"use client";

import { ReportGenerator } from "@/components/dashboard/report-generator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function ReportPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.reportTitle}</h1>
        <p className="text-muted-foreground">{t.reportDescription}</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <ReportGenerator />
        </CardContent>
      </Card>
    </div>
  );
}
