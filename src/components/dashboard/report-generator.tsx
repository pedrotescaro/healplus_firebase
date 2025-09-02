
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { generateWoundReport, GenerateWoundReportOutput } from "@/ai/flows/generate-wound-report";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, AlertCircle, FileDown, ImageOff } from "lucide-react";
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
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp, where, getDoc, doc } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import { Input } from "../ui/input";

type StoredAnamnesis = AnamnesisFormValues & { id: string };
const isAIEnabled = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export function ReportGenerator() {
  const [selectedAnamnesisId, setSelectedAnamnesisId] = useState<string>("");
  const [anamnesisRecords, setAnamnesisRecords] = useState<StoredAnamnesis[]>([]);
  const [report, setReport] = useState<GenerateWoundReportOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const selectedRecord = anamnesisRecords.find(record => record.id === selectedAnamnesisId);

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
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !selectedRecord.woundImageUri) {
      toast({
        title: "Informações Faltando",
        description: "Por favor, selecione uma avaliação que contenha uma imagem da ferida.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setReport(null);
    
    try {
        // Find patient by name from the anamnesis record to associate the report
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("name", "==", selectedRecord.nome_cliente));
        const querySnapshot = await getDocs(q);

        let foundPatientId: string | null = null;
        if (!querySnapshot.empty) {
            // Assuming the first match is the correct one. 
            // A more robust system might handle multiple users with the same name.
            foundPatientId = querySnapshot.docs[0].id;
        } else {
             // For now, we'll allow generating reports even if a patient user account doesn't exist.
             // The report will be associated with the professional.
        }

      const anamnesisDataString = JSON.stringify(selectedRecord, null, 2);
      const result = await generateWoundReport({ woundImage: selectedRecord.woundImageUri, anamnesisData: anamnesisDataString });
      setReport(result);
      
      if (user) {
        // Save the report in the professional's subcollection
        await addDoc(collection(db, "users", user.uid, "reports"), {
          anamnesisId: selectedAnamnesisId,
          patientName: selectedRecord.nome_cliente,
          reportContent: result.report,
          woundImageUri: selectedRecord.woundImageUri,
          professionalId: user.uid,
          patientId: foundPatientId, // This can be null if no matching patient account is found
          createdAt: serverTimestamp(),
        });
        toast({ title: "Relatório Gerado e Salvo", description: "O relatório foi gerado com sucesso." });
      }
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
    if (!report || !selectedRecord || !selectedRecord.woundImageUri || !user) return;
    setPdfLoading(true);

    try {
        const doc = new jsPDF('p', 'mm', 'a4');
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

        const anamnesisDocRef = doc(db, "users", user.uid, "anamnesis", selectedRecord.id);
        const anamnesisSnap = await getDoc(anamnesisDocRef);
        if (!anamnesisSnap.exists()) {
          toast({ title: "Erro", description: "Ficha de anamnese associada não encontrada.", variant: "destructive" });
          setPdfLoading(false);
          return;
        }
        const anamnesisRecord = anamnesisSnap.data() as AnamnesisFormValues;

        const anamnesisBody = [
            ['Histórico Médico', anamnesisRecord.historico_cicrizacao || 'Nenhum relatado'],
            ['Alergias', anamnesisRecord.possui_alergia ? anamnesisRecord.qual_alergia : 'Nenhuma relatada'],
            ['Hábitos', `Atividade Física: ${anamnesisRecord.pratica_atividade_fisica ? 'Sim' : 'Não'}\nÁlcool: ${anamnesisRecord.ingestao_alcool ? 'Sim' : 'Não'}\nFumante: ${anamnesisRecord.fumante ? 'Sim' : 'Não'}`],
            ['Queixa Principal', `Ferida em ${anamnesisRecord.localizacao_ferida} com ${anamnesisRecord.tempo_evolucao} de evolução.`],
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
        img.src = selectedRecord.woundImageUri;
        await new Promise(resolve => { img.onload = resolve; });

        const imgProps = doc.getImageProperties(selectedRecord.woundImageUri);
        const imgWidth = 80;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const imgX = (pageWidth - imgWidth) / 2;
        doc.addImage(selectedRecord.woundImageUri, 'PNG', imgX, finalY + 15, imgWidth, imgHeight);
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
        <div className="grid gap-6 lg:grid-cols-2">
           <div className="space-y-2 flex flex-col">
            <Label htmlFor="anamnesis-data">Selecionar Avaliação</Label>
            <Select onValueChange={setSelectedAnamnesisId} value={selectedAnamnesisId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma ficha de avaliação..." />
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
                    Nenhuma ficha encontrada. Crie uma na página de "Nova Avaliação".
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Imagem da Ferida (da avaliação selecionada)</Label>
             <div className="relative flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-4">
              {selectedRecord?.woundImageUri ? (
                <div className="relative h-full w-full">
                  <Image src={selectedRecord.woundImageUri} alt="Wound preview" layout="fill" className="object-contain" data-ai-hint="wound" />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageOff className="mx-auto h-12 w-12" />
                  <p className="mt-2">Selecione uma avaliação para ver a imagem.</p>
                  {selectedAnamnesisId && !selectedRecord?.woundImageUri && (
                    <Alert variant="destructive" className="mt-4 text-left">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Imagem não encontrada!</AlertTitle>
                        <AlertDescription>
                            Esta avaliação não possui uma imagem. Por favor, 
                            <Link href={`/dashboard/anamnesis?edit=${selectedAnamnesisId}`} className="font-bold underline"> edite a ficha</Link> para adicionar uma.
                        </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <Button type="submit" disabled={loading || !selectedRecord?.woundImageUri} className="w-full md:w-auto">
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
              {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Salvar em PDF
            </Button>
          </CardHeader>
          <CardContent>
             {selectedRecord?.woundImageUri && (
                <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2 text-center">Imagem da Ferida Analisada</h3>
                    <div className="relative w-full max-w-sm mx-auto aspect-square">
                        <Image src={selectedRecord.woundImageUri} alt="Wound analysed" layout="fill" className="rounded-md object-contain" data-ai-hint="wound" />
                    </div>
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
