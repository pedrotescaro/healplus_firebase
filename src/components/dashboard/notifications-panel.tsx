
"use client";

import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const notifications = [
  {
    id: 1,
    title: 'Novo relatório de paciente',
    description: 'O relatório de João Silva foi atualizado.',
    time: '2 minutos atrás',
    read: false,
  },
  {
    id: 2,
    title: 'Consulta em 30 minutos',
    description: 'Sua consulta com Maria Oliveira começa em breve.',
    time: '15 minutos atrás',
    read: false,
  },
  {
    id: 3,
    title: 'Análise de IA concluída',
    description: 'A análise da imagem da ferida de Carlos Pereira está pronta.',
    time: '1 hora atrás',
    read: true,
  },
];

export function NotificationsPanel() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className={!notification.read ? 'bg-accent' : ''}>
            <div>
              <p className="font-semibold">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.description}</p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center">
          <Button variant="link" size="sm">
            Marcar todas como lidas
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
