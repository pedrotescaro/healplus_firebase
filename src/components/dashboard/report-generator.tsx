
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import { getRisk, createAssessment, getAnalysis, fhirPush, fhirPull } from "@/lib/api-client";

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
  const [maskOpacity, setMaskOpacity] = useState<number>(50);
  const [fhirStatus, setFhirStatus] = useState<string | null>(null);
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

      if (user) {
        // Store images directly as data URIs in Firestore
        await addDoc(collection(db, "users", user.uid, "assessments"), {
          anamnesisId: selectedAnamnesisId,
          woundId: selectedRecord.id,
          imageUri: selectedRecord.woundImageUri,
          analysis: { ...analysis, createdAt: serverTimestamp() },
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      toast({ title: "Falha na análise (mock)", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFhirPush = async () => {
    if (!selectedAnamnesisId) return;
    try {
      const resp = await fhirPush(selectedAnamnesisId);
      setFhirStatus(`PUSH: ${resp.status} (${resp.bundleId})`);
      toast({ title: "FHIR Push", description: `Status: ${resp.status}` });
      if (user) {
        await addDoc(collection(db, "users", user.uid, "fhirLogs"), {
          type: 'push', status: resp.status, bundleId: resp.bundleId, assessmentRef: selectedAnamnesisId, createdAt: serverTimestamp()
        });
      }
    } catch (e) {
      toast({ title: "FHIR Push falhou", variant: "destructive" });
    }
  };

  const handleFhirPull = async () => {
    if (!user) return;
    try {
      const resp = await fhirPull(user.uid);
      setFhirStatus(`PULL: ${resp.resources?.length || 0} recursos`);
      toast({ title: "FHIR Pull", description: `${resp.resources?.length || 0} recursos` });
      await addDoc(collection(db, "users", user.uid, "fhirLogs"), {
        type: 'pull', count: resp.resources?.length || 0, createdAt: serverTimestamp()
      });
    } catch (e) {
      toast({ title: "FHIR Pull falhou", variant: "destructive" });
    }
  };

 const handleSavePdf = async () => {
    if (!report || !selectedRecord || !user) return;
    setPdfLoading(true);

    try {
        const anamnesisDocRef = doc(db, "users", user.uid, "anamnesis", selectedRecord.id);
        const anamnesisSnap = await getDoc(anamnesisDocRef);
        if (!anamnesisSnap.exists()) {
          toast({ title: "Erro", description: "Ficha de anamnese associada não encontrada.", variant: "destructive" });
          setPdfLoading(false);
          return;
        }
        const anamnesisRecord = anamnesisSnap.data() as AnamnesisFormValues;

        const doc_ = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const pageWidth = doc_.internal.pageSize.getWidth();
        let finalY = margin;

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

        // Section 1: Identificação
        doc_.setFont('helvetica', 'bold');
        doc_.setFontSize(16);
        doc_.text("Terapia de Cicatrização - Cuidado Especializado em Feridas", pageWidth / 2, finalY, { align: 'center' });
        finalY += 10;
        
        autoTable(doc_, {
            startY: finalY,
            head: [['1. Identificação do Profissional']],
            body: [
                [`Profissional: ${anamnesisRecord.profissional_responsavel || user.name || 'Não informado'}`],
                [`COREN/CRM: ${anamnesisRecord.coren || 'Não informado'}`]
            ],
            theme: 'striped',
        });
        finalY = (doc_ as any).lastAutoTable.finalY + 5;
        
        // Section 2: Dados do Paciente
        const comorbidades = [
            anamnesisRecord.dmi && "DMI",
            anamnesisRecord.dmii && "DMII",
            anamnesisRecord.has && "HAS",
            anamnesisRecord.neoplasia && "Neoplasia",
            //... add all other comorbidities
        ].filter(Boolean).join(', ');

        autoTable(doc_, {
            startY: finalY,
            head: [['2. Dados do Paciente']],
            body: [
                [`Nome: ${anamnesisRecord.nome_cliente}`],
                [`Data de Nascimento: ${anamnesisRecord.data_nascimento}`],
                [`Comorbidades: ${comorbidades || 'Nenhuma informada'}`],
            ],
            theme: 'striped',
        });
        finalY = (doc_ as any).lastAutoTable.finalY + 5;
        
        // Section 3: Histórico da Lesão
        autoTable(doc_, {
            startY: finalY,
            head: [['3. Histórico da Lesão e Atendimento']],
            body: [
                [`Tipo de Lesão: ${anamnesisRecord.etiologia_ferida === 'Outra' ? anamnesisRecord.etiologia_outra : anamnesisRecord.etiologia_ferida}`],
                [`Tempo de Evolução: ${anamnesisRecord.tempo_evolucao}`],
                [`Data da Avaliação: ${new Date(anamnesisRecord.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`],
            ],
            theme: 'striped',
        });
        finalY = (doc_ as any).lastAutoTable.finalY + 5;

        // Section 4: Avaliação Inicial
         autoTable(doc_, {
            startY: finalY,
            head: [['4. Avaliação Inicial da Lesão']],
            body: [
                ['Tecido', `Granulação: ${anamnesisRecord.percentual_granulacao_leito}%, Epitelização: ${anamnesisRecord.percentual_epitelizacao_leito}%, Esfacelo: ${anamnesisRecord.percentual_esfacelo_leito}%, Necrose: ${anamnesisRecord.percentual_necrose_seca_leito}%`],
                ['Dimensões', `${anamnesisRecord.ferida_comprimento}cm x ${anamnesisRecord.ferida_largura}cm x ${anamnesisRecord.ferida_profundidade}cm`],
                ['Exsudato', `${anamnesisRecord.quantidade_exsudato}, ${anamnesisRecord.tipo_exsudato}`],
                ['Dor', `Escala ${anamnesisRecord.dor_escala}/10`],
            ],
            theme: 'grid',
        });
        finalY = (doc_ as any).lastAutoTable.finalY + 10;
        
        // Imagem
        if (anamnesisRecord.woundImageUri) {
          doc_.setFont('helvetica', 'bold');
          doc_.text("Imagem da Ferida", margin, finalY);
          finalY += 5;
          const img = new (window as any).Image();
          img.src = anamnesisRecord.woundImageUri;
          await new Promise(resolve => { img.onload = resolve; });
          const imgProps = doc_.getImageProperties(anamnesisRecord.woundImageUri);
          const imgWidth = 80;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
          doc_.addImage(anamnesisRecord.woundImageUri, 'PNG', (pageWidth - imgWidth) / 2, finalY, imgWidth, imgHeight);
          finalY += imgHeight + 5;
        }

        // Section 5: Conduta Terapêutica
        autoTable(doc_, {
            startY: finalY,
            head: [['5. Conduta Terapêutica e Plano de Cuidados']],
            body: [[anamnesisRecord.observacoes || 'Plano de cuidados a ser definido pelo profissional.']],
            theme: 'grid',
        });
        finalY = (doc_ as any).lastAutoTable.finalY + 5;

        // Section 9: Referências
        autoTable(doc_, {
            startY: finalY,
            head: [['Referências Bibliográficas']],
            body: [
                ['Borges, Eline Lima; Souza, Perla Oliveira Soares de. Feridas: como tratar – 3 ed. Rio de Janeiro: Rubio 2024. 61-88 p.'],
                ['Menoita,E; Seara, a.; Santos, V. Plano de Tratamento dirigido aos Sinais Clínicos da Infecção da Ferida, Journal of Aging & Inovation, 3 (2):62-73, 2014.'],
            ],
            theme: 'grid',
        });

        addFooter();
        const fileName = `Relatorio_${anamnesisRecord.nome_cliente.replace(/\s/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
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
        <Button type="button" variant="outline" onClick={handleFhirPush} className="w-full md:w-auto">Push FHIR (mock)</Button>
        <Button type="button" variant="outline" onClick={handleFhirPull} className="w-full md:w-auto">Pull FHIR (mock)</Button>
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
                       {visionResult?.mask && (
                          <img src={visionResult.mask} alt="Mask overlay" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: maskOpacity/100 }} />
                       )}
                   </div>
                   {visionResult?.mask && (
                      <div className="mt-2">
                        <Label>Opacidade da Máscara</Label>
                        <Slider defaultValue={[maskOpacity]} max={100} step={5} onValueChange={(v) => setMaskOpacity(v[0] ?? 50)} />
                      </div>
                   )}
               </div>
            )}
            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">{report.report}</div>
            {visionResult && (
              <div className="mt-4 text-sm">
                <div className="font-semibold">Tecido (mock): {visionResult.tissue}</div>
              </div>
            )}
            {fhirStatus && (
              <div className="mt-2 text-xs text-muted-foreground">{fhirStatus}</div>
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

