
"use client";

import { AgendaView } from "@/components/dashboard/agenda-view";
import { useTranslation } from "@/contexts/app-provider";

export default function AgendaPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.agendaTitle}</h1>
        <p className="text-muted-foreground">{t.agendaDescription}</p>
      </div>
      <AgendaView />
    </div>
  );
}
