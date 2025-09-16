
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
import { Loader2, Sparkles, AlertCircle, TrendingUp, TrendingDown, Minus, PencilLine, GitCompareArrows, FileImage, ClipboardCheck, ImageOff, FileDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, Timestamp, addDoc, serverTimestamp } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useTranslation } from "@/contexts/app-provider";

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
  const [pdfLoading, setPdfLoading] = useState(false);
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
        if (user) {
          await addDoc(collection(db, "users", user.uid, "comparisons"), {
            ...result,
            report1Id: selectedReport1Id,
            report2Id: selectedReport2Id,
            patientName: report1.patientName,
            createdAt: serverTimestamp(),
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
    const selectedReport1 = reports.find(r => r.id === selectedReport1Id);
    const selectedReport2 = reports.find(r => r.id === selectedReport2Id);
    if (!comparisonResult || !selectedReport1?.woundImageUri || !selectedReport2?.woundImageUri) {
        toast({ title: "Erro", description: "Não há dados de comparação para gerar o PDF.", variant: "destructive" });
        return;
    };

    setPdfLoading(true);

    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        let finalY = 0;

        const addPageIfNeeded = (requiredSpace: number) => {
            if (finalY + requiredSpace > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                finalY = margin;
            }
        };

        // --- Título e Cabeçalho ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text("Relatório Comparativo de Progressão de Ferida", pageWidth / 2, margin, { align: 'center' });
        finalY = margin + 10;

        // --- Imagens Comparativas ---
        doc.setFontSize(12);
        doc.text("Imagens Comparadas", margin, finalY);
        finalY += 8;

        const imgWidth = (pageWidth - margin * 3) / 2;
        const img1Props = doc.getImageProperties(selectedReport1.woundImageUri);
        const img2Props = doc.getImageProperties(selectedReport2.woundImageUri);
        const img1Height = (img1Props.height * imgWidth) / img1Props.width;
        const img2Height = (img2Props.height * imgWidth) / img2Props.width;
        const maxHeight = Math.max(img1Height, img2Height);

        doc.addImage(selectedReport1.woundImageUri, 'PNG', margin, finalY, imgWidth, img1Height);
        doc.addImage(selectedReport2.woundImageUri, 'PNG', margin + imgWidth + margin, finalY, imgWidth, img2Height);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Imagem 1 (${selectedReport1.createdAt.toDate().toLocaleDateString()})`, margin, finalY + maxHeight + 4);
        doc.text(`Imagem 2 (${selectedReport2.createdAt.toDate().toLocaleDateString()})`, margin + imgWidth + margin, finalY + maxHeight + 4);
        finalY += maxHeight + 10;

        // --- Resumo Descritivo ---
        addPageIfNeeded(40);
        autoTable(doc, {
            startY: finalY,
            head: [['Resumo Descritivo da Evolução']],
            body: [[comparisonResult.relatorio_comparativo.resumo_descritivo_evolucao]],
            theme: 'grid',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
        });
        finalY = (doc as any).lastAutoTable.finalY + 10;

        // --- Análise Detalhada ---
        const createDetailedTables = (analysis: typeof comparisonResult.analise_imagem_1, title: string) => {
            addPageIfNeeded(100);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, finalY);
            finalY += 8;

            // Tabela de Qualidade
            const qualityBody = Object.entries(analysis.avaliacao_qualidade).map(([key, value]) => [key.replace(/_/g, ' '), value]);
            autoTable(doc, { startY: finalY, head: [['Qualidade da Imagem', 'Avaliação']], body: qualityBody, theme: 'striped' });
            finalY = (doc as any).lastAutoTable.finalY + 8;

            // Tabela Dimensional e Textura
            const dimBody = [
                ['Área Afetada', `${analysis.analise_dimensional.area_total_afetada} ${analysis.analise_dimensional.unidade_medida}`],
                ...Object.entries(analysis.analise_textura_e_caracteristicas).map(([key, value]) => [key.replace(/_/g, ' '), value])
            ];
            autoTable(doc, { startY: finalY, head: [['Análise Dimensional e Textura', 'Valor']], body: dimBody, theme: 'striped' });
            finalY = (doc as any).lastAutoTable.finalY + 8;

            // Tabela Colorimétrica
            const colorBody = analysis.analise_colorimetrica.cores_dominantes.map(c => [c.cor, c.hex_aproximado, `${c.area_percentual}%`]);
            autoTable(doc, { startY: finalY, head: [['Análise Colorimétrica - Cor', 'Hex', '% Área']], body: colorBody, theme: 'striped' });
            finalY = (doc as any).lastAutoTable.finalY + 15;
        };

        createDetailedTables(comparisonResult.analise_imagem_1, "Análise Detalhada - Imagem 1");
        createDetailedTables(comparisonResult.analise_imagem_2, "Análise Detalhada - Imagem 2");

        const fileName = `Comparativo_${selectedReport1.patientName.replace(/\s/g, '_')}.pdf`;
        doc.save(fileName);
        
        toast({ title: "PDF Gerado", description: "O relatório detalhado foi baixado." });
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        toast({ title: "Erro ao Gerar PDF", description: "Não foi possível criar o arquivo.", variant: "destructive" });
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
        <AlertTitle>{t.errorTitle}</AlertTitle>
        <AlertDescription>Gemini API key is not configured. Please add it to enable this feature.</AlertDescription>
      </Alert>
    );
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
        <Button type="submit" disabled={loading || !selectedReport1Id || !selectedReport2Id} className="w-full md:w-auto">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {t.analyzeProgressionBtn}
        </Button>
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

      {comparisonResult && comparisonResult.relatorio_comparativo && (
         <Tabs defaultValue="comparativo" className="w-full">
            <div className="flex justify-end mb-2">
                <Button onClick={handleSavePdf} disabled={pdfLoading} variant="outline" size="sm">
                    {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                    PDF
                </Button>
            </div>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="comparativo"><GitCompareArrows className="mr-2" />{t.tabComparative}</TabsTrigger>
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
                        {comparisonResult.relatorio_comparativo.consistencia_dados?.alerta_qualidade && (
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

    