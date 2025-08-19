import { ReportGenerator } from "@/components/dashboard/report-generator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerar Relatório da Ferida</h1>
        <p className="text-muted-foreground">Forneça os dados da anamnese e uma imagem para análise da IA.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <ReportGenerator />
        </CardContent>
      </Card>
    </div>
  );
}
