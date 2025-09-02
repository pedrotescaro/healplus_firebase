
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { Loader2, Sparkles, AlertCircle, TrendingUp, TrendingDown, Minus, PencilLine, GitCompareArrows, FileImage, ClipboardCheck, ImageOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "../ui/separator";

interface StoredReport {
  id: string;
  patientName: string;
  reportContent: string;
  woundImageUri: string;
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

    if (!report1 || !report2 || !report1.woundImageUri || !report2.woundImageUri) {
      toast({ title: "Dados Incompletos", description: "Ambos os relatórios selecionados devem conter uma imagem para comparação.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setComparisonResult(null);
    try {
      const result = await compareWoundReports({
        report1Content: report1.reportContent,
        report2Content: report2.reportContent,
        image1DataUri: report1.woundImageUri,
        image2DataUri: report2.woundImageUri,
        report1Date: report1.createdAt.toDate().toISOString(),
        report2Date: report2.createdAt.toDate().toISOString(),
      });
      setComparisonResult(result);
    } catch (error) {
      console.error("Erro ao comparar relatórios:", error);
      toast({ title: "Erro na Análise", description: "A IA não conseguiu processar a comparação. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
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
          Analisar Progressão
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
          <p className="mt-4 text-muted-foreground">A IA está analisando a evolução entre os relatórios e imagens...</p>
        </div>
      )}

      {comparisonResult && comparisonResult.relatorio_comparativo && (
         <Tabs defaultValue="comparativo" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="comparativo"><GitCompareArrows className="mr-2" />Comparativo</TabsTrigger>
                <TabsTrigger value="imagem1"><FileImage className="mr-2" />Análise Imagem 1</TabsTrigger>
                <TabsTrigger value="imagem2"><FileImage className="mr-2" />Análise Imagem 2</TabsTrigger>
            </TabsList>
            <TabsContent value="comparativo" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ClipboardCheck /> Relatório Comparativo de Progressão</CardTitle>
                        <CardDescription>Análise da evolução entre {comparisonResult.relatorio_comparativo.intervalo_tempo}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {comparisonResult.relatorio_comparativo.consistencia_dados?.alerta_qualidade && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Alerta de Qualidade</AlertTitle>
                                <AlertDescription>{comparisonResult.relatorio_comparativo.consistencia_dados.alerta_qualidade}</AlertDescription>
                            </Alert>
                        )}
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Resumo Descritivo da Evolução</h3>
                            <p className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">{comparisonResult.relatorio_comparativo.resumo_descritivo_evolucao}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Análise Quantitativa (Delta Δ)</h3>
                            <Table>
                                <TableBody>
                                    <TableRow><TableCell className="font-medium">Δ Área Total Afetada</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_area_total_afetada}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Δ Hiperpigmentação</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_coloracao?.mudanca_area_hiperpigmentacao}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Δ Eritema/Rubor</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_coloracao?.mudanca_area_eritema_rubor}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Δ Edema</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_edema}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Δ Textura</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_textura}</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="imagem1" className="mt-4">
                 <IndividualAnalysisCard analysis={comparisonResult.analise_imagem_1} />
            </TabsContent>
            <TabsContent value="imagem2" className="mt-4">
                <IndividualAnalysisCard analysis={comparisonResult.analise_imagem_2} />
            </TabsContent>
        </Tabs>
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
            <CardContent className="space-y-4">
                <div className="relative flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-2">
                    {report.woundImageUri ? (
                        <div className="relative h-full w-full">
                            <Image src={report.woundImageUri} alt={`Wound for ${report.patientName}`} layout="fill" className="object-contain" data-ai-hint="wound" />
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <ImageOff className="mx-auto h-10 w-10" />
                            <p className="mt-2 text-sm">Sem imagem</p>
                        </div>
                    )}
                </div>
                <ScrollArea className="h-48 p-4 border rounded-md">
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                        {report.reportContent}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

const QualityBadge = ({ label, value }: { label: string, value: string }) => {
    const variant = (value: string) => {
        switch (value) {
            case 'Adequada':
            case 'Nítido':
            case 'Sim':
            case 'Neutro':
                return 'default';
            default:
                return 'destructive';
        }
    };
    return <Badge variant={variant(value)}>{label}: {value}</Badge>;
  };

const IndividualAnalysisCard = ({ analysis }: { analysis: CompareWoundReportsOutput['analise_imagem_1'] }) => {
      const { avaliacao_qualidade, analise_dimensional, analise_colorimetrica, analise_textura_e_caracteristicas } = analysis;
      return (
          <div className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-base">Qualidade da Imagem</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                      <QualityBadge label="Iluminação" value={avaliacao_qualidade.iluminacao} />
                      <QualityBadge label="Foco" value={avaliacao_qualidade.foco} />
                      <QualityBadge label="Fundo" value={avaliacao_qualidade.fundo} />
                      <QualityBadge label="Escala" value={avaliacao_qualidade.escala_referencia_presente} />
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle className="text-base">Análise Dimensional e Textura</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableBody>
                              <TableRow><TableCell className="font-medium">Área Afetada</TableCell><TableCell>{analise_dimensional.area_total_afetada} {analise_dimensional.unidade_medida}</TableCell></TableRow>
                              <TableRow><TableCell className="font-medium">Edema</TableCell><TableCell>{analise_textura_e_caracteristicas.edema}</TableCell></TableRow>
                              <TableRow><TableCell className="font-medium">Descamação</TableCell><TableCell>{analise_textura_e_caracteristicas.descamacao}</TableCell></TableRow>
                              <TableRow><TableCell className="font-medium">Brilho</TableCell><TableCell>{analise_textura_e_caracteristicas.brilho_superficial}</TableCell></TableRow>
                              <TableRow><TableCell className="font-medium">Bordas</TableCell><TableCell>{analise_textura_e_caracteristicas.bordas_lesao}</TableCell></TableRow>
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle className="text-base">Análise Colorimétrica</CardTitle>
                  </CardHeader>
                  <CardContent>
                       <Table>
                          <TableHeader><TableRow><TableHead>Cor</TableHead><TableHead>Hex</TableHead><TableHead className="text-right">% Área</TableHead></TableRow></TableHeader>
                          <TableBody>
                              {analise_colorimetrica.cores_dominantes.map(c => (
                                  <TableRow key={c.hex_aproximado}>
                                      <TableCell className="font-medium flex items-center gap-2"><div className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex_aproximado }}></div> {c.cor}</TableCell>
                                      <TableCell>{c.hex_aproximado}</TableCell>
                                      <TableCell className="text-right">{c.area_percentual}%</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </div>
      )
  };
