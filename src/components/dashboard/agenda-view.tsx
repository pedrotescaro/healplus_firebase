
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Camera, Users, Clock } from "lucide-react";

type Appointment = {
  id: string;
  date: Date;
  time: string;
  type: "virtual" | "presential" | "check-in";
  patient: string;
  status: "confirmed" | "pending" | "cancelled";
};

const initialAppointments: Appointment[] = [
  {
    id: "1",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "10:00",
    type: "virtual",
    patient: "João Silva",
    status: "confirmed",
  },
  {
    id: "2",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "14:00",
    type: "presential",
    patient: "Maria Oliveira",
    status: "pending",
  },
  {
    id: "3",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: "09:00",
    type: "check-in",
    patient: "Carlos Pereira",
    status: "confirmed",
  },
];

export function AgendaView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const filteredAppointments = appointments.filter(
    (appointment) =>
      date &&
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
  );

  const getStatusVariant = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
    }
  };

  const getTypeIcon = (type: Appointment["type"]) => {
    switch (type) {
      case "virtual":
        return <Camera className="h-4 w-4" />;
      case "presential":
        return <Users className="h-4 w-4" />;
      case "check-in":
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Agenda Inteligente</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Compromissos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length > 0 ? (
              <ul className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <li key={appointment.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">{getTypeIcon(appointment.type)}</div>
                    <div className="flex-grow">
                      <p className="font-semibold">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.time}</p>
                    </div>
                    <Badge variant={getStatusVariant(appointment.status)}>{appointment.status}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum compromisso para este dia.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
