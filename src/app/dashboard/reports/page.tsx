
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Eye, Loader2, FileDown, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, doc, deleteDoc, Timestamp, getDoc, where, collectionGroup } from "firebase/firestore";
import { useTranslation } from "@/contexts/app-provider";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import type { AnamnesisFormValues } from "@/lib/anamnesis-schema";

interface StoredReport {
  id: string;
  patientName: string;
  reportContent: string;
  woundImageUri: string;
  anamnesisId: string;
  patientId: string;
  professionalId: string;
  createdAt: Timestamp;
}

export default function ReportsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [reportToView, setReportToView] = useState<StoredReport | null>(null);
  const [currentReportForPdf, setCurrentReportForPdf] = useState<StoredReport | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        let reportsQuery;
        if (user.role === 'professional') {
          // Professional: Fetch reports they created from their own subcollection
          reportsQuery = query(collection(db, "users", user.uid, "reports"), orderBy("createdAt", "desc"));
        } else {
          // Patient: Fetch all reports where they are the patient
          reportsQuery = query(collectionGroup(db, "reports"), where("patientId", "==", user.uid));
        }
        
        const querySnapshot = await getDocs(reportsQuery);
        const fetchedReports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredReport));
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports from Firestore: ", error);
        toast({ title: t.errorTitle, description: t.myReportsErrorLoading, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReports();
    }
  }, [user, toast, t]);

  const handleDelete = async () => {
    if (!reportToDelete || !user || user.role !== 'professional') return;
    try {
      // Professionals delete from their own subcollection
      await deleteDoc(doc(db, "users", user.uid, "reports", reportToDelete));
      setReports(reports.filter(report => report.id !== reportToDelete));
      toast({
        title: t.deleteReportTitle,
        description: t.deleteReportDescription,
      });
    } catch (error) {
      toast({
        title: t.errorTitle,
        description: t.deleteReportError,
        variant: "destructive",
      });
      console.error("Failed to delete report from Firestore", error);
    } finally {
      setReportToDelete(null);
    }
  };

  const handleStartChat = (contactId: string) => {
    const queryParam = user?.role === 'professional' ? 'patientId' : 'professionalId';
    router.push(`/dashboard/chat?${queryParam}=${contactId}`);
  };

  const handleSavePdf = async (report: StoredReport | null) => {
    if (!report || !user) return;
    setCurrentReportForPdf(report); // Track which report is generating PDF
    setPdfLoading(true);

    try {
        // The anamnesis record is stored by the professional who created it
        const anamnesisDocRef = doc(db, "users", report.professionalId, "anamnesis", report.anamnesisId);
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
        const evaluationDate = new Date(anamnesisRecord.data_consulta + 'T' + anamnesisRecord.hora_consulta);
        const formattedDate = evaluationDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        const formattedTime = evaluationDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        autoTable(doc_, {
            startY: 30,
            head: [['Identificação do Paciente']],
            body: [
                [{ content: `Paciente: ${anamnesisRecord.nome_cliente}`, styles: { fontStyle: 'bold' } }],
                [`Data da Avaliação: ${formattedDate}, ${formattedTime}`],
            ],
            theme: 'striped',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
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
        img.src = report.woundImageUri;
        await new Promise(resolve => { img.onload = resolve; });

        const imgProps = doc_.getImageProperties(report.woundImageUri);
        const imgWidth = 80;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const imgX = (pageWidth - imgWidth) / 2;
        doc_.addImage(report.woundImageUri, 'PNG', imgX, finalY + 15, imgWidth, imgHeight);
        finalY += imgHeight + 20;

        const cleanReportText = report.reportContent.replace(/\*\*/g, '');
        autoTable(doc_, {
            startY: finalY + 5,
            head: [['Avaliação da Ferida (Análise por IA)']],
            body: [[cleanReportText]],
            theme: 'grid',
            headStyles: { fontStyle: 'bold', fillColor: [22, 160, 133] },
            didDrawPage: () => addFooter(),
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
        setCurrentReportForPdf(null);
    }
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.myReportsTitle}</h1>
        <p className="text-muted-foreground">{t.myReportsDescription}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t.allReportsTitle}</CardTitle>
          <CardDescription>
            {t.allReportsDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">{t.loadingReports}</p>
            </div>
          ) : reports.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.patient}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t.reportDate}</TableHead>
                    <TableHead className="text-right">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.patientName}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {report.createdAt.toDate().toLocaleDateString(t.locale, { timeZone: 'UTC' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" disabled={pdfLoading && currentReportForPdf?.id === report.id}>
                               {pdfLoading && currentReportForPdf?.id === report.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                               <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setReportToView(report)}>
                              <Eye className="mr-2 h-4 w-4" /> {t.viewDetails}
                            </DropdownMenuItem>
                             <DropdownMenuItem onSelect={() => handleSavePdf(report)}>
                              <FileDown className="mr-2 h-4 w-4" /> Salvar em PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStartChat(user?.role === 'professional' ? report.patientId : report.professionalId)}>
                              <MessageSquare className="mr-2 h-4 w-4" /> Conversar
                            </DropdownMenuItem>
                            {user?.role === 'professional' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => setReportToDelete(report.id)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> {t.delete}
                                </DropdownMenuItem>
                              </>
                             )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{t.noReportsFound}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.areYouSure}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteReportConfirmation}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!reportToView} onOpenChange={(open) => !open && setReportToView(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="flex flex-row items-center justify-between pr-8">
            <div className="space-y-1.5">
                <DialogTitle>{t.reportDetailsTitle}</DialogTitle>
                <DialogDescription>
                  {t.patient}: {reportToView?.patientName} | {t.date}: {reportToView && reportToView.createdAt.toDate().toLocaleDateString(t.locale, { timeZone: 'UTC' })}
                </DialogDescription>
            </div>
            <Button onClick={() => handleSavePdf(reportToView)} disabled={pdfLoading} variant="outline" size="sm">
              {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Salvar em PDF
            </Button>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-4 border rounded-md">
            {reportToView && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-center">{t.analyzedImage}</h3>
                  <div className="relative w-full max-w-sm mx-auto aspect-square">
                    {reportToView.woundImageUri && (
                        <Image
                        src={reportToView.woundImageUri}
                        alt={`Wound for ${reportToView.patientName}`}
                        layout="fill"
                        className="rounded-md object-contain"
                        data-ai-hint="wound"
                        />
                    )}
                  </div>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                  {reportToView.reportContent}
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t.close}
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
