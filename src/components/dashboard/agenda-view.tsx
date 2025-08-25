
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import type { AnamnesisFormValues } from "@/lib/anamnesis-schema";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CalendarCheck, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { add, format, isAfter, isSameDay, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

type Appointment = {
  id: string;
  date: Date;
  patientName: string;
  woundLocation: string;
};

export function AgendaView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const q = query(
          collection(db, "users", user.uid, "anamnesis"),
          where("data_retorno", ">=", today),
          orderBy("data_retorno", "asc")
        );
        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as StoredAnamnesis))
          .filter(record => record.data_retorno); // Ensure data_retorno exists

        const mappedAppointments = records.map(record => {
            const [year, month, day] = record.data_retorno!.split('-').map(Number);
            // new Date(year, month-1, day) can have timezone issues.
            // Using UTC to avoid them.
            const returnDate = new Date(Date.UTC(year, month - 1, day));
            return ({
                id: record.id,
                date: returnDate,
                patientName: record.nome_cliente,
                woundLocation: record.localizacao_ferida,
            })
        });
        
        setAppointments(mappedAppointments);
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

  const modifiers = {
    appointment: appointments.map(app => app.date),
  };

  const modifiersStyles = {
    appointment: {
      color: 'hsl(var(--primary-foreground))',
      backgroundColor: 'hsl(var(--primary))',
      borderRadius: '50%',
    },
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1fr_380px]">
      <Card>
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
            <CardTitle>Retornos do Dia</CardTitle>
            <CardDescription>
              {selectedDate ? format(selectedDate, "'Pacientes para' dd 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              {appointmentsForSelectedDay.length > 0 ? (
                <ul className="space-y-3">
                  {appointmentsForSelectedDay.map((app) => (
                    <li key={app.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">{app.patientName}</p>
                        <p className="text-sm text-muted-foreground">{app.woundLocation}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center pt-8">Nenhum retorno agendado para este dia.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Próximos 7 Retornos</CardTitle>
            <CardDescription>Visão geral dos seus próximos agendamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {upcomingAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingAppointments.map((app) => (
                    <li key={app.id} className="flex items-center gap-3">
                       <div className="flex-shrink-0 bg-secondary text-secondary-foreground p-2 rounded-md">
                        <CalendarCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{app.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(app.date, "dd/MM/yyyy")} - {app.woundLocation}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center pt-20">Nenhum retorno futuro agendado.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
