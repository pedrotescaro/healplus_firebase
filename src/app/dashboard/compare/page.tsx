
"use client";

import { ImageComparator } from "@/components/dashboard/image-comparator";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function ComparePage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.compareTitle}</h1>
        <p className="text-muted-foreground">{t.compareDescription}</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <ImageComparator />
        </CardContent>
      </Card>
    </div>
  );
}
