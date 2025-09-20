
"use client";

import { AnamnesisForm } from "@/components/dashboard/anamnesis-form";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function AnamnesisPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 max-w-full page-responsive">
      <div>
        <h1 className="text-responsive-3xl font-bold tracking-tight">{t.anamnesisTitle}</h1>
        <p className="text-muted-foreground text-responsive-base">{t.anamnesisDescription}</p>
      </div>
      <Card className="w-full">
        <CardContent className="card-responsive w-full">
          <AnamnesisForm />
        </CardContent>
      </Card>
    </div>
  );
}
