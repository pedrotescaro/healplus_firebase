
"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GitCompareArrows, ClipboardList, PlusCircle, MoreHorizontal, Trash2, Eye, Edit, Loader2 } from "lucide-react";
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
import { collection, query, getDocs, orderBy, limit, doc, deleteDoc,getCountFromServer } from "firebase/firestore";
import { ActivitySummaryChart } from "@/components/dashboard/activity-summary-chart";
import { useTranslation } from "@/contexts/app-provider";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [recentAnamneses, setRecentAnamneses] = useState<StoredAnamnesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [recordToView, setRecordToView] = useState<StoredAnamnesis | null>(null);
  const [activityData, setActivityData] = useState<{ name: string; value: number; label: string }[]>([]);

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
        const anamnesisCol = collection(db, "users", user.uid, "anamnesis");
        const anamnesisCountSnapshot = await getCountFromServer(anamnesisCol);
        const anamnesisCount = anamnesisCountSnapshot.data().count;

        // Mocking other counts as they are not stored yet
        const reportsCount = Math.floor(anamnesisCount * 0.75);
        const comparisonsCount = Math.floor(anamnesisCount * 0.5);

        setActivityData([
            { name: "completedForms", label: t.activityChartCompletedForms, value: anamnesisCount },
            { name: "generatedReports", label: t.activityChartGeneratedReports, value: reportsCount },
            { name: "comparisons", label: t.activityChartComparisons, value: comparisonsCount },
        ]);

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.welcomeMessage.replace('{name}', user?.name || '')}</h1>
        <p className="text-muted-foreground">{t.dashboardGreeting}</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <GitCompareArrows className="h-5 w-5 text-primary" />
              {t.compareImagesCardTitle}
            </CardTitle>
            <CardDescription>
              {t.compareImagesCardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/compare" passHref>
              <Button className="w-full">{t.compareImagesBtn}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
                <CardTitle>{t.activitySummaryTitle}</CardTitle>
                <CardDescription>
                    {t.activitySummaryDescription}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ActivitySummaryChart data={activityData} />
                )}
            </CardContent>
        </Card>
      </div>


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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.anamnesisDetailsTitle}</DialogTitle>
            <DialogDescription>
              {t.patient}: {recordToView?.nome_cliente} | {t.date}: {recordToView && new Date(recordToView.data_consulta).toLocaleDateString(t.locale, { timeZone: 'UTC' })}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-4 border rounded-md">
            {recordToView && (
              <div className="space-y-4 text-sm">
                {Object.entries(recordToView).map(([key, value]) => {
                  if (typeof value === 'boolean' || (value && typeof value !== 'object')) {
                    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const formattedValue = typeof value === 'boolean' ? (value ? t.yes : t.no) : String(value);
                    return (
                      <div key={key} className="grid grid-cols-2 gap-2">
                        <strong className="text-muted-foreground">{formattedKey}:</strong>
                        <span>{formattedValue}</span>
                      </div>
                    );
                  }
                  return null;
                })}
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
