"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Eye, Edit, PlusCircle, Loader2, FilePlus, ArrowLeft, User, Calendar, Clock } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, doc, deleteDoc, where } from "firebase/firestore";
import { AnamnesisDetailsView } from "@/components/dashboard/anamnesis-details-view";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

export default function PatientHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<StoredAnamnesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [recordToView, setRecordToView] = useState<StoredAnamnesis | null>(null);
  const [patientInfo, setPatientInfo] = useState<{ name: string; uniqueId: string } | null>(null);

  const patientId = searchParams.get('patientId');

  useEffect(() => {
    const fetchPatientHistory = async () => {
      if (!user || !patientId) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "users", user.uid, "anamnesis"),
          where("patientUniqueId", "==", patientId),
          orderBy("evaluationVersion", "asc")
        );
        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredAnamnesis));
        setEvaluations(records);
        
        if (records.length > 0) {
          setPatientInfo({
            name: records[0].nome_cliente,
            uniqueId: patientId
          });
        }
      } catch (error) {
        console.error("Error fetching patient history from Firestore: ", error);
        toast({ title: "Erro", description: "Não foi possível carregar o histórico do paciente.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (user && patientId) {
      fetchPatientHistory();
    }
  }, [user, patientId, toast]);

  const handleDelete = async () => {
    if (!recordToDelete || !user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "anamnesis", recordToDelete));
      setEvaluations(evaluations.filter(record => record.id !== recordToDelete));
      toast({
        title: "Registro Excluído",
        description: "A avaliação foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a avaliação.",
        variant: "destructive",
      });
      console.error("Failed to delete evaluation from Firestore", error);
    } finally {
      setRecordToDelete(null);
    }
  };
  
  const handleEdit = (id: string) => {
    router.push(`/dashboard/anamnesis?edit=${id}`);
  };

  const handleNewEvaluation = () => {
    if (patientId && evaluations.length > 0) {
      router.push(`/dashboard/anamnesis?newEvaluation=${evaluations[0].id}&patientId=${patientId}`);
    }
  };

  const handleViewDetails = (record: StoredAnamnesis) => {
    setRecordToView(record);
  };

  if (!patientId) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">ID do paciente não fornecido.</p>
          <Link href="/dashboard/anamnesis-records">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Lista de Pacientes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/anamnesis-records">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {patientInfo?.name || "Histórico do Paciente"}
          </h1>
          <p className="text-muted-foreground">
            Histórico completo de avaliações do paciente
          </p>
        </div>
      </div>

      {patientInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{patientInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {evaluations.length} avaliação{evaluations.length !== 1 ? 'ões' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Última avaliação: {evaluations.length > 0 ? 
                    new Date(evaluations[evaluations.length - 1].data_consulta).toLocaleDateString('pt-BR') : 
                    'N/A'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Histórico de Avaliações</CardTitle>
              <CardDescription>
                Todas as avaliações realizadas para este paciente, ordenadas por versão.
              </CardDescription>
            </div>
            <Button onClick={handleNewEvaluation} disabled={evaluations.length === 0}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Avaliação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Carregando histórico...</p>
            </div>
          ) : evaluations.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Versão</TableHead>
                    <TableHead className="hidden sm:table-cell">Localização da Ferida</TableHead>
                    <TableHead className="hidden md:table-cell">Data da Consulta</TableHead>
                    <TableHead className="hidden lg:table-cell">Profissional</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        <Badge variant={record.evaluationVersion === 1 ? "default" : "secondary"}>
                          v{record.evaluationVersion || 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{record.localizacao_ferida}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(record.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {record.profissional_responsavel || 'N/A'}
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
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleViewDetails(record)}>
                              <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleEdit(record.id)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleNewEvaluation()}>
                              <FilePlus className="mr-2 h-4 w-4" /> Nova Avaliação
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setRecordToDelete(record.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
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
              <p className="text-muted-foreground mb-4">Nenhuma avaliação encontrada para este paciente.</p>
              <Link href="/dashboard/anamnesis" passHref>
                <Button variant="outline">
                  <PlusCircle className="mr-2" />
                  Criar Primeira Avaliação
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Dialog for Deletion */}
      <AlertDialog open={!!recordToDelete} onOpenChange={(open) => !open && setRecordToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente esta avaliação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog for Viewing Details */}
      <Dialog open={!!recordToView} onOpenChange={(open) => !open && setRecordToView(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Avaliação</DialogTitle>
            <DialogDescription>
              Paciente: {recordToView?.nome_cliente} | Versão: v{recordToView?.evaluationVersion || 1} | Data: {recordToView && new Date(recordToView.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1">
            {recordToView && <AnamnesisDetailsView record={recordToView} />}
          </ScrollArea>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
