
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Eye, Edit, PlusCircle, Loader2, FilePlus, History } from "lucide-react";
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
import { collection, query, getDocs, orderBy, doc, deleteDoc } from "firebase/firestore";
import { AnamnesisDetailsView } from "@/components/dashboard/anamnesis-details-view";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

export default function AnamnesisRecordsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [anamneses, setAnamneses] = useState<StoredAnamnesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [recordToView, setRecordToView] = useState<StoredAnamnesis | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "users", user.uid, "anamnesis"), orderBy("data_consulta", "desc"));
        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredAnamnesis));
        setAnamneses(records);
      } catch (error) {
        console.error("Error fetching anamnesis records from Firestore: ", error);
        toast({ title: "Erro", description: "Não foi possível carregar as fichas dos pacientes.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecords();
    }
  }, [user, toast]);

  const handleDelete = async () => {
    if (!recordToDelete || !user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "anamnesis", recordToDelete));
      setAnamneses(anamneses.filter(record => record.id !== recordToDelete));
      toast({
        title: "Registro Excluído",
        description: "A ficha do paciente foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a ficha do paciente.",
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

  const handleNewEvaluation = (record: StoredAnamnesis) => {
    if (record.patientUniqueId) {
      router.push(`/dashboard/anamnesis?newEvaluation=${record.id}&patientId=${record.patientUniqueId}`);
    } else {
      toast({
        title: "Erro",
        description: "Não é possível criar nova avaliação para este paciente.",
        variant: "destructive",
      });
    }
  };

  const handleViewHistory = (record: StoredAnamnesis) => {
    if (record.patientUniqueId) {
      router.push(`/dashboard/patient-history?patientId=${record.patientUniqueId}`);
    } else {
      toast({
        title: "Erro",
        description: "Não é possível visualizar o histórico deste paciente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Pacientes</h1>
            <p className="text-muted-foreground">Visualize e gerencie todos os seus registros de pacientes.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Todos os Registros</CardTitle>
                <CardDescription>
                    Aqui estão todas as fichas de pacientes que você já criou, ordenadas pela data mais recente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-4 text-muted-foreground">Carregando fichas...</p>
                  </div>
                ) : anamneses.length > 0 ? (
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead>Paciente</TableHead>
                          <TableHead className="hidden sm:table-cell">Localização da Ferida</TableHead>
                          <TableHead className="hidden md:table-cell">Data da Consulta</TableHead>
                          <TableHead className="hidden lg:table-cell">Versão</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {anamneses.map((record) => (
                          <TableRow key={record.id}>
                              <TableCell className="font-medium">{record.nome_cliente}</TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge variant="outline">{record.localizacao_ferida}</Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(record.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <Badge variant="secondary">v{record.evaluationVersion || 1}</Badge>
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
                                    <DropdownMenuItem onSelect={() => setRecordToView(record)}>
                                        <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleEdit(record.id)}>
                                        <Edit className="mr-2 h-4 w-4" /> Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleNewEvaluation(record)}>
                                        <FilePlus className="mr-2 h-4 w-4" /> Nova Avaliação
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleViewHistory(record)}>
                                        <History className="mr-2 h-4 w-4" /> Ver Histórico
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
                    <p className="text-muted-foreground mb-4">Nenhuma ficha de paciente encontrada.</p>
                    <Link href="/dashboard/anamnesis" passHref>
                        <Button variant="outline">
                        <PlusCircle className="mr-2" />
                        Criar Primeira Ficha
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
                Esta ação não pode ser desfeita. Isso excluirá permanentemente a ficha do paciente.
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
                  <DialogTitle>Detalhes da Anamnese</DialogTitle>
                  <DialogDescription>
                  Paciente: {recordToView?.nome_cliente} | Data: {recordToView && new Date(recordToView.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
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
