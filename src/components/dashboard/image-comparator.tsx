
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { compareWoundImages, CompareWoundImagesOutput } from "@/ai/flows/compare-wound-images";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fileToDataUri } from "@/lib/file-to-data-uri";
import { UploadCloud, Loader2, GitCompareArrows, Camera, AlertCircle, Sparkles, FileImage, ClipboardCheck, FileDown, TrendingUp, TrendingDown, Minus, Calendar, Clock, BarChart3, Download, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ImageCapture } from "@/components/dashboard/image-capture";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/contexts/app-provider";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

const isAIEnabled = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

type ImageFileState = {
    file: File | null;
    preview: string | null;
    id: string;
    datetime: string;
}

type ComparisonHistory = {
    id: string;
    image1Metadata: any;
    image2Metadata: any;
    createdAt: any;
    relatorio_comparativo: any;
    progressMetrics?: ProgressMetrics;
}

type ProgressMetrics = {
    areaChange: number;
    healingScore: number;
    tissueImprovement: number;
    overallProgress: 'melhora' | 'piora' | 'estavel';
}

const chartConfig = {
  pixels: {
    label: "Pixels",
  },
  Vermelhos: {
    label: "Vermelhos",
    color: "hsl(var(--chart-1))",
  },
  Amarelos: {
    label: "Amarelos",
    color: "hsl(var(--chart-2))",
  },
  Pretos: {
    label: "Pretos",
    color: "hsl(var(--chart-3))",
  },
  "Brancos/Ciano": {
    label: "Brancos/Ciano",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function ImageComparator() {
  const [image1, setImage1] = useState<ImageFileState>({ file: null, preview: null, id: '', datetime: '' });
  const [image2, setImage2] = useState<ImageFileState>({ file: null, preview: null, id: '', datetime: '' });
  const [comparison, setComparison] = useState<CompareWoundImagesOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [comparisonHistory, setComparisonHistory] = useState<ComparisonHistory[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<ComparisonHistory | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Carregar histórico de comparações
  useEffect(() => {
    const fetchComparisonHistory = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, "users", user.uid, "comparisons"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        } as ComparisonHistory));
        setComparisonHistory(history);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    };

    fetchComparisonHistory();
  }, [user]);

  // Calcular métricas de progresso
  const calculateProgressMetrics = (comparison: CompareWoundImagesOutput): ProgressMetrics => {
    const delta = comparison.relatorio_comparativo.analise_quantitativa_progressao;
    
    // Extrair mudança de área (assumindo formato como "-15.2%" ou "+5.1%")
    const areaChangeText = delta.delta_area_total_afetada;
    const areaChange = parseFloat(areaChangeText.replace(/[^\d.-]/g, '')) || 0;
    
    // Calcular score de cicatrização baseado em múltiplos fatores
    let healingScore = 50; // Base score
    
    // Área: redução é boa
    if (areaChange < 0) healingScore += Math.abs(areaChange) * 2;
    else healingScore -= areaChange * 2;
    
    // Edema: redução é boa
    const edemaText = delta.delta_edema;
    if (edemaText.includes('redução') || edemaText.includes('diminuição')) healingScore += 15;
    else if (edemaText.includes('aumento')) healingScore -= 15;
    
    // Textura: melhora é boa
    const texturaText = delta.delta_textura;
    if (texturaText.includes('melhora') || texturaText.includes('melhor')) healingScore += 10;
    else if (texturaText.includes('piora')) healingScore -= 10;
    
    healingScore = Math.max(0, Math.min(100, healingScore));
    
    // Determinar progresso geral
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

  const handleFileSelect = (file: File, imageNumber: 1 | 2) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const now = new Date();
        const datetime = now.toISOString().slice(0, 19);
        const newImageState: ImageFileState = {
            file,
            preview: reader.result as string,
            id: file.name || `image-${imageNumber}-${now.getTime()}`,
            datetime,
        };
        if (imageNumber === 1) {
            setImage1(newImageState);
        } else {
            setImage2(newImageState);
        }
    };
    reader.readAsDataURL(file);
  };
  
  const handleFileChange = (e: any, imageNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, imageNumber);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!image1.file || !image2.file) {
      toast({
        title: "Imagens Faltando",
        description: "Por favor, envie ambas as imagens da ferida para comparação.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setComparison(null);
    try {
      const [image1DataUri, image2DataUri] = await Promise.all([
        fileToDataUri(image1.file),
        fileToDataUri(image2.file),
      ]);
      const result = await compareWoundImages({
        image1DataUri,
        image2DataUri,
        image1Metadata: { id: image1.id, datetime: image1.datetime },
        image2Metadata: { id: image2.id, datetime: image2.datetime },
       });

      const quality1 = result.analise_imagem_1.avaliacao_qualidade;
      const quality2 = result.analise_imagem_2.avaliacao_qualidade;

      const isQualityGood = quality1.iluminacao === "Adequada" && quality1.foco === "Nítido" &&
                            quality2.iluminacao === "Adequada" && quality2.foco === "Nítido";

      setComparison(result);
      
      // Calcular métricas de progresso
      const metrics = calculateProgressMetrics(result);
      setProgressMetrics(metrics);
      
      if (user) {
        try {
          const docRef = await addDoc(collection(db, "users", user.uid, "comparisons"), {
            ...result,
            image1Metadata: { id: image1.id, datetime: image1.datetime, url: image1DataUri },
            image2Metadata: { id: image2.id, datetime: image2.datetime, url: image2DataUri },
            progressMetrics: metrics,
            createdAt: serverTimestamp(),
          });
          
          toast({
            title: "Comparação Salva",
            description: "O resultado da análise foi salvo no seu histórico.",
          });
          
          // Atualizar histórico local
          setComparisonHistory((prev: any) => [{
            id: docRef.id,
            image1Metadata: { id: image1.id, datetime: image1.datetime, url: image1DataUri },
            image2Metadata: { id: image2.id, datetime: image2.datetime, url: image2DataUri },
            relatorio_comparativo: result.relatorio_comparativo,
            createdAt: new Date(),
            progressMetrics: metrics
          }, ...prev.slice(0, 9)]);
          
        } catch (saveError) {
          console.error("Erro ao salvar comparação:", saveError);
          toast({
            title: "Erro ao Salvar",
            description: "A análise foi realizada, mas não foi possível salvar no histórico. Tente novamente.",
            variant: "destructive",
          });
        }
      }

      if (!isQualityGood) {
        toast({
            title: t.imageQualityAlertTitle || "Alerta de Qualidade da Imagem",
            description: t.imageQualityAlertDescription || "Uma ou ambas as imagens têm baixa qualidade (iluminação ou foco), o que pode afetar a precisão da análise. Recomenda-se usar imagens mais nítidas e bem iluminadas.",
            variant: "destructive",
            duration: 8000
        });
      }
    } catch (error) {
      console.error("Erro ao comparar imagens:", error);
      toast({
        title: "Erro na Análise",
        description: "A IA não conseguiu processar a comparação. Verifique a qualidade das imagens ou tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSavePdf = async () => {
    if (!comparison || !image1.preview || !image2.preview) {
      toast({
        title: "Dados Incompletos",
        description: "Não é possível gerar o PDF sem as imagens e análise.",
        variant: "destructive",
      });
      return;
    }
    
    setPdfLoading(true);
    
    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Título
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text("Relatório Comparativo de Progressão de Ferida", pageWidth / 2, 20, { align: 'center' });

        // Período de análise
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const analysisPeriod = comparison.relatorio_comparativo?.periodo_analise || `De ${image1.datetime} a ${image2.datetime}`;
        doc.text(`Período de Análise: ${analysisPeriod}`, pageWidth / 2, 28, { align: 'center' });
        
        let finalY = 35;
        
        // Imagens lado a lado
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Imagens Comparadas", margin, finalY);
        finalY += 8;

        const imgWidth = (pageWidth - margin * 3) / 2;
        
        try {
          const img1Props = doc.getImageProperties(image1.preview);
          const img2Props = doc.getImageProperties(image2.preview);
          const img1Height = (img1Props.height * imgWidth) / img1Props.width;
          const img2Height = (img2Props.height * imgWidth) / img2Props.width;
          const maxHeight = Math.max(img1Height, img2Height);

          doc.addImage(image1.preview, 'PNG', margin, finalY, imgWidth, img1Height);
          doc.addImage(image2.preview, 'PNG', margin + imgWidth + margin, finalY, imgWidth, img2Height);
          
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.text(`Imagem 1 (${image1.id})`, margin, finalY + maxHeight + 4);
          doc.text(`Imagem 2 (${image2.id})`, margin + imgWidth + margin, finalY + maxHeight + 4);
          
          finalY += maxHeight + 10;
        } catch (imgError) {
          console.warn("Erro ao adicionar imagens:", imgError);
          doc.text("Imagens não puderam ser incluídas no PDF", margin, finalY);
          finalY += 10;
        }
        
        // Resumo descritivo
        if (comparison.relatorio_comparativo?.resumo_descritivo_evolucao) {
          const summaryText = doc.splitTextToSize(comparison.relatorio_comparativo.resumo_descritivo_evolucao, pageWidth - margin * 2);
          
          autoTable(doc, {
              startY: finalY,
              head: [['Resumo Descritivo da Evolução']],
              body: [[summaryText]],
              theme: 'grid',
              headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
          });
          
          finalY = (doc as any).lastAutoTable.finalY + 10;
        }

        // Análise quantitativa
        if (comparison.relatorio_comparativo?.analise_quantitativa_progressao) {
          const delta = comparison.relatorio_comparativo.analise_quantitativa_progressao;
          const tableBody = [
              ["Δ Área Total Afetada", delta.delta_area_total_afetada || "N/A"],
              ["Δ Coloração (Hiperpigmentação)", delta.delta_coloracao?.mudanca_area_hiperpigmentacao || "N/A"],
              ["Δ Coloração (Eritema/Rubor)", delta.delta_coloracao?.mudanca_area_eritema_rubor || "N/A"],
              ["Δ Edema", delta.delta_edema || "N/A"],
              ["Δ Textura", delta.delta_textura || "N/A"],
          ];

          autoTable(doc, {
              startY: finalY,
              head: [['Análise Quantitativa (Delta Δ)', 'Variação']],
              body: tableBody,
              theme: 'striped',
              headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
          });
        }

        // Salvar arquivo
        const fileName = `Comparativo_${image1.id}_vs_${image2.id}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        toast({
          title: "PDF Gerado",
          description: "O relatório foi baixado com sucesso.",
        });

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
          title: "Erro ao Gerar PDF",
          description: "Não foi possível criar o arquivo PDF. Verifique se as imagens estão carregadas e tente novamente.",
          variant: "destructive",
      });
    } finally {
      setPdfLoading(false);
    }
  };

  const ImageUploader = ({ 
    id, 
    onFileChange, 
    onCapture,
    imageState,
    setImageState, 
    label 
  }: { 
    id: string, 
    onFileChange: (e: any) => void, 
    onCapture: (fileOrUrl: string | File) => void,
    imageState: ImageFileState,
    setImageState: any,
    label: string 
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
       <div className="relative flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-4">
        {imageState.preview ? (
          <div className="relative h-full w-full">
            <Image src={imageState.preview} alt="Pré-visualização da ferida" layout="fill" className="object-contain" data-ai-hint="wound" />
          </div>
        ) : (
          <>
            <label htmlFor={id} className="w-full cursor-pointer flex-grow flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors">
              <UploadCloud className="mb-2 h-8 w-8" />
              <p className="font-semibold">Arraste ou clique para enviar</p>
              <p className="text-xs">PNG, JPG, ou WEBP</p>
            </label>
            <div className="my-2 text-xs text-muted-foreground">OU</div>
            <div onClick={(e: any) => e.stopPropagation()}>
              <ImageCapture onCapture={onCapture} children={
                <Button type="button" variant="outline" size="sm">
                  <Camera className="mr-2" />
                  Tirar Foto
                </Button>
              } />
            </div>
          </>
        )}
      </div>
      <Input id={id} type="file" className="sr-only" accept="image/*" onChange={onFileChange} />
      {imageState.preview && (
        <Button type="button" variant="link" className="w-full" onClick={() => {
          setImageState({ file: null, preview: null, id: '', datetime: '' });
        }}>
          Remover Imagem
        </Button>
      )}
    </div>
  );

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
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${variant(value) === 'default' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>{label}: {value}</span>;
  };

  const ProgressIndicator = ({ metrics }: { metrics: ProgressMetrics }) => {
    const getProgressIcon = () => {
      switch (metrics.overallProgress) {
        case 'melhora': return <TrendingUp className="h-4 w-4 text-green-600" />;
        case 'piora': return <TrendingDown className="h-4 w-4 text-red-600" />;
        default: return <Minus className="h-4 w-4 text-yellow-600" />;
      }
    };

    const getProgressColor = () => {
      switch (metrics.overallProgress) {
        case 'melhora': return 'bg-green-500';
        case 'piora': return 'bg-red-500';
        default: return 'bg-yellow-500';
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

  const HistorySelector = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Comparações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(value: any) => {
          const item = comparisonHistory.find((h: any) => h.id === value);
          setSelectedHistoryItem(item || null);
          if (item) {
            setImage1({
              file: null,
              preview: item.image1Metadata.url,
              id: item.image1Metadata.id,
              datetime: item.image1Metadata.datetime
            });
            setImage2({
              file: null,
              preview: item.image2Metadata.url,
              id: item.image2Metadata.id,
              datetime: item.image2Metadata.datetime
            });
            setProgressMetrics(item.progressMetrics || null);
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma comparação anterior" />
          </SelectTrigger>
          <SelectContent>
            {comparisonHistory.map((item: any) => (
              <SelectItem key={item.id} value={item.id}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</span>
                  {item.progressMetrics && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${item.progressMetrics.overallProgress === 'melhora' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                      {item.progressMetrics.overallProgress}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );

  const ColorHistogramChart = ({ data, title }: { data: any[], title: string }) => {
    const chartData = data.map(item => ({
      name: item.faixa_cor,
      [item.faixa_cor]: item.contagem_pixels_percentual
    }));
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-64">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" dataKey="value" hide />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="Vermelhos" fill="var(--color-Vermelhos)" radius={4} />
              <Bar dataKey="Amarelos" fill="var(--color-Amarelos)" radius={4} />
              <Bar dataKey="Pretos" fill="var(--color-Pretos)" radius={4} />
              <Bar dataKey="Brancos/Ciano" fill="var(--color-Brancos/Ciano)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  };
  
  const IndividualAnalysisCard = ({ analysis }: { analysis: CompareWoundImagesOutput['analise_imagem_1'] }) => {
      const { avaliacao_qualidade, analise_dimensional, analise_colorimetrica, analise_textura_e_caracteristicas, analise_histograma } = analysis;
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
                              {analise_colorimetrica.cores_dominantes.map((c: any) => (
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
              {analise_histograma && <ColorHistogramChart data={analise_histograma.distribuicao_cores} title="Histograma de Cores" />}
          </div>
      )
  };

  if (!isAIEnabled) {
    return (
       <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Funcionalidade de IA Desativada</AlertTitle>
        <AlertDescription>
          A chave de API do Gemini não foi configurada. Por favor, adicione a `GEMINI_API_KEY` ao seu ambiente para habilitar a comparação de imagens.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      {/* Histórico de Comparações */}
      {comparisonHistory.length > 0 && (
        <HistorySelector />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUploader 
            id="image-1" 
            onFileChange={(e: any) => handleFileChange(e, 1)} 
            onCapture={(fileOrUrl) => {
              if (fileOrUrl instanceof File) {
                handleFileSelect(fileOrUrl, 1);
              }
            }}
            imageState={image1}
            setImageState={setImage1}
            label="Imagem 1 (ex: mais antiga)" 
          />
          <ImageUploader 
            id="image-2" 
            onFileChange={(e: any) => handleFileChange(e, 2)} 
            onCapture={(fileOrUrl) => {
              if (fileOrUrl instanceof File) {
                handleFileSelect(fileOrUrl, 2);
              }
            }}
            imageState={image2}
            setImageState={setImage2}
            label="Imagem 2 (ex: mais recente)" 
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1 md:flex-none">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analisar Progressão
          </Button>
          {comparison && (
            <Button onClick={handleSavePdf} disabled={pdfLoading} variant="outline">
              {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Exportar PDF
            </Button>
          )}
        </div>
      </form>

      {loading && (
        <div className="flex items-center justify-center flex-col text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">A IA está realizando a análise tecidual... Isso pode levar um momento.</p>
        </div>
      )}

      {comparison && (
        <Tabs defaultValue="comparativo" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="comparativo"><GitCompareArrows className="mr-2" />Comparativo</TabsTrigger>
                <TabsTrigger value="metricas"><BarChart3 className="mr-2" />Métricas</TabsTrigger>
                <TabsTrigger value="imagem1"><FileImage className="mr-2" />Análise Imagem 1</TabsTrigger>
                <TabsTrigger value="imagem2"><FileImage className="mr-2" />Análise Imagem 2</TabsTrigger>
            </TabsList>
            <TabsContent value="comparativo" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ClipboardCheck /> Relatório Comparativo de Progressão</CardTitle>
                        <CardDescription>Análise da evolução entre {comparison.relatorio_comparativo.intervalo_tempo}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {comparison.relatorio_comparativo.consistencia_dados.alerta_qualidade && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Alerta de Qualidade</AlertTitle>
                                <AlertDescription>{comparison.relatorio_comparativo.consistencia_dados.alerta_qualidade}</AlertDescription>
                            </Alert>
                        )}
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Resumo Descritivo da Evolução</h3>
                            <p className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">{comparison.relatorio_comparativo.resumo_descritivo_evolucao}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Análise Quantitativa (Delta Δ)</h3>
                            <Table>
                                <TableBody>
                                    <TableRow><TableCell className="font-medium">Δ Área Total Afetada</TableCell><TableCell>{comparison.relatorio_comparativo.analise_quantitativa_progressao.delta_area_total_afetada}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Δ Hiperpigmentação</TableCell><TableCell>{comparison.relatorio_comparativo.analise_quantitativa_progressao.delta_coloracao.mudanca_area_hiperpigmentacao}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Δ Eritema/Rubor</TableCell><TableCell>{comparison.relatorio_comparativo.analise_quantitativa_progressao.delta_coloracao.mudanca_area_eritema_rubor}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Δ Edema</TableCell><TableCell>{comparison.relatorio_comparativo.analise_quantitativa_progressao.delta_edema}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Δ Textura</TableCell><TableCell>{comparison.relatorio_comparativo.analise_quantitativa_progressao.delta_textura}</TableCell></TableRow>
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
                 <IndividualAnalysisCard analysis={comparison.analise_imagem_1} />
            </TabsContent>
            <TabsContent value="imagem2" className="mt-4">
                <IndividualAnalysisCard analysis={comparison.analise_imagem_2} />
            </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
