
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, where, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import type { AnamnesisFormValues } from "@/lib/anamnesis-schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CalendarCheck, User, Bell, Plus, Clock, AlertTriangle, CheckCircle, XCircle, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { add, format, isAfter, isSameDay, startOfToday, differenceInDays, isToday, isTomorrow, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

type Appointment = {
  id: string;
  date: Date;
  patientName: string;
  woundLocation: string;
  status?: 'agendado' | 'confirmado' | 'realizado' | 'cancelado' | 'reagendado';
  priority?: 'baixa' | 'media' | 'alta' | 'urgente';
  notes?: string;
  reminderSent?: boolean;
  patientPhone?: string;
  patientEmail?: string;
  address?: string;
  anamnesisId?: string;
};

export function AgendaView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    status: 'agendado',
    priority: 'media'
  });

  // Função para adicionar novo agendamento
  const handleAddAppointment = async () => {
    if (!user || !newAppointment.date || !newAppointment.patientName) {
      toast({
        title: "Dados Incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const appointmentData = {
        ...newAppointment,
        date: newAppointment.date,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "users", user.uid, "appointments"), appointmentData);
      
      const newAppointmentWithId: Appointment = {
        id: docRef.id,
        date: newAppointment.date!,
        patientName: newAppointment.patientName!,
        woundLocation: newAppointment.woundLocation || '',
        status: newAppointment.status || 'agendado',
        priority: newAppointment.priority || 'media',
        notes: newAppointment.notes,
        patientPhone: newAppointment.patientPhone,
        patientEmail: newAppointment.patientEmail,
        address: newAppointment.address,
        anamnesisId: newAppointment.anamnesisId
      };

      setAppointments((prev: any) => [...prev, newAppointmentWithId].sort((a, b) => a.date.getTime() - b.date.getTime()));
      
      setNewAppointment({
        status: 'agendado',
        priority: 'media'
      });
      setShowAddDialog(false);
      
      toast({
        title: "Agendamento Criado",
        description: "O agendamento foi criado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o agendamento. Verifique sua conexão e tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Função para atualizar status do agendamento
  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    if (!user) return;

    try {
      // Verificar se é um agendamento de anamnese (que não pode ser atualizado)
      if (appointmentId.startsWith('anamnesis-')) {
        toast({
          title: "Ação Não Permitida",
          description: "Agendamentos de anamnese não podem ter status alterado. Crie um agendamento personalizado para gerenciar o status.",
          variant: "destructive"
        });
        return;
      }

      // Atualizar apenas agendamentos personalizados
      await updateDoc(doc(db, "users", user.uid, "appointments", appointmentId), {
        status,
        updatedAt: serverTimestamp()
      });

      setAppointments((prev: any) => prev.map((app: any) => 
        app.id === appointmentId ? { ...app, status } : app
      ));

      toast({
        title: "Status Atualizado",
        description: `Status do agendamento alterado para ${status}.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // Buscar agendamentos de anamnese
        const today = format(new Date(), 'yyyy-M-d');
        const anamnesisQuery = query(
          collection(db, "users", user.uid, "anamnesis"),
          where("data_retorno", ">=", today),
          orderBy("data_retorno", "asc")
        );
        const anamnesisSnapshot = await getDocs(anamnesisQuery);
        const anamnesisRecords = anamnesisSnapshot.docs
          .map((doc: any) => ({ id: doc.id, ...doc.data() } as StoredAnamnesis))
          .filter((record: any) => record.data_retorno);

        const anamnesisAppointments = anamnesisRecords.map((record: any) => {
            const [year, month, day] = record.data_retorno!.split('-').map(Number);
            const returnDate = new Date(Date.UTC(year, month - 1, day));
            return ({
                id: `anamnesis-${record.id}`,
                date: returnDate,
                patientName: record.nome_cliente,
                woundLocation: record.localizacao_ferida,
                status: 'agendado' as const,
                priority: 'media' as const,
                anamnesisId: record.id
            })
        });

        // Buscar agendamentos personalizados
        const appointmentsQuery = query(
          collection(db, "users", user.uid, "appointments"),
          orderBy("date", "asc")
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const customAppointments = appointmentsSnapshot.docs.map((doc: any) => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.date.toDate(),
            patientName: data.patientName,
            woundLocation: data.woundLocation || '',
            status: data.status || 'agendado',
            priority: data.priority || 'media',
            notes: data.notes,
            patientPhone: data.patientPhone,
            patientEmail: data.patientEmail,
            address: data.address
          } as Appointment;
        });

        // Combinar e ordenar todos os agendamentos
        const allAppointments = [...anamnesisAppointments, ...customAppointments]
          .sort((a, b) => a.date.getTime() - b.date.getTime());
        
        setAppointments(allAppointments);
      } catch (error) {
        console.error("Error fetching appointments from Firestore: ", error);
        toast({ title: "Erro", description: "Não foi possível carregar os agendamentos.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user, toast]);

  const appointmentsForSelectedDay = appointments.filter(
    (app: any) => selectedDate && isSameDay(app.date, selectedDate)
  );
  
  const appointmentDates = appointments.map(app => app.date);

  const upcomingAppointments = appointments
    .filter((app: any) => isAfter(app.date, startOfToday()) || isSameDay(app.date, startOfToday()))
    .slice(0, 7);

  const urgentAppointments = appointments.filter((app: any) => 
    app.priority === 'urgente' && (isToday(app.date) || isTomorrow(app.date))
  );

  const overdueAppointments = appointments.filter((app: any) => 
    isPast(app.date) && app.status === 'agendado'
  );


  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmado': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'realizado': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'cancelado': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'reagendado': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Appointment['priority']) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800 border-green-200';
      case 'realizado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Carregando agenda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas e Notificações Melhorados */}
      {(urgentAppointments.length > 0 || overdueAppointments.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {urgentAppointments.length > 0 && (
            <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-lg shadow-red-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  Consultas Urgentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-red-700">
                    {urgentAppointments.length} consulta(s) urgente(s) para hoje ou amanhã
                  </p>
                  <div className="text-2xl font-bold text-red-600">
                    {urgentAppointments.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {overdueAppointments.length > 0 && (
            <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-lg shadow-yellow-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  Consultas Atrasadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-yellow-700">
                    {overdueAppointments.length} consulta(s) em atraso
                  </p>
                  <div className="text-2xl font-bold text-yellow-600">
                    {overdueAppointments.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card className="shadow-lg border-border/50">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary rounded-lg">
                  <Clock className="h-5 w-5 text-primary-foreground" />
                </div>
                Calendário
              </CardTitle>
              <CardDescription>Selecione uma data para ver os agendamentos do dia</CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                  <DialogTitle className="flex items-center gap-2">
                    <div className="p-2 bg-primary rounded-lg">
                      <Plus className="h-5 w-5 text-primary-foreground" />
                    </div>
                    Novo Agendamento
                  </DialogTitle>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patientName">Nome do Paciente *</Label>
                    <Input
                      id="patientName"
                      value={newAppointment.patientName || ''}
                      onChange={(e: any) => setNewAppointment((prev: any) => ({ ...prev, patientName: e.target.value }))}
                      placeholder="Nome completo do paciente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Data e Hora *</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={newAppointment.date ? format(newAppointment.date, "yyyy-MM-dd'T'HH:mm") : ''}
                      onChange={(e: any) => setNewAppointment((prev: any) => ({ ...prev, date: new Date(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="woundLocation">Localização da Ferida</Label>
                    <Input
                      id="woundLocation"
                      value={newAppointment.woundLocation || ''}
                      onChange={(e: any) => setNewAppointment((prev: any) => ({ ...prev, woundLocation: e.target.value }))}
                      placeholder="Ex: Pé direito, região sacral"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select value={newAppointment.priority} onValueChange={(value: any) => setNewAppointment((prev: any) => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={newAppointment.status} onValueChange={(value: any) => setNewAppointment((prev: any) => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agendado">Agendado</SelectItem>
                          <SelectItem value="confirmado">Confirmado</SelectItem>
                          <SelectItem value="realizado">Realizado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={newAppointment.notes || ''}
                      onChange={(e: any) => setNewAppointment((prev: any) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações adicionais..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleAddAppointment} 
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
                    >
                      Criar Agendamento
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                      className="hover:bg-muted/50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-6">
             <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border p-0 w-full"
              locale={ptBR}
              modifiers={{
                hasAppointment: appointmentDates,
              }}
              modifiersStyles={{
                hasAppointment: {
                  position: 'relative',
                  overflow: 'visible',
                },
              }}
              components={{
                DayContent: (props) => {
                  const hasAppointment = appointmentDates.some(d => isSameDay(d, props.date));
                  return (
                    <div className="relative">
                      {props.date.getDate()}
                      {hasAppointment && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary"></div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-gradient-to-r from-blue-500/5 via-blue-500/3 to-transparent border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                Agendamentos do Dia
              </CardTitle>
              <CardDescription>
                {selectedDate ? format(selectedDate, "'Pacientes para' dd 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {appointmentsForSelectedDay.length > 0 ? (
                  <ul className="space-y-3">
                    {appointmentsForSelectedDay.map((app: any) => (
                      <li key={app.id} className="flex items-start gap-3 p-4 border border-border/50 rounded-xl bg-gradient-to-r from-background to-muted/20 hover:shadow-md transition-all duration-300">
                        <div className="flex-shrink-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-3 rounded-xl shadow-md">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold truncate text-lg">{app.patientName}</p>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(app.status)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{app.woundLocation}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <p className="text-sm font-medium text-primary">
                              {format(app.date, "HH:mm")}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getPriorityColor(app.priority)}`}>
                              {app.priority}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                          {app.notes && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-muted/30 p-2 rounded-md">
                              {app.notes}
                            </p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(app.id, 'confirmado')}
                              disabled={app.status === 'confirmado' || app.status === 'realizado' || app.id.startsWith('anamnesis-')}
                              className="hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
                            >
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(app.id, 'realizado')}
                              disabled={app.status === 'realizado' || app.id.startsWith('anamnesis-')}
                              className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                            >
                              Realizado
                            </Button>
                            {app.id.startsWith('anamnesis-') && (
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Agendamento de anamnese
                              </span>
                            )}
                          </div>
                        </div>
                    </li>
                  ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center pt-8">Nenhum agendamento para este dia.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-gradient-to-r from-green-500/5 via-green-500/3 to-transparent border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CalendarCheck className="h-5 w-5 text-white" />
                </div>
                Próximos 7 Agendamentos
              </CardTitle>
              <CardDescription>Visão geral dos seus próximos agendamentos.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {upcomingAppointments.length > 0 ? (
                  <ul className="space-y-3">
                    {upcomingAppointments.map((app: any) => (
                      <li key={app.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-xl bg-gradient-to-r from-background to-muted/20 hover:shadow-md transition-all duration-300">
                        <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-xl shadow-md">
                          <CalendarCheck className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold truncate text-base">{app.patientName}</p>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(app.status)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">
                              {format(app.date, "dd/MM/yyyy 'às' HH:mm")}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {app.woundLocation}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border shadow-sm ${getPriorityColor(app.priority)}`}>
                              {app.priority}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                    </li>
                  ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center pt-20">Nenhum agendamento futuro.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
