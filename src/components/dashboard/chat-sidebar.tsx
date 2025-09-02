
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import { useChat } from '@/contexts/chat-provider';

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "?";
  const names = name.split(' ');
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || "" : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function ChatSidebar() {
    const { contacts, selectedContact, setSelectedContact, loadingContacts } = useChat();

  return (
    <div className="flex flex-col h-full">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <h2 className="font-semibold text-lg tracking-tight">Contatos</h2>
        </div>
         <ScrollArea className="flex-1 p-2">
            {loadingContacts ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : contacts.length > 0 ? (
                <div className="space-y-1">
                {contacts.map((contact) => (
                    <Button
                    key={contact.id}
                    variant={selectedContact?.id === contact.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start h-14"
                    onClick={() => setSelectedContact(contact)}
                    >
                    <div className="relative mr-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.photoURL ?? undefined} />
                            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                    </div>
                    <span className="truncate">{contact.name}</span>
                    </Button>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <MessageSquarePlus className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Nenhum contato encontrado. Seus contatos aparecerão aqui quando você gerar relatórios para pacientes.</p>
                </div>
            )}
         </ScrollArea>
    </div>
  );
}
