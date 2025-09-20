
"use client";

import { AgendaView } from "@/components/dashboard/agenda-view";
import { useTranslation } from "@/contexts/app-provider";

export default function AgendaPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 page-responsive">
      {/* Header com gradiente e estatísticas */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 card-responsive">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-3xl sm:text-responsive-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t.agendaTitle}
              </h1>
              <p className="text-muted-foreground mt-2 text-responsive-sm sm:text-responsive-base">
                {t.agendaDescription}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-responsive-2xl font-bold text-primary">Hoje</div>
                <div className="text-responsive-xs text-muted-foreground">Agenda</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AgendaView />
    </div>
  );
}
