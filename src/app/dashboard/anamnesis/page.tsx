import { AnamnesisForm } from "@/components/dashboard/anamnesis-form";
import { Card, CardContent } from "@/components/ui/card";

export default function AnamnesisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ficha de Anamnese</h1>
        <p className="text-muted-foreground">Preencha os dados do paciente e da ferida para uma avaliação completa.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <AnamnesisForm />
        </CardContent>
      </Card>
    </div>
  );
}
