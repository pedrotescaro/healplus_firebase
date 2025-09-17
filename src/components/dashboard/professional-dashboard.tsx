
"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ClipboardList, PlusCircle, MoreHorizontal, Trash2, Eye, Edit, Loader2, CalendarDays, Users, CopyCheck, MessageSquare, TrendingUp, BarChart3, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { AnamnesisFormValues } from "@/lib/anamnesis-schema";
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
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, limit, doc, deleteDoc } from "firebase/firestore";
import { ActivitySummaryChart } from "@/components/dashboard/activity-summary-chart";
import { useTranslation } from "@/contexts/app-provider";
import { AnamnesisDetailsView } from "@/components/dashboard/anamnesis-details-view";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

export function ProfessionalDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [recentAnamneses, setRecentAnamneses] = useState<StoredAnamnesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [recordToView, setRecordToView] = useState<StoredAnamnesis | null>(null);
  const [activityData, setActivityData] = useState<{ name: string; value: number }[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    totalEvaluations: 0,
    totalReports: 0,
    totalComparisons: 0,
    pendingEvaluations: 0,
    thisMonthEvaluations: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // Fetch recent records
        const recentQuery = query(
          collection(db, "users", user.uid, "anamnesis"),
          orderBy("data_consulta", "desc"),
          limit(5)
        );
        const recentSnapshot = await getDocs(recentQuery);
        const records = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredAnamnesis));
        setRecentAnamneses(records);

        // Fetch activity counts
        const [anamnesisSnapshot, reportsSnapshot, comparisonsSnapshot] = await Promise.all([
          getDocs(collection(db, "users", user.uid, "anamnesis")),
          getDocs(collection(db, "users", user.uid, "reports")),
          getDocs(collection(db, "users", user.uid, "comparisons")),
        ]);

        const anamnesisCount = anamnesisSnapshot.size;
        const reportsCount = reportsSnapshot.size;
        const comparisonsCount = comparisonsSnapshot.size;

        // Usar dados já carregados para estatísticas
        const allAnamnesis = anamnesisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredAnamnesis));
        
        // Contar pacientes únicos
        const uniquePatients = new Set(allAnamnesis.map(record => record.nome_cliente)).size;
        
        // Contar avaliações deste mês
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthEvaluations = allAnamnesis.filter(record => {
          const recordDate = new Date(record.data_consulta);
          return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
        }).length;

        setActivityData([
            { name: "completedForms", value: anamnesisCount },
            { name: "generatedReports", value: reportsCount },
            { name: "comparisons", value: comparisonsCount },
        ]);

        setDashboardStats({
          totalPatients: uniquePatients,
          totalEvaluations: anamnesisCount,
          totalReports: reportsCount,
          totalComparisons: comparisonsCount,
          pendingEvaluations: 0, // Pode ser implementado futuramente
          thisMonthEvaluations: thisMonthEvaluations
        });

      } catch (error) {
        console.error("Error fetching dashboard data from Firestore: ", error);
        toast({ title: t.errorTitle, description: t.dashboardErrorLoading, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user, toast, t]);

  const handleDelete = async () => {
    if (!recordToDelete || !user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "anamnesis", recordToDelete));
      setRecentAnamneses(recentAnamneses.filter(record => record.id !== recordToDelete));
      toast({
        title: t.deleteRecordTitle,
        description: t.deleteRecordDescription,
      });
    } catch (error) {
      toast({
        title: t.errorTitle,
        description: t.deleteRecordError,
        variant: "destructive",
      });
      console.error("Failed to delete anamnesis record from Firestore", error);
    } finally {
      setRecordToDelete(null);
    }
  };
  
  const handleEdit = (id: string) => {
    router.push(`/dashboard/anamnesis?edit=${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Dashboard Profissional</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Gerencie suas avaliações, relatórios e pacientes em um só lugar.</p>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <Users className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{dashboardStats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">Pacientes Atendidos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <ClipboardList className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{dashboardStats.totalEvaluations}</div>
              <p className="text-xs text-muted-foreground">Avaliações Realizadas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <FileText className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{dashboardStats.totalReports}</div>
              <p className="text-xs text-muted-foreground">Relatórios Gerados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <CopyCheck className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{dashboardStats.totalComparisons}</div>
              <p className="text-xs text-muted-foreground">Comparações Realizadas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{dashboardStats.thisMonthEvaluations}</div>
              <p className="text-xs text-muted-foreground">Este Mês</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">
                {dashboardStats.totalEvaluations > 0 ? Math.round((dashboardStats.totalReports / dashboardStats.totalEvaluations) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Taxa de Relatórios</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              {t.newAnamnesisCardTitle}
            </CardTitle>
            <CardDescription>
              {t.newAnamnesisCardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/anamnesis" passHref>
              <Button className="w-full">{t.createForm}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t.generateReportCardTitle}
            </CardTitle>
            <CardDescription>
              {t.generateReportCardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/report" passHref>
              <Button className="w-full">{t.createReport}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CopyCheck className="h-5 w-5 text-primary" />
              {t.compareReportsCardTitle}
            </CardTitle>
            <CardDescription>
              {t.compareReportsCardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/compare-reports" passHref>
              <Button className="w-full">{t.compareReportsBtn}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t.recentAnamnesisTitle}</CardTitle>
            <CardDescription>
              {t.recentAnamnesisDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-4 text-muted-foreground">{t.loadingRecords}</p>
                </div>
              ) : recentAnamneses.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.patient}</TableHead>
                      <TableHead className="hidden sm:table-cell">{t.woundLocation}</TableHead>
                      <TableHead className="hidden md:table-cell">{t.consultationDate}</TableHead>
                      <TableHead className="text-right">{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAnamneses.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.nome_cliente}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">{record.localizacao_ferida}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(record.data_consulta).toLocaleDateString(t.locale, { timeZone: 'UTC' })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => setRecordToView(record)}>
                                <Eye className="mr-2 h-4 w-4" /> {t.viewDetails}
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleEdit(record.id)}>
                                <Edit className="mr-2 h-4 w-4" /> {t.edit}
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setRecordToDelete(record.id)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> {t.delete}
                              </DropdownMenuItem>
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
                <p className="text-muted-foreground mb-4">{t.noRecordsFound}</p>
                <Link href="/dashboard/anamnesis" passHref>
                  <Button variant="outline">
                    <PlusCircle className="mr-2" />
                    {t.createFirstRecord}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
          { recentAnamneses.length > 0 && (
            <CardFooter>
              <Link href="/dashboard/anamnesis-records" className="w-full">
                <Button variant="secondary" className="w-full">{t.viewAllRecords}</Button>
              </Link>
            </CardFooter>
          )}
        </Card>

        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Resumo das Atividades
                </CardTitle>
                <CardDescription>
                  Sua atividade recente na plataforma
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                  <div className="space-y-4">
                    {/* Estatísticas Resumidas */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium">Fichas Concluídas</p>
                            <p className="text-sm text-muted-foreground">Forms Completed</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-primary">{dashboardStats.totalEvaluations}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/5 to-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-medium">Relatórios Gerados</p>
                            <p className="text-sm text-muted-foreground">Reports Generated</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{dashboardStats.totalReports}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/5 to-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-3">
                          <CopyCheck className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="font-medium">Comparações</p>
                            <p className="text-sm text-muted-foreground">Comparisons</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">{dashboardStats.totalComparisons}</div>
                      </div>
                    </div>
                    
                    {/* Gráfico de Atividade */}
                    <div className="pt-4">
                      <ActivitySummaryChart data={activityData} />
                    </div>
                  </div>
                )}
            </CardContent>
        </Card>
      </div>

      {/* Atividade Recente Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Atividade Recente
          </CardTitle>
          <CardDescription>
            Acompanhe suas últimas ações e progresso na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Resumo Semanal */}
            <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {dashboardStats.thisMonthEvaluations}
              </div>
              <p className="text-sm text-muted-foreground">Avaliações este mês</p>
              <p className="text-xs text-muted-foreground mt-1">
                {dashboardStats.totalEvaluations > 0 
                  ? `${Math.round((dashboardStats.thisMonthEvaluations / dashboardStats.totalEvaluations) * 100)}% do total`
                  : '0% do total'
                }
              </p>
            </div>

            {/* Eficiência */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-lg border border-blue-500/20">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {dashboardStats.totalEvaluations > 0 
                  ? Math.round((dashboardStats.totalReports / dashboardStats.totalEvaluations) * 100) 
                  : 0
                }%
              </div>
              <p className="text-sm text-muted-foreground">Taxa de relatórios</p>
              <p className="text-xs text-muted-foreground mt-1">
                {dashboardStats.totalReports} de {dashboardStats.totalEvaluations} avaliações
              </p>
            </div>

            {/* Pacientes Únicos */}
            <div className="text-center p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-lg border border-green-500/20">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {dashboardStats.totalPatients}
              </div>
              <p className="text-sm text-muted-foreground">Pacientes únicos</p>
              <p className="text-xs text-muted-foreground mt-1">
                {dashboardStats.totalEvaluations > 0 
                  ? `${Math.round(dashboardStats.totalEvaluations / dashboardStats.totalPatients)} avaliações/paciente`
                  : '0 avaliações/paciente'
                }
              </p>
            </div>

            {/* Comparações */}
            <div className="text-center p-4 bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-lg border border-purple-500/20">
              <CopyCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {dashboardStats.totalComparisons}
              </div>
              <p className="text-sm text-muted-foreground">Comparações realizadas</p>
              <p className="text-xs text-muted-foreground mt-1">
                Análises de progressão com IA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Dialog for Deletion */}
      <AlertDialog open={!!recordToDelete} onOpenChange={(open) => !open && setRecordToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.areYouSure}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteConfirmation}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog for Viewing Details */}
      <Dialog open={!!recordToView} onOpenChange={(open) => !open && setRecordToView(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t.anamnesisDetailsTitle}</DialogTitle>
            <DialogDescription>
              {t.patient}: {recordToView?.nome_cliente} | {t.date}: {recordToView && new Date(recordToView.data_consulta).toLocaleDateString(t.locale, { timeZone: 'UTC' })}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1">
             {recordToView && <AnamnesisDetailsView record={recordToView} />}
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
