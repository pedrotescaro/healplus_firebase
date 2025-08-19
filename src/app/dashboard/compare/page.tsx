import { ImageComparator } from "@/components/dashboard/image-comparator";
import { Card, CardContent } from "@/components/ui/card";

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comparar Imagens de Feridas</h1>
        <p className="text-muted-foreground">Envie duas imagens para analisar o progresso da cicatrização com IA.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <ImageComparator />
        </CardContent>
      </Card>
    </div>
  );
}
