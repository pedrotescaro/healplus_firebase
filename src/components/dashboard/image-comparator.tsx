
"use client";

import { useState } from "react";
import Image from "next/image";
import { compareWoundImages, CompareWoundImagesOutput } from "@/ai/flows/compare-wound-images";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fileToDataUri } from "@/lib/file-to-data-uri";
import { UploadCloud, Loader2, GitCompareArrows, Camera, AlertCircle, Sparkles, FileImage, ClipboardCheck, FileDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ImageCapture } from "@/components/dashboard/image-capture";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/contexts/app-provider";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';


const isAIEnabled = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

type ImageFileState = {
    file: File | null;
    preview: string | null;
    id: string;
    datetime: string;
}

export function ImageComparator() {
  const [image1, setImage1] = useState<ImageFileState>({ file: null, preview: null, id: '', datetime: '' });
  const [image2, setImage2] = useState<ImageFileState>({ file: null, preview: null, id: '', datetime: '' });
  const [comparison, setComparison] = useState<CompareWoundImagesOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, imageNumber);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      if (user) {
        await addDoc(collection(db, "users", user.uid, "comparisons"), {
          ...result,
          image1Metadata: { id: image1.id, datetime: image1.datetime, url: image1DataUri },
          image2Metadata: { id: image2.id, datetime: image2.datetime, url: image2DataUri },
          createdAt: serverTimestamp(),
        });
        toast({
          title: "Comparação Salva",
          description: "O resultado da análise foi salvo no seu histórico.",
        });
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
    if (!comparison || !image1.preview || !image2.preview) return;
    setPdfLoading(true);
    
    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text("Relatório Comparativo de Progressão de Ferida", pageWidth / 2, 20, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const analysisPeriod = comparison.relatorio_comparativo.periodo_analise || `De ${image1.datetime} a ${image2.datetime}`;
        doc.text(`Período de Análise: ${analysisPeriod}`, pageWidth / 2, 28, { align: 'center' });
        
        let finalY = 35;
        
        // Add images side by side
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Imagens Comparadas", margin, finalY);
        finalY += 8;

        const imgWidth = (pageWidth - margin * 3) / 2;
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
        
        const summaryText = doc.splitTextToSize(comparison.relatorio_comparativo.resumo_descritivo_evolucao, pageWidth - margin * 2);
        
        autoTable(doc, {
            startY: finalY,
            head: [['Resumo Descritivo da Evolução']],
            body: [[summaryText]],
            theme: 'grid',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
        });
        
        finalY = (doc as any).lastAutoTable.finalY + 10;

        const delta = comparison.relatorio_comparativo.analise_quantitativa_progressao;
        const tableBody = [
            ["Δ Área Total Afetada", delta.delta_area_total_afetada],
            ["Δ Coloração (Hiperpigmentação)", delta.delta_coloracao.mudanca_area_hiperpigmentacao],
            ["Δ Coloração (Eritema/Rubor)", delta.delta_coloracao.mudanca_area_eritema_rubor],
            ["Δ Edema", delta.delta_edema],
            ["Δ Textura", delta.delta_textura],
        ];

        autoTable(doc, {
            startY: finalY,
            head: [['Análise Quantitativa (Delta Δ)', 'Variação']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
        });

        const fileName = `Comparativo_${image1.id}_vs_${image2.id}.pdf`;
        doc.save(fileName);

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
          title: "Erro ao Gerar PDF",
          description: "Não foi possível criar o arquivo PDF. Tente novamente.",
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
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    onCapture: (file: File) => void,
    imageState: ImageFileState,
    setImageState: React.Dispatch<React.SetStateAction<ImageFileState>>,
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
            <div onClick={(e) => e.stopPropagation()}>
              <ImageCapture onCapture={onCapture}>
                <Button type="button" variant="outline" size="sm">
                  <Camera className="mr-2" />
                  Tirar Foto
                </Button>
              </ImageCapture>
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
    return <Badge variant={variant(value)}>{label}: {value}</Badge>;
  };

  const IndividualAnalysisCard = ({ analysis }: { analysis: CompareWoundImagesOutput['analise_imagem_1'] }) => {
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUploader 
            id="image-1" 
            onFileChange={(e) => handleFileChange(e, 1)} 
            onCapture={(file) => handleFileSelect(file, 1)}
            imageState={image1}
            setImageState={setImage1}
            label="Imagem 1 (ex: mais antiga)" 
          />
          <ImageUploader 
            id="image-2" 
            onFileChange={(e) => handleFileChange(e, 2)} 
            onCapture={(file) => handleFileSelect(file, 2)}
            imageState={image2}
            setImageState={setImage2}
            label="Imagem 2 (ex: mais recente)" 
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Analisar Progressão
        </Button>
      </form>

      {loading && (
        <div className="flex items-center justify-center flex-col text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">A IA está realizando a análise tecidual... Isso pode levar um momento.</p>
        </div>
      )}

      {comparison && (
        <Tabs defaultValue="comparativo" className="w-full">
            <div className="flex justify-end mb-2">
                <Button onClick={handleSavePdf} disabled={pdfLoading} variant="outline" size="sm">
                    {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                    Salvar em PDF
                </Button>
            </div>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="comparativo"><GitCompareArrows className="mr-2" />Comparativo</TabsTrigger>
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
