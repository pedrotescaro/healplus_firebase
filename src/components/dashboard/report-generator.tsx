
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { generateWoundReport, GenerateWoundReportOutput } from "@/ai/flows/generate-wound-report";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fileToDataUri } from "@/lib/file-to-data-uri";
import { UploadCloud, Loader2, FileText, Download, Camera, AlertCircle } from "lucide-react";
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
import { ImageCapture } from "./image-capture";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type StoredAnamnesis = AnamnesisFormValues & { id: string };
const isAIEnabled = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export function ReportGenerator() {
  const [woundImage, setWoundImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAnamnesisId, setSelectedAnamnesisId] = useState<string>("");
  const [anamnesisRecords, setAnamnesisRecords] = useState<StoredAnamnesis[]>([]);
  const [report, setReport] = useState<GenerateWoundReportOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "users", user.uid, "anamnesis"), orderBy("data_consulta", "desc"));
        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredAnamnesis));
        setAnamnesisRecords(records);
      } catch (error) {
        console.error("Error fetching anamnesis records from Firestore: ", error);
        toast({
          title: "Erro ao Carregar",
          description: "Não foi possível carregar as fichas de anamnese salvas.",
          variant: "destructive",
        });
      }
    };
    if (user) {
      fetchRecords();
    }
  }, [user, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    setWoundImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
      const anamnesisDataString = JSON.stringify(selectedRecord, null, 2);
      const result = await generateWoundReport({ woundImage: woundImageUri, anamnesisData: anamnesisDataString });
      setReport(result);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar o relatório. Verifique se a chave de API do Gemini está configurada corretamente.",
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

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text("Relatório de Avaliação e Plano de Tratamento de Ferida", pageWidth / 2, 20, { align: 'center' });

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

        const anamnesisBody = [
            ['Histórico Médico', selectedRecord.historico_cicrizacao || 'Nenhum relatado'],
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

        const cleanReportText = report.report.replace(/\*\*/g, '');
        autoTable(doc, {
            startY: finalY + 5,
            head: [['Avaliação da Ferida (Análise por IA)']],
            body: [[cleanReportText]],
            theme: 'grid',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
            didDrawPage: () => addFooter(),
        });

        addFooter();

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

  if (!isAIEnabled) {
    return (
       <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Funcionalidade de IA Desativada</AlertTitle>
        <AlertDescription>
          A chave de API do Gemini não foi configurada. Por favor, adicione a `GEMINI_API_KEY` ao seu ambiente para habilitar a geração de relatórios.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="wound-image">Imagem da Ferida</Label>
             <div className="relative flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-4">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <Image src={imagePreview} alt="Wound preview" layout="fill" className="object-contain" data-ai-hint="wound" />
                </div>
              ) : (
                <>
                  <label htmlFor="wound-image" className="w-full cursor-pointer flex-grow flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors">
                    <UploadCloud className="mb-2 h-8 w-8" />
                    <p className="font-semibold">Arraste ou clique para enviar</p>
                    <p className="text-xs">PNG, JPG, ou WEBP</p>
                  </label>
                  <div className="my-2 text-xs text-muted-foreground">OU</div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ImageCapture onCapture={handleFileSelect}>
                      <Button type="button" variant="outline" size="sm">
                        <Camera className="mr-2" />
                        Tirar Foto
                      </Button>
                    </ImageCapture>
                  </div>
                </>
              )}
            </div>
            <Input id="wound-image" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <Button type="button" variant="link" className="w-full" onClick={() => { setImagePreview(null); setWoundImage(null); }}>
                Remover Imagem
              </Button>
            )}
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
                      {record.nome_cliente} - {new Date(record.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
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
                As fichas de anamnese são salvas na nuvem e associadas à sua conta.
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
          <CardContent>
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
