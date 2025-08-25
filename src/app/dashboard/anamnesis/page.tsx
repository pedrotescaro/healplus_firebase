
"use client";

import { AnamnesisForm } from "@/components/dashboard/anamnesis-form";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function AnamnesisPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.anamnesisTitle}</h1>
        <p className="text-muted-foreground">{t.anamnesisDescription}</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <AnamnesisForm />
        </CardContent>
      </Card>
    </div>
  );
}
