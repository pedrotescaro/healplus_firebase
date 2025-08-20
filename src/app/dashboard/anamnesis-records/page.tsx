
"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Eye, Edit, PlusCircle, Loader2 } from "lucide-react";
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
import { collection, query, onSnapshot, doc, deleteDoc, orderBy } from "firebase/firestore";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

export default function AnamnesisRecordsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [anamneses, setAnamneses] = useState<StoredAnamnesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [recordToView, setRecordToView] = useState<StoredAnamnesis | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, `users/${user.uid}/anamnesis`), orderBy("data_consulta", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records: StoredAnamnesis[] = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() } as StoredAnamnesis);
      });
      setAnamneses(records);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching anamnesis records: ", error);
      toast({ title: "Erro", description: "Não foi possível carregar as fichas.", variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleDelete = async () => {
    if (!recordToDelete || !user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/anamnesis`, recordToDelete));
      toast({
        title: "Registro Excluído",
        description: "A ficha de anamnese foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a ficha de anamnese.",
        variant: "destructive",
      });
      console.error("Failed to delete anamnesis record", error);
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
            <h1 className="text-3xl font-bold tracking-tight">Minhas Fichas de Anamnese</h1>
            <p className="text-muted-foreground">Visualize e gerencie todos os seus registros de pacientes.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Todos os Registros</CardTitle>
                <CardDescription>
                    Aqui estão todas as fichas de anamnese que você já criou, ordenadas pela data mais recente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-4 text-muted-foreground">Carregando fichas...</p>
                  </div>
                ) : anamneses.length > 0 ? (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Localização da Ferida</TableHead>
                        <TableHead>Data da Consulta</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {anamneses.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.nome_cliente}</TableCell>
                            <TableCell>
                            <Badge variant="outline">{record.localizacao_ferida}</Badge>
                            </TableCell>
                            <TableCell>
                            {new Date(record.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
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
                ) : (
                    <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Nenhuma ficha de anamnese encontrada.</p>
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
                Esta ação não pode ser desfeita. Isso excluirá permanentemente a ficha de anamnese do paciente.
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
            <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Detalhes da Anamnese</DialogTitle>
                <DialogDescription>
                Paciente: {recordToView?.nome_cliente} | Data: {recordToView && new Date(recordToView.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-4 border rounded-md">
                {recordToView && (
                <div className="space-y-4 text-sm">
                    {Object.entries(recordToView).map(([key, value]) => {
                    if (typeof value === 'boolean' || (value && typeof value !== 'object')) {
                        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        const formattedValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value);
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
                    Fechar
                </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    