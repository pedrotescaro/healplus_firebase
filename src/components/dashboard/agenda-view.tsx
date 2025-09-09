
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, where, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import type { AnamnesisFormValues } from "@/lib/anamnesis-schema";
import { Calendar } from "@/components/ui/calendar";
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

type SmartReminder = {
  id: string;
  appointmentId: string;
  type: 'email' | 'sms' | 'push';
  scheduledFor: Date;
  sent: boolean;
  message: string;
};

export function AgendaView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    status: 'agendado',
    priority: 'media'
  });

  // Função para criar lembretes inteligentes
  const createSmartReminders = async (appointment: Appointment) => {
    if (!user) return;

    const reminders: Omit<SmartReminder, 'id'>[] = [];
    const daysUntilAppointment = differenceInDays(appointment.date, new Date());

    // Lembrete 3 dias antes
    if (daysUntilAppointment >= 3) {
      reminders.push({
        appointmentId: appointment.id,
        type: 'email',
        scheduledFor: add(appointment.date, { days: -3 }),
        sent: false,
        message: `Lembrete: Consulta com ${appointment.patientName} em 3 dias (${format(appointment.date, 'dd/MM/yyyy')})`
      });
    }

    // Lembrete 1 dia antes
    if (daysUntilAppointment >= 1) {
      reminders.push({
        appointmentId: appointment.id,
        type: 'sms',
        scheduledFor: add(appointment.date, { days: -1 }),
        sent: false,
        message: `Lembrete: Consulta com ${appointment.patientName} amanhã às ${format(appointment.date, 'HH:mm')}`
      });
    }

    // Lembrete 2 horas antes
    reminders.push({
      appointmentId: appointment.id,
      type: 'push',
      scheduledFor: add(appointment.date, { hours: -2 }),
      sent: false,
      message: `Consulta com ${appointment.patientName} em 2 horas`
    });

    // Salvar lembretes no Firestore
    for (const reminder of reminders) {
      await addDoc(collection(db, "users", user.uid, "reminders"), {
        ...reminder,
        createdAt: serverTimestamp()
      });
    }
  };

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

      setAppointments(prev => [...prev, newAppointmentWithId]);
      await createSmartReminders(newAppointmentWithId);
      
      setNewAppointment({
        status: 'agendado',
        priority: 'media'
      });
      setShowAddDialog(false);
      
      toast({
        title: "Agendamento Criado",
        description: "O agendamento foi criado com sucesso e lembretes foram configurados.",
      });
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive"
      });
    }
  };

  // Função para atualizar status do agendamento
  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid, "appointments", appointmentId), {
        status,
        updatedAt: serverTimestamp()
      });

      setAppointments(prev => prev.map(app => 
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
        const today = format(new Date(), 'yyyy-MM-dd');
        const anamnesisQuery = query(
          collection(db, "users", user.uid, "anamnesis"),
          where("data_retorno", ">=", today),
          orderBy("data_retorno", "asc")
        );
        const anamnesisSnapshot = await getDocs(anamnesisQuery);
        const anamnesisRecords = anamnesisSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as StoredAnamnesis))
          .filter(record => record.data_retorno);

        const anamnesisAppointments = anamnesisRecords.map(record => {
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
        const customAppointments = appointmentsSnapshot.docs.map(doc => {
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
    (app) => selectedDate && isSameDay(app.date, selectedDate)
  );

  const upcomingAppointments = appointments
    .filter(app => isAfter(app.date, startOfToday()) || isSameDay(app.date, startOfToday()))
    .slice(0, 7);

  const urgentAppointments = appointments.filter(app => 
    app.priority === 'urgente' && (isToday(app.date) || isTomorrow(app.date))
  );

  const overdueAppointments = appointments.filter(app => 
    isPast(app.date) && app.status === 'agendado'
  );

  const modifiers = {
    appointment: appointments.map(app => app.date),
    urgent: urgentAppointments.map(app => app.date),
    overdue: overdueAppointments.map(app => app.date),
  };

  const modifiersStyles = {
    appointment: {
      color: 'hsl(var(--primary-foreground))',
      backgroundColor: 'hsl(var(--primary))',
      borderRadius: '50%',
    },
    urgent: {
      color: 'white',
      backgroundColor: '#ef4444',
      borderRadius: '50%',
    },
    overdue: {
      color: 'white',
      backgroundColor: '#f59e0b',
      borderRadius: '50%',
    },
  };

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
      {/* Alertas e Notificações */}
      {(urgentAppointments.length > 0 || overdueAppointments.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {urgentAppointments.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Consultas Urgentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">
                  {urgentAppointments.length} consulta(s) urgente(s) para hoje ou amanhã
                </p>
              </CardContent>
            </Card>
          )}
          {overdueAppointments.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Clock className="h-5 w-5" />
                  Consultas Atrasadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700">
                  {overdueAppointments.length} consulta(s) em atraso
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>Selecione uma data para ver os agendamentos</CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patientName">Nome do Paciente *</Label>
                    <Input
                      id="patientName"
                      value={newAppointment.patientName || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder="Nome completo do paciente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Data e Hora *</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={newAppointment.date ? format(newAppointment.date, "yyyy-MM-dd'T'HH:mm") : ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, date: new Date(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="woundLocation">Localização da Ferida</Label>
                    <Input
                      id="woundLocation"
                      value={newAppointment.woundLocation || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, woundLocation: e.target.value }))}
                      placeholder="Ex: Pé direito, região sacral"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select value={newAppointment.priority} onValueChange={(value: any) => setNewAppointment(prev => ({ ...prev, priority: value }))}>
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
                      <Select value={newAppointment.status} onValueChange={(value: any) => setNewAppointment(prev => ({ ...prev, status: value }))}>
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
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações adicionais..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddAppointment} className="flex-1">
                      Criar Agendamento
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full p-0"
              locale={ptBR}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </CardContent>
        </Card>
        <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos do Dia</CardTitle>
            <CardDescription>
              {selectedDate ? format(selectedDate, "'Pacientes para' dd 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {appointmentsForSelectedDay.length > 0 ? (
                <ul className="space-y-3">
                  {appointmentsForSelectedDay.map((app) => (
                    <li key={app.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold truncate">{app.patientName}</p>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(app.status)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{app.woundLocation}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(app.date, "HH:mm")}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Badge className={`text-xs ${getPriorityColor(app.priority)}`}>
                            {app.priority}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(app.status)}`}>
                            {app.status}
                          </Badge>
                        </div>
                        {app.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {app.notes}
                          </p>
                        )}
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(app.id, 'confirmado')}
                            disabled={app.status === 'confirmado' || app.status === 'realizado'}
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(app.id, 'realizado')}
                            disabled={app.status === 'realizado'}
                          >
                            Realizado
                          </Button>
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
        <Card>
          <CardHeader>
            <CardTitle>Próximos 7 Agendamentos</CardTitle>
            <CardDescription>Visão geral dos seus próximos agendamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {upcomingAppointments.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingAppointments.map((app) => (
                    <li key={app.id} className="flex items-center gap-3 p-2 border rounded-lg">
                       <div className="flex-shrink-0 bg-secondary text-secondary-foreground p-2 rounded-md">
                        <CalendarCheck className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold truncate">{app.patientName}</p>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(app.status)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(app.date, "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {app.woundLocation}
                        </p>
                        <div className="flex gap-1 mt-1">
                          <Badge className={`text-xs ${getPriorityColor(app.priority)}`}>
                            {app.priority}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(app.status)}`}>
                            {app.status}
                          </Badge>
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
  );
}
