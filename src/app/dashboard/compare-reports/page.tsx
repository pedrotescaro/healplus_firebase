
"use client";

import { ReportComparator } from "@/components/dashboard/report-comparator";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function CompareReportsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 page-responsive">
      <div className="container-responsive">
        <h1 className="text-responsive-2xl sm:text-responsive-3xl lg:text-responsive-4xl font-bold tracking-tight">{t.compareReportsTitle}</h1>
        <p className="text-muted-foreground text-responsive-sm sm:text-responsive-base">{t.compareReportsDescription}</p>
      </div>
      <Card>
        <CardContent className="card-responsive">
          <ReportComparator />
        </CardContent>
      </Card>
    </div>
  );
}
