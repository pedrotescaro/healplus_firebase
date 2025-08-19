
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { generateWoundReport, GenerateWoundReportOutput } from "@/ai/flows/generate-wound-report";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fileToDataUri } from "@/lib/file-to-data-uri";
import { UploadCloud, Loader2, FileText, Download } from "lucide-react";
import { AnamnesisFormValues } from "@/lib/anamnesis-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useAuth } from "@/hooks/use-auth";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

export function ReportGenerator() {
  const [woundImage, setWoundImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAnamnesisId, setSelectedAnamnesisId] = useState<string>("");
  const [anamnesisRecords, setAnamnesisRecords] = useState<StoredAnamnesis[]>([]);
  const [report, setReport] = useState<GenerateWoundReportOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    try {
      const key = `heal-plus-anamneses-${user.uid}`;
      const storedData = localStorage.getItem(key);
      if (storedData) {
        setAnamnesisRecords(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load anamnesis records from localStorage", error);
      toast({
        title: "Erro ao Carregar",
        description: "Não foi possível carregar as fichas de anamnese salvas.",
        variant: "destructive",
      });
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWoundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!woundImage || !selectedAnamnesisId) {
      toast({
        title: "Informações Faltando",
        description: "Por favor, selecione uma anamnese e carregue uma imagem da ferida.",
        variant: "destructive",
      });
      return;
    }

    const selectedRecord = anamnesisRecords.find(record => record.id === selectedAnamnesisId);
    if (!selectedRecord) {
       toast({
        title: "Erro",
        description: "Não foi possível encontrar a ficha de anamnese selecionada.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setReport(null);
    try {
      const woundImageUri = await fileToDataUri(woundImage);
      // Convert the anamnesis data to a string for the AI prompt
      const anamnesisDataString = JSON.stringify(selectedRecord, null, 2);
      const result = await generateWoundReport({ woundImage: woundImageUri, anamnesisData: anamnesisDataString });
      setReport(result);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar o relatório. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

 const handleSavePdf = async () => {
    if (!report || !selectedAnamnesisId || !imagePreview) return;
    setPdfLoading(true);

    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const selectedRecord = anamnesisRecords.find(record => record.id === selectedAnamnesisId);
        if (!selectedRecord) return;

        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        
        const addFooter = () => {
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                const footerText = `Gerado por Heal+ em ${new Date().toLocaleDateString('pt-BR')} | Página ${i} de ${pageCount}`;
                doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
            }
        };

        // --- Cabeçalho ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text("Relatório de Avaliação e Plano de Tratamento de Ferida", pageWidth / 2, 20, { align: 'center' });

        // --- Identificação do Paciente ---
        doc.setFontSize(12);
        const evaluationDate = new Date(selectedRecord.data_consulta + 'T' + selectedRecord.hora_consulta);
        const formattedDate = evaluationDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        const formattedTime = evaluationDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        autoTable(doc, {
            startY: 30,
            head: [['Identificação do Paciente']],
            body: [
                [{ content: `Paciente: ${selectedRecord.nome_cliente}`, styles: { fontStyle: 'bold' } }],
                [`Data da Avaliação: ${formattedDate}, ${formattedTime}`],
            ],
            theme: 'striped',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
        });

        // --- Anamnese ---
        const anamnesisBody = [
            ['Histórico Médico', selectedRecord.historico_cicatrizacao || 'Nenhum relatado'],
            ['Alergias', selectedRecord.possui_alergia ? selectedRecord.qual_alergia : 'Nenhuma relatada'],
            ['Medicamentos em Uso', selectedRecord.usa_medicacao ? selectedRecord.qual_medicacao : 'Nenhum'],
            ['Hábitos', `Atividade Física: ${selectedRecord.pratica_atividade_fisica ? 'Sim' : 'Não'}\nÁlcool: ${selectedRecord.ingestao_alcool ? 'Sim' : 'Não'}\nFumante: ${selectedRecord.fumante ? 'Sim' : 'Não'}`],
            ['Queixa Principal', `Ferida em ${selectedRecord.localizacao_ferida} com ${selectedRecord.tempo_evolucao} de evolução.`],
        ];

        autoTable(doc, {
            head: [['Anamnese']],
            body: anamnesisBody,
            theme: 'grid',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
            didDrawPage: () => addFooter(),
        });
        
        let finalY = (doc as any).lastAutoTable.finalY;

        // --- Imagem da Ferida ---
         if (doc.internal.pageSize.getHeight() - finalY < 80) {
            doc.addPage();
            finalY = margin;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("Imagem da Ferida Analisada", margin, finalY + 10);
        
        const img = new (window as any).Image();
        img.src = imagePreview;
        await new Promise(resolve => { img.onload = resolve; });

        const imgProps = doc.getImageProperties(imagePreview);
        const imgWidth = 80;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const imgX = (pageWidth - imgWidth) / 2;
        doc.addImage(imagePreview, 'PNG', imgX, finalY + 15, imgWidth, imgHeight);
        finalY += imgHeight + 20;


        // --- Avaliação da Ferida (IA) ---
        const cleanReportText = report.report.replace(/\*\*/g, ''); // Remove asterisks
        autoTable(doc, {
            startY: finalY + 5,
            head: [['Avaliação da Ferida (Análise por IA)']],
            body: [[cleanReportText]],
            theme: 'grid',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
            didDrawPage: () => addFooter(),
        });

        addFooter();

        // --- Salvar o PDF ---
        const fileName = `Relatorio_${selectedRecord.nome_cliente.replace(/\s/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
            title: "Erro ao Gerar PDF",
            description: "Não foi possível salvar o relatório em PDF. Tente novamente.",
            variant: "destructive",
        });
    } finally {
        setPdfLoading(false);
    }
};

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="wound-image">Imagem da Ferida</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="wound-image" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Wound preview" width={200} height={200} className="object-contain h-48 w-full" data-ai-hint="wound" />
                        ) : (
                            <>
                                <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                                <p className="text-xs text-gray-500">PNG, JPG, ou WEBP</p>
                            </>
                        )}
                    </div>
                    <Input id="wound-image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
            </div>
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="anamnesis-data">Selecionar Anamnese Salva</Label>
            <Select onValueChange={setSelectedAnamnesisId} value={selectedAnamnesisId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma ficha de anamnese..." />
              </SelectTrigger>
              <SelectContent>
                {anamnesisRecords.length > 0 ? (
                  anamnesisRecords.map((record) => (
                    <SelectItem key={record.id} value={record.id}>
                      {record.nome_cliente} - {new Date(record.data_consulta).toLocaleDateString()}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-records" disabled>
                    Nenhuma ficha de anamnese encontrada.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground pt-2">
                As fichas de anamnese são salvas localmente no seu navegador. Crie uma nova na página "Nova Anamnese".
            </p>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gerar Relatório
        </Button>
      </form>

      {loading && (
        <div className="flex items-center justify-center flex-col text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Gerando relatório... Isso pode levar um momento.</p>
        </div>
      )}

      {report && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Relatório da Ferida Gerado
            </CardTitle>
             <Button onClick={handleSavePdf} disabled={pdfLoading} variant="outline" size="sm">
              {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Salvar em PDF
            </Button>
          </CardHeader>
          <CardContent ref={reportRef}>
             {imagePreview && (
                <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2 text-center">Imagem da Ferida Analisada</h3>
                    <Image src={imagePreview} alt="Wound analysed" width={300} height={300} className="rounded-md object-contain mx-auto" data-ai-hint="wound" />
                </div>
            )}
            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
              {report.report}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
