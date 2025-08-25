import { AgendaView } from "@/components/dashboard/agenda-view";

export default function AgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agenda de Retornos</h1>
        <p className="text-muted-foreground">Visualize os próximos agendamentos de reavaliação de feridas.</p>
      </div>
      <AgendaView />
    </div>
  );
}
