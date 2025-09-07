
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { getRisk, createAssessment, getAnalysis } from "@/lib/api-client";
import { getRisk, getAnalysis } from "@/lib/api-client";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

// Helper function to create a static report from anamnesis data
const createStaticReport = (record: StoredAnamnesis): string => {
  let report = `## Relatório de Avaliação de Ferida\n\n`;
  report += `**Paciente:** ${record.nome_cliente}\n`;
  report += `**Data da Avaliação:** ${new Date(record.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}\n\n`;

  report += `### 1. Avaliação da Ferida\n`;
  report += `- **Localização:** ${record.localizacao_ferida}\n`;
  report += `- **Tempo de Evolução:** ${record.tempo_evolucao}\n`;
  report += `- **Etiologia:** ${record.etiologia_ferida === 'Outra' ? record.etiologia_outra : record.etiologia_ferida}\n`;
  report += `- **Dimensões:** ${record.ferida_comprimento || 0}cm (C) x ${record.ferida_largura || 0}cm (L) x ${record.ferida_profundidade || 0}cm (P)\n`;
  report += `- **Leito da Ferida:**\n`;
  if (record.percentual_granulacao_leito) report += `  - Tecido de Granulação: ${record.percentual_granulacao_leito}%\n`;
  if (record.percentual_epitelizacao_leito) report += `  - Tecido de Epitelização: ${record.percentual_epitelizacao_leito}%\n`;
  if (record.percentual_esfacelo_leito) report += `  - Esfacelo: ${record.percentual_esfacelo_leito}%\n`;
  if (record.percentual_necrose_seca_leito) report += `  - Necrose: ${record.percentual_necrose_seca_leito}%\n`;
  report += `- **Exsudato:** ${record.quantidade_exsudato || 'Não informado'}, ${record.tipo_exsudato || 'Não informado'}\n`;
  report += `- **Bordas:** ${record.bordas_caracteristicas || 'Não informado'}\n`;
  report += `- **Pele Perilesional:** ${record.pele_perilesional_umidade || 'Não informado'}\n`;
  
  report += `\n### 2. Hipótese Diagnóstica Provável\n`;
  report += `A análise dos dados da ficha sugere uma ferida com etiologia **${record.etiologia_ferida || 'Não especificada'}**. O estado atual da ferida deve ser avaliado pelo profissional de saúde com base nos dados coletados.\n\n`;

  report += `### 3. Plano de Tratamento Sugerido\n`;
  report += `${record.observacoes || "O plano de tratamento deve ser definido pelo profissional responsável com base na avaliação clínica completa."}\n\n`;
  
  report += `### 4. Fatores de Risco e Recomendações\n`;
  const riskFactors = [];
  if (record.dmi || record.dmii) riskFactors.push("Diabetes");
  if (record.has) riskFactors.push("Hipertensão");
  if (record.fumante) riskFactors.push("Tabagismo");
  if (riskFactors.length > 0) {
    report += `Fatores de risco identificados que podem impactar a cicatrização: ${riskFactors.join(', ')}. É crucial o controle dessas comorbidades.\n`;
  } else {
    report += `Nenhum fator de risco principal foi marcado na ficha. Recomenda-se manter um bom estado nutricional e hidratação.\n`;
  }

  return report;
};


