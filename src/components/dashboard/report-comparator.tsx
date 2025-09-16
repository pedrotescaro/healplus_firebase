
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
import { Loader2, Sparkles, AlertCircle, TrendingUp, TrendingDown, Minus, PencilLine, GitCompareArrows, FileImage, ClipboardCheck, ImageOff, FileDown, BarChart3, Clock, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, Timestamp, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useTranslation } from "@/contexts/app-provider";
import { Progress } from "@/components/ui/progress";
import type { AnamnesisFormValues } from "@/lib/anamnesis-schema";


interface StoredReport {
  id: string;
  patientName: string;
  reportContent: string;
  woundImageUri: string;
  createdAt: Timestamp;
  anamnesisId: string;
  professionalId: string;
}

const isAIEnabled = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

type ProgressMetrics = {
    areaChange: number;
    healingScore: number;
    tissueImprovement: number;
    overallProgress: 'melhora' | 'piora' | 'estavel';
}

export function ReportComparator() {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [selectedReport1Id, setSelectedReport1Id] = useState<string>("");
  const [selectedReport2Id, setSelectedReport2Id] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<CompareWoundReportsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [comparisonHistory, setComparisonHistory] = useState<any[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

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
        toast({ title: t.fetchReportsErrorTitle, description: t.fetchReportsErrorDescription, variant: "destructive" });
      }
    };
    if (user) {
      fetchReports();
    }
  }, [user, toast, t]);
  
  const calculateProgressMetrics = (comparison: CompareWoundReportsOutput): ProgressMetrics => {
    const delta = comparison.relatorio_comparativo.analise_quantitativa_progressao;
    
    const areaChangeText = delta.delta_area_total_afetada;
    const areaChange = parseFloat(areaChangeText.replace(/[^\d.-]/g, '')) || 0;
    
    let healingScore = 50;
    
    if (areaChange < 0) healingScore += Math.abs(areaChange) * 2;
    else healingScore -= areaChange * 2;
    
    const edemaText = delta.delta_edema;
    if (edemaText.includes('redução') || edemaText.includes('diminuição')) healingScore += 15;
    else if (edemaText.includes('aumento')) healingScore -= 15;
    
    const texturaText = delta.delta_textura;
    if (texturaText.includes('melhora') || texturaText.includes('melhor')) healingScore += 10;
    else if (texturaText.includes('piora')) healingScore -= 10;
    
    healingScore = Math.max(0, Math.min(100, healingScore));
    
    let overallProgress: 'melhora' | 'piora' | 'estavel' = 'estavel';
    if (healingScore > 60) overallProgress = 'melhora';
    else if (healingScore < 40) overallProgress = 'piora';
    
    return {
      areaChange,
      healingScore,
      tissueImprovement: healingScore,
      overallProgress
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport1Id || !selectedReport2Id) {
      toast({ title: t.selectionIncompleteTitle, description: t.selectionIncompleteDescription, variant: "destructive" });
      return;
    }
    if (selectedReport1Id === selectedReport2Id) {
      toast({ title: t.selectionInvalidTitle, description: t.selectionInvalidDescription, variant: "destructive" });
      return;
    }

    const report1 = reports.find(r => r.id === selectedReport1Id);
    const report2 = reports.find(r => r.id === selectedReport2Id);

    if (!report1 || !report2 || !report1.woundImageUri || !report2.woundImageUri) {
      toast({ title: t.incompleteDataTitle, description: t.incompleteDataDescription, variant: "destructive" });
      return;
    }

    setLoading(true);
    setComparisonResult(null);
    setProgressMetrics(null);
    try {
      if (isAIEnabled) {
        const result = await compareWoundReports({
          report1Content: report1.reportContent,
          report2Content: report2.reportContent,
          image1DataUri: report1.woundImageUri,
          image2DataUri: report2.woundImageUri,
          report1Date: report1.createdAt.toDate().toISOString(),
          report2Date: report2.createdAt.toDate().toISOString(),
        });
        setComparisonResult(result);
        const metrics = calculateProgressMetrics(result);
        setProgressMetrics(metrics);

        if (user) {
          await addDoc(collection(db, "users", user.uid, "comparisons"), {
            ...result,
            report1Id: selectedReport1Id,
            report2Id: selectedReport2Id,
            patientName: report1.patientName,
            createdAt: serverTimestamp(),
            progressMetrics: metrics,
          });
          toast({ title: t.comparisonSavedTitle, description: t.comparisonSavedDescription });
        }
      } 
    } catch (error) {
      console.error("Erro ao comparar relatórios:", error);
      toast({ title: t.analysisErrorTitle, description: t.analysisErrorDescription, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSavePdf = async () => {
    const report1 = reports.find(r => r.id === selectedReport1Id);
    const report2 = reports.find(r => r.id === selectedReport2Id);
    if (!comparisonResult || !report1 || !report2 || !user) return;
    setPdfLoading(true);

    try {
        const anamnesisSnap1 = await getDoc(doc(db, "users", report1.professionalId, "anamnesis", report1.anamnesisId));
        if (!anamnesisSnap1.exists()) {
            toast({ title: "Erro", description: "Ficha de anamnese não encontrada para o relatório 1.", variant: "destructive" });
            setPdfLoading(false);
            return;
        }
        const anamnesis1 = anamnesisSnap1.data() as AnamnesisFormValues;

        const doc_ = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const pageWidth = doc_.internal.pageSize.getWidth();
        let finalY = margin;

        const addHeaderAndFooter = () => {
            const pageCount = (doc_ as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc_.setPage(i);
                doc_.setFontSize(8);
                doc_.setTextColor(150);
                const footerText = `Gerado por Heal+ em ${new Date().toLocaleDateString('pt-BR')} | Página ${i} de ${pageCount}`;
                doc_.text(footerText, pageWidth / 2, doc_.internal.pageSize.getHeight() - 10, { align: 'center' });
            }
        };
        
        const TISSUE_COLORS: { [key: string]: string } = {
            vermelhos: '#e53e3e',
            amarelos: '#f6e05e',
            pretos: '#2d3748',
            'brancos/ciano': '#fbb6ce',
        };

        const drawHistogramChart = (analysis: typeof comparisonResult.analise_imagem_1, startY: number) => {
            const chartX = margin;
            const chartY = startY + 5;
            const chartWidth = pageWidth - margin * 2;
            const chartHeight = 40;
            const barWidth = chartWidth / analysis.analise_histograma.distribuicao_cores.length;

            doc_.setDrawColor(150);
            doc_.rect(chartX, chartY, chartWidth, chartHeight); // Chart border

            analysis.analise_histograma.distribuicao_cores.forEach((bar, index) => {
                const barHeight = (bar.contagem_pixels_percentual / 100) * chartHeight;
                const barX = chartX + index * barWidth;
                const barColor = TISSUE_COLORS[bar.faixa_cor.toLowerCase()] || '#cccccc';
                
                doc_.setFillColor(barColor);
                doc_.rect(barX, chartY + chartHeight - barHeight, barWidth, barHeight, 'F');
                doc_.setFontSize(8);
                doc_.text(`${bar.contagem_pixels_percentual.toFixed(1)}%`, barX + barWidth / 2, chartY + chartHeight - barHeight - 2, { align: 'center' });
                doc_.text(bar.faixa_cor, barX + barWidth / 2, chartY + chartHeight + 4, { align: 'center' });
            });
            return chartY + chartHeight + 10;
        };

        const addAnalysisTables = (analysis: typeof comparisonResult.analise_imagem_1, startY: number) => {
            let currentY = startY;
            autoTable(doc_, {
                startY: currentY,
                head: [['Qualidade da Imagem', 'Avaliação']],
                body: Object.entries(analysis.avaliacao_qualidade).map(([key, value]) => [key.replace(/_/g, ' '), value]),
                theme: 'striped',
            });
            currentY = (doc_ as any).lastAutoTable.finalY + 5;

            autoTable(doc_, {
                startY: currentY,
                head: [['Análise Dimensional e Textura', 'Valor']],
                body: Object.entries(analysis.analise_textura_e_caracteristicas).map(([key, value]) => [key.replace(/_/g, ' '), value]),
                theme: 'striped',
            });
            currentY = (doc_ as any).lastAutoTable.finalY + 5;

            autoTable(doc_, {
                startY: currentY,
                head: [['Análise Colorimétrica', 'Cor', 'Hex', '% Área']],
                body: analysis.analise_colorimetrica.cores_dominantes.map(c => [
                    '', 
                    c.cor,
                    c.hex_aproximado,
                    `${c.area_percentual}%`
                ]),
                theme: 'striped',
                didDrawCell: (data) => {
                    if (data.section === 'body' && data.column.index === 0) {
                        const color = analysis.analise_colorimetrica.cores_dominantes[data.row.index].hex_aproximado;
                        doc_.setFillColor(color);
                        doc_.rect(data.cell.x + 2, data.cell.y + 2, 4, 4, 'F');
                    }
                }
            });
            currentY = (doc_ as any).lastAutoTable.finalY + 5;

            doc_.setFont('helvetica', 'bold');
            doc_.setFontSize(10);
            doc_.text("Histograma de Cores", margin, currentY);
            currentY = drawHistogramChart(analysis, currentY);
            
            return currentY;
        };

        // --- Página 1: Resumo ---
        doc_.setFont('helvetica', 'bold');
        doc_.setFontSize(16);
        doc_.text("Relatório Comparativo de Progressão de Ferida", pageWidth / 2, finalY, { align: 'center' });
        finalY += 10;
        doc_.setFontSize(10);
        doc_.text(`Paciente: ${anamnesis1.nome_cliente}`, margin, finalY);
        finalY += 6;
        doc_.text(`Período: ${report1.createdAt.toDate().toLocaleDateString('pt-BR')} a ${report2.createdAt.toDate().toLocaleDateString('pt-BR')}`, margin, finalY);
        finalY += 10;
        
        // Imagens lado a lado
        const imgWidth = (pageWidth - margin * 3) / 2;
        const img1Props = doc_.getImageProperties(report1.woundImageUri);
        const imgHeight = (img1Props.height * imgWidth) / img1Props.width;
        doc_.addImage(report1.woundImageUri, 'PNG', margin, finalY, imgWidth, imgHeight);
        doc_.addImage(report2.woundImageUri, 'PNG', margin * 2 + imgWidth, finalY, imgWidth, imgHeight);
        finalY += imgHeight + 5;

        // Resumo
        autoTable(doc_, {
            startY: finalY,
            head: [['Resumo da Evolução']],
            body: [[comparisonResult.relatorio_comparativo.resumo_descritivo_evolucao]],
            theme: 'grid',
        });
        finalY = (doc_ as any).lastAutoTable.finalY + 5;

        // --- Página 2: Análise Imagem 1 ---
        doc_.addPage();
        finalY = margin;
        doc_.setFont('helvetica', 'bold');
        doc_.setFontSize(14);
        doc_.text(`Análise Detalhada - Imagem 1 (${report1.createdAt.toDate().toLocaleDateString('pt-BR')})`, margin, finalY);
        finalY += 10;
        addAnalysisTables(comparisonResult.analise_imagem_1, finalY);

        // --- Página 3: Análise Imagem 2 ---
        doc_.addPage();
        finalY = margin;
        doc_.setFont('helvetica', 'bold');
        doc_.setFontSize(14);
        doc_.text(`Análise Detalhada - Imagem 2 (${report2.createdAt.toDate().toLocaleDateString('pt-BR')})`, margin, finalY);
        finalY += 10;
        addAnalysisTables(comparisonResult.analise_imagem_2, finalY);
        
        addHeaderAndFooter();

        const fileName = `Comparativo_${report1.patientName.replace(/\s/g, '_')}.pdf`;
        doc_.save(fileName);

    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        toast({ title: t.pdfErrorTitle, description: t.pdfErrorDescription, variant: "destructive" });
    } finally {
        setPdfLoading(false);
    }
  };


  const selectedReport1 = reports.find(r => r.id === selectedReport1Id);
  const selectedReport2 = reports.find(r => r.id === selectedReport2Id);

  if (!isAIEnabled) {
    return (
       <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Funcionalidade de IA Desativada</AlertTitle>
        <AlertDescription>
          A chave de API do Gemini não foi configurada. Por favor, adicione a `GEMINI_API_KEY` ao seu ambiente para habilitar a comparação de relatórios.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>{t.report1LabelOldest}</Label>
            <Select onValueChange={setSelectedReport1Id} value={selectedReport1Id}>
              <SelectTrigger><SelectValue placeholder={t.selectReportPlaceholder} /></SelectTrigger>
              <SelectContent>
                {reports.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.patientName} - {r.createdAt.toDate().toLocaleDateString(t.locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t.report2LabelNewest}</Label>
            <Select onValueChange={setSelectedReport2Id} value={selectedReport2Id}>
              <SelectTrigger><SelectValue placeholder={t.selectReportPlaceholder} /></SelectTrigger>
              <SelectContent>
                {reports.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.patientName} - {r.createdAt.toDate().toLocaleDateString(t.locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1 md:flex-none">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analisar Progressão
          </Button>
          {comparisonResult && (
            <Button onClick={handleSavePdf} disabled={pdfLoading} variant="outline">
              {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Exportar PDF Detalhado
            </Button>
          )}
        </div>
      </form>

      {(selectedReport1 || selectedReport2) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportDisplay report={selectedReport1} title={t.report1LabelOldest.replace(/\s*\(.+\)$/, '')} />
            <ReportDisplay report={selectedReport2} title={t.report2LabelNewest.replace(/\s*\(.+\)$/, '')} />
        </div>
       )}

      {loading && (
        <div className="flex items-center justify-center flex-col text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">{t.analyzingProgressionMessage}</p>
        </div>
      )}

      {comparisonResult && (
        <Tabs defaultValue="comparativo" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="comparativo"><GitCompareArrows className="mr-2" />Comparativo</TabsTrigger>
                <TabsTrigger value="metricas"><BarChart3 className="mr-2" />Métricas</TabsTrigger>
                <TabsTrigger value="imagem1"><FileImage className="mr-2" />{t.tabImage1}</TabsTrigger>
                <TabsTrigger value="imagem2"><FileImage className="mr-2" />{t.tabImage2}</TabsTrigger>
            </TabsList>
            <TabsContent value="comparativo" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ClipboardCheck /> {t.comparativeReportTitle}</CardTitle>
                        <CardDescription>{t.comparativeAnalysisBetween.replace('{interval}', String(comparisonResult.relatorio_comparativo.intervalo_tempo))}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {comparisonResult.relatorio_comparativo.consistencia_dados.alerta_qualidade && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>{t.qualityAlertTitle}</AlertTitle>
                                <AlertDescription>{comparisonResult.relatorio_comparativo.consistencia_dados.alerta_qualidade}</AlertDescription>
                            </Alert>
                        )}
                        <div>
                            <h3 className="font-semibold text-lg mb-2">{t.descriptiveSummaryTitle}</h3>
                            <p className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">{comparisonResult.relatorio_comparativo.resumo_descritivo_evolucao}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-semibold text-lg mb-2">{t.quantitativeAnalysisTitle}</h3>
                            <Table>
                                <TableBody>
                                    <TableRow><TableCell className="font-medium">{t.deltaTotalAffectedArea}</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_area_total_afetada}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">{t.deltaHyperpigmentation}</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_coloracao?.mudanca_area_hiperpigmentacao}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">{t.deltaErythema}</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_coloracao?.mudanca_area_eritema_rubor}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">{t.deltaEdema}</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_edema}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">{t.deltaTexture}</TableCell><TableCell>{comparisonResult.relatorio_comparativo.analise_quantitativa_progressao?.delta_textura}</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="metricas" className="mt-4">
                {progressMetrics && <ProgressIndicator metrics={progressMetrics} />}
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
    const { t } = useTranslation();
    if (!report) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">{t.selectAReportToView}</p>
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{report.patientName} - {report.createdAt.toDate().toLocaleDateString(t.locale)}</CardDescription>
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
                            <p className="mt-2 text-sm">{t.noImage}</p>
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
  
const ProgressIndicator = ({ metrics }: { metrics: ProgressMetrics }) => {
    const getProgressIcon = () => {
      switch (metrics.overallProgress) {
        case 'melhora': return <TrendingUp className="h-4 w-4 text-green-600" />;
        case 'piora': return <TrendingDown className="h-4 w-4 text-red-600" />;
        default: return <Minus className="h-4 w-4 text-yellow-600" />;
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métricas de Progresso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Score de Cicatrização</span>
            <div className="flex items-center gap-2">
              {getProgressIcon()}
              <span className="text-sm font-bold">{metrics.healingScore.toFixed(0)}/100</span>
            </div>
          </div>
          <Progress value={metrics.healingScore} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.areaChange.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Mudança de Área</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.tissueImprovement.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Melhora Tecidual</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-muted">
            {getProgressIcon()}
            <span className="font-medium capitalize">{metrics.overallProgress}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

const IndividualAnalysisCard = ({ analysis }: { analysis?: CompareWoundReportsOutput['analise_imagem_1'] }) => {
      const { t } = useTranslation();
      if (!analysis) {
        return null;
      }
      const { avaliacao_qualidade, analise_dimensional, analise_colorimetrica, analise_textura_e_caracteristicas } = analysis;
      return (
          <div className="space-y-4">
              {avaliacao_qualidade && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t.imageQualityTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <QualityBadge label={t.lighting} value={avaliacao_qualidade.iluminacao} />
                        <QualityBadge label={t.focus} value={avaliacao_qualidade.foco} />
                        <QualityBadge label={t.background} value={avaliacao_qualidade.fundo} />
                        <QualityBadge label={t.scale} value={avaliacao_qualidade.escala_referencia_presente} />
                    </CardContent>
                </Card>
              )}
              {analise_dimensional && analise_textura_e_caracteristicas && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t.dimensionalTextureAnalysisTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow><TableCell className="font-medium">{t.affectedArea}</TableCell><TableCell>{analise_dimensional.area_total_afetada} {analise_dimensional.unidade_medida}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">{t.edema}</TableCell><TableCell>{analise_textura_e_caracteristicas.edema}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">{t.scaling}</TableCell><TableCell>{analise_textura_e_caracteristicas.descamacao}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">{t.shine}</TableCell><TableCell>{analise_textura_e_caracteristicas.brilho_superficial}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">{t.edges}</TableCell><TableCell>{analise_textura_e_caracteristicas.bordas_lesao}</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
              )}
              {analise_colorimetrica && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t.colorimetricAnalysisTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>{t.color}</TableHead><TableHead>{t.hex}</TableHead><TableHead className="text-right">{t.areaPercentage}</TableHead></TableRow></TableHeader>
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
              )}
          </div>
      )
  };

    

    
