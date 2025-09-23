
"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Clock, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useTranslation } from "@/contexts/app-provider";
import { AnimatePresence, motion } from "framer-motion";

type Appointment = {
  id: string;
  date: Date;
  patientName: string;
  priority?: 'baixa' | 'media' | 'alta' | 'urgente';
  status?: 'agendado' | 'confirmado' | 'realizado' | 'cancelado' | 'reagendado';
};

export function NotificationBell() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [urgent, setUrgent] = useState<Appointment[]>([]);
  const [overdue, setOverdue] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const appointmentsQuery = query(
          collection(db, "users", user.uid, "appointments"),
          orderBy("date", "asc")
        );
        const snapshot = await getDocs(appointmentsQuery);
        const allAppointments = snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, date: data.date.toDate(), ...data } as Appointment;
        });

        const urgentApps = allAppointments.filter(app =>
          app.priority === 'urgente' && (isToday(app.date) || isTomorrow(app.date))
        );
        const overdueApps = allAppointments.filter(app =>
          isPast(app.date) && app.status === 'agendado'
        );
        
        setUrgent(urgentApps);
        setOverdue(overdueApps);

      } catch (error) {
        console.error("Error fetching notifications: ", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const totalNotifications = urgent.length + overdue.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {totalNotifications > 0 && (
            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                >
                    {totalNotifications}
                </motion.div>
            </AnimatePresence>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
            <h3 className="text-lg font-semibold">Notificações</h3>
        </div>
        <Tabs defaultValue="urgent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="urgent">
                <AlertTriangle className="mr-2 h-4 w-4" /> Urgentes ({urgent.length})
            </TabsTrigger>
            <TabsTrigger value="overdue">
                <Clock className="mr-2 h-4 w-4" /> Atrasadas ({overdue.length})
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="h-72">
            <TabsContent value="urgent" className="p-4">
              {urgent.length > 0 ? (
                <ul className="space-y-3">
                  {urgent.map(app => (
                    <li key={app.id}>
                        <Link href="/dashboard/agenda" className="block p-3 rounded-md hover:bg-muted transition-colors">
                            <p className="font-semibold text-sm">{app.patientName}</p>
                            <p className="text-xs text-muted-foreground">Consulta urgente em {format(app.date, "dd/MM 'às' HH:mm", { locale: ptBR })}</p>
                        </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">Nenhuma notificação urgente.</p>
              )}
            </TabsContent>
            <TabsContent value="overdue" className="p-4">
              {overdue.length > 0 ? (
                 <ul className="space-y-3">
                  {overdue.map(app => (
                     <li key={app.id}>
                        <Link href="/dashboard/agenda" className="block p-3 rounded-md hover:bg-muted transition-colors">
                            <p className="font-semibold text-sm">{app.patientName}</p>
                            <p className="text-xs text-muted-foreground">Consulta atrasada desde {format(app.date, "dd/MM/yyyy", { locale: ptBR })}</p>
                        </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">Nenhuma notificação de atraso.</p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        <div className="border-t p-2">
            <Link href="/dashboard/agenda">
                <Button variant="ghost" className="w-full text-sm">Ver todos os agendamentos</Button>
            </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
