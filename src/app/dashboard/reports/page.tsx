
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Eye, Loader2 } from "lucide-react";
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
import { collection, query, getDocs, orderBy, doc, deleteDoc, Timestamp } from "firebase/firestore";
import { useTranslation } from "@/contexts/app-provider";

interface StoredReport {
  id: string;
  patientName: string;
  reportContent: string;
  woundImageUri: string;
  anamnesisId: string;
  createdAt: Timestamp;
}

export default function ReportsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [reportToView, setReportToView] = useState<StoredReport | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "users", user.uid, "reports"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
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
    if (!reportToDelete || !user) return;
    try {
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
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setReportToView(report)}>
                              <Eye className="mr-2 h-4 w-4" /> {t.viewDetails}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setReportToDelete(report.id)} className="text-destructive focus:text-destructive">
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
          <DialogHeader>
            <DialogTitle>{t.reportDetailsTitle}</DialogTitle>
            <DialogDescription>
              {t.patient}: {reportToView?.patientName} | {t.date}: {reportToView && reportToView.createdAt.toDate().toLocaleDateString(t.locale, { timeZone: 'UTC' })}
            </DialogDescription>
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