export function ReportGenerator() {
  const [selectedAnamnesisId, setSelectedAnamnesisId] = useState<string>("");
  const [anamnesisRecords, setAnamnesisRecords] = useState<StoredAnamnesis[]>([]);
  const [report, setReport] = useState<{ report: string } | null>(null);
  const [aiPreview, setAiPreview] = useState<any | null>(null);
  const [visionResult, setVisionResult] = useState<null | { mask?: string; tissue?: string }>(null);
  const [aiPreview, setAiPreview] = useState<any | null>(null);
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
    if (!selectedRecord) {
      toast({
        title: "Seleção Necessária",
        description: "Por favor, selecione uma ficha de avaliação para gerar o relatório.",
        variant: "destructive",
      });
      return;
    }
     if (!selectedRecord.woundImageUri) {
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
      const staticReportContent = createStaticReport(selectedRecord);
      const result = { report: staticReportContent };
      setReport(result);
      
      if (user) {
        await addDoc(collection(db, "users", user.uid, "reports"), {
          anamnesisId: selectedAnamnesisId,
          patientName: selectedRecord.nome_cliente,
          reportContent: result.report,
          woundImageUri: selectedRecord.woundImageUri,
          professionalId: user.uid,
          patientId: selectedRecord.patientId || "", 
          createdAt: serverTimestamp(),
        });
        toast({ title: "Relatório Gerado e Salvo", description: "O relatório foi gerado com sucesso." });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar o relatório no banco de dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestAI = async () => {
    try {
      const risk = await getRisk({ demo: true });
      setAiPreview(risk);
      toast({ title: "Risco (mock)", description: `Infecção: ${risk.infection.level} (${Math.round(risk.infection.score * 100)}%)` });
    } catch (e) {
      toast({ title: "Falha ao consultar AI (mock)", variant: "destructive" });
    }
  };

  const handleVisionMock = async () => {
    if (!selectedRecord) return;
    try {
      setLoading(true);
      const { assessmentId } = await createAssessment(selectedRecord.id, { demo: true });
      const analysis = await getAnalysis(assessmentId);
      const tissue = analysis.tissueQuant.map((t) => `${t.class}: ${t.percent}%`).join(' | ');
      setVisionResult({ mask: analysis.segmentationMaskUri, tissue });
      toast({ title: "Análise de imagem (mock)", description: tissue });
    } catch (e) {
      toast({ title: "Falha na análise (mock)", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleTestAI = async () => {
    try {
      const risk = await getRisk({ demo: true });
      setAiPreview(risk);
      toast({ title: "Risco (mock)", description: `Infecção: ${risk.infection.level} (${Math.round(risk.infection.score * 100)}%)` });
    } catch (e) {
      toast({ title: "Falha ao consultar AI (mock)", variant: "destructive" });
    }
  };

 const handleSavePdf = async () => {
    if (!report || !selectedRecord || !selectedRecord.woundImageUri || !user) return;
    setPdfLoading(true);

    try {
        const doc_ = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const pageWidth = doc_.internal.pageSize.getWidth();
        
        const addFooter = () => {
            const pageCount = (doc_ as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc_.setPage(i);
                doc_.setFontSize(8);
                doc_.setTextColor(150);
                const footerText = `Gerado por Heal+ em ${new Date().toLocaleDateString('pt-BR')} | Página ${i} de ${pageCount}`;
                doc_.text(footerText, pageWidth / 2, doc_.internal.pageSize.getHeight() - 10, { align: 'center' });
            }
        };

        doc_.setFont('helvetica', 'bold');
        doc_.setFontSize(16);
        doc_.text("Relatório de Avaliação e Plano de Tratamento de Ferida", pageWidth / 2, 20, { align: 'center' });

        doc_.setFontSize(12);
        const evaluationDate = new Date(selectedRecord.data_consulta + 'T' + selectedRecord.hora_consulta);
        const formattedDate = evaluationDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        const formattedTime = evaluationDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        autoTable(doc_, {
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

        autoTable(doc_, {
            head: [['Anamnese']],
            body: anamnesisBody,
            theme: 'grid',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
            didDrawPage: () => addFooter(),
        });
        
        let finalY = (doc_ as any).lastAutoTable.finalY;

         if (doc_.internal.pageSize.getHeight() - finalY < 80) {
            doc_.addPage();
            finalY = margin;
        }

        doc_.setFont('helvetica', 'bold');
        doc_.setFontSize(12);
        doc_.text("Imagem da Ferida Analisada", margin, finalY + 10);
        
        const img = new (window as any).Image();
        img.src = selectedRecord.woundImageUri;
        await new Promise(resolve => { img.onload = resolve; });

        const imgProps = doc_.getImageProperties(selectedRecord.woundImageUri);
        const imgWidth = 80;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const imgX = (pageWidth - imgWidth) / 2;
        doc_.addImage(selectedRecord.woundImageUri, 'PNG', imgX, finalY + 15, imgWidth, imgHeight);
        finalY += imgHeight + 20;

        const cleanReportText = report.report.replace(/\*\*/g, '').replace(/###/g, '').replace(/##/g, '');
        autoTable(doc_, {
            startY: finalY + 5,
            head: [['Avaliação da Ferida']],
            body: [[cleanReportText]],
            theme: 'grid',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
            didDrawPage: () => addFooter(),
        });

        addFooter();

        const fileName = `Relatorio_${selectedRecord.nome_cliente.replace(/\s/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
        doc_.save(fileName);

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
        <div className="flex gap-2 flex-wrap">
        <Button type="submit" disabled={loading || !selectedRecord?.woundImageUri} className="w-full md:w-auto">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
          Gerar Relatório
        </Button>
        <Button type="button" variant="secondary" onClick={handleVisionMock} disabled={loading || !selectedRecord?.woundImageUri} className="w-full md:w-auto">
          Analisar Imagem (mock)
        </Button>
        </div>
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
            <div className="flex gap-2">
              <Button onClick={handleTestAI} variant="secondary" size="sm">Teste AI (mock)</Button>
              <Button onClick={handleSavePdf} disabled={pdfLoading} variant="outline" size="sm">
                {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                PDF
              </Button>
            </div>
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
            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">{report.report}</div>
            {visionResult && (
              <div className="mt-4 text-sm">
                <div className="font-semibold">Tecido (mock): {visionResult.tissue}</div>
              </div>
            )}
            {aiPreview && (
              <div className="mt-4 text-sm text-muted-foreground">
                <strong>AI (mock):</strong> Infecção {aiPreview.infection.level} • {Math.round(aiPreview.infection.score*100)}% | Prob. cicatrização 30d {Math.round(aiPreview.healing.probHeal30*100)}%
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
