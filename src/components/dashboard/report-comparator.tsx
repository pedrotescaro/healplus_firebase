
"use client";

import { useState, useEffect } from "react";
import { compareWoundReports, CompareWoundReportsOutput } from "@/ai/flows/compare-wound-reports";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, AlertCircle, TrendingUp, TrendingDown, Minus, PencilLine } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";

interface StoredReport {
  id: string;
  patientName: string;
  reportContent: string;
  createdAt: Timestamp;
}

const isAIEnabled = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export function ReportComparator() {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [selectedReport1Id, setSelectedReport1Id] = useState<string>("");
  const [selectedReport2Id, setSelectedReport2Id] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<CompareWoundReportsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "users", user.uid, "reports"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedReports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredReport));
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports from Firestore: ", error);
        toast({ title: "Erro", description: "Não foi possível carregar os relatórios salvos.", variant: "destructive" });
      }
    };
    if (user) {
      fetchReports();
    }
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport1Id || !selectedReport2Id) {
      toast({ title: "Seleção Incompleta", description: "Por favor, selecione dois relatórios para comparar.", variant: "destructive" });
      return;
    }
    if (selectedReport1Id === selectedReport2Id) {
      toast({ title: "Seleção Inválida", description: "Por favor, selecione dois relatórios diferentes.", variant: "destructive" });
      return;
    }

    const report1 = reports.find(r => r.id === selectedReport1Id);
    const report2 = reports.find(r => r.id === selectedReport2Id);

    if (!report1 || !report2) {
      toast({ title: "Erro", description: "Não foi possível encontrar os relatórios selecionados.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setComparisonResult(null);
    try {
      const result = await compareWoundReports({
        report1Content: report1.reportContent,
        report2Content: report2.reportContent,
        report1Date: report1.createdAt.toDate().toLocaleDateString('pt-BR'),
        report2Date: report2.createdAt.toDate().toLocaleDateString('pt-BR'),
      });
      setComparisonResult(result);
    } catch (error) {
      console.error("Erro ao comparar relatórios:", error);
      toast({ title: "Erro na Análise", description: "A IA não conseguiu processar a comparação. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const getEvolutionIcon = (evolution: string) => {
    switch (evolution) {
      case "Melhora": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "Piora": return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "Estável": return <Minus className="h-4 w-4 text-yellow-500" />;
      case "Alteração": return <PencilLine className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const selectedReport1 = reports.find(r => r.id === selectedReport1Id);
  const selectedReport2 = reports.find(r => r.id === selectedReport2Id);

  if (!isAIEnabled) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Funcionalidade de IA Desativada</AlertTitle>
        <AlertDescription>A chave de API do Gemini não foi configurada. Por favor, adicione-a para habilitar esta função.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Relatório 1 (Mais antigo)</Label>
            <Select onValueChange={setSelectedReport1Id} value={selectedReport1Id}>
              <SelectTrigger><SelectValue placeholder="Selecione um relatório..." /></SelectTrigger>
              <SelectContent>
                {reports.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.patientName} - {r.createdAt.toDate().toLocaleDateString('pt-BR')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Relatório 2 (Mais recente)</Label>
            <Select onValueChange={setSelectedReport2Id} value={selectedReport2Id}>
              <SelectTrigger><SelectValue placeholder="Selecione um relatório..." /></SelectTrigger>
              <SelectContent>
                {reports.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.patientName} - {r.createdAt.toDate().toLocaleDateString('pt-BR')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" disabled={loading || !selectedReport1Id || !selectedReport2Id} className="w-full md:w-auto">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Comparar Relatórios
        </Button>
      </form>

       {(selectedReport1 || selectedReport2) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportDisplay report={selectedReport1} title="Relatório 1" />
            <ReportDisplay report={selectedReport2} title="Relatório 2" />
        </div>
       )}

      {loading && (
        <div className="flex items-center justify-center flex-col text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">A IA está analisando a evolução entre os relatórios...</p>
        </div>
      )}

      {comparisonResult && (
        <Card>
          <CardHeader>
            <CardTitle>Análise Comparativa da IA</CardTitle>
            <CardDescription>Resumo da evolução do caso entre os dois relatórios selecionados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold text-lg mb-2">Resumo da Evolução</h3>
                <p className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">{comparisonResult.evolutionSummary}</p>
            </div>
             <div>
                <h3 className="font-semibold text-lg mb-2">Principais Mudanças</h3>
                <div className="space-y-3">
                    {comparisonResult.keyChanges.map((change, index) => (
                        <div key={index} className="p-3 border rounded-md bg-muted/50">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-sm">{change.area}</h4>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    {getEvolutionIcon(change.evolution)}
                                    {change.evolution}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{change.changeDescription}</p>
                        </div>
                    ))}
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const ReportDisplay = ({ report, title }: { report: StoredReport | undefined, title: string }) => {
    if (!report) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">Selecione um relatório para visualizar.</p>
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{report.patientName} - {report.createdAt.toDate().toLocaleDateString('pt-BR')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64 p-4 border rounded-md">
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                        {report.reportContent}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
