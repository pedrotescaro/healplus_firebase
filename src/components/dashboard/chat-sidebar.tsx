
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquarePlus, Cat } from 'lucide-react';
import { useChat } from '@/contexts/chat-provider';
import { Popover, PopoverTrigger } from '../ui/popover';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
            <h2 className="font-semibold text-lg tracking-tight">Conversas</h2>
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
                    className="w-full justify-start h-auto py-2"
                    onClick={() => setSelectedContact(contact)}
                    >
                    <div className="relative mr-3 self-start mt-1">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.photoURL ?? undefined} />
                            <AvatarFallback>
                               {contact.id === 'zelo-assistant' ? (
                                    <Cat className="h-6 w-6 text-primary" />
                               ) : (
                                    getInitials(contact.name)
                               )}
                            </AvatarFallback>
                        </Avatar>
                        {contact.id !== 'zelo-assistant' && (
                           <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                        )}
                    </div>
                     <div className="flex flex-col items-start w-full overflow-hidden text-left">
                        <div className="flex justify-between w-full">
                            <span className="font-semibold truncate">{contact.name}</span>
                             {contact.lastMessageTimestamp && (
                                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                    {formatDistanceToNow(contact.lastMessageTimestamp, { addSuffix: true, locale: ptBR })}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate w-full">
                           {contact.lastMessage}
                        </p>
                     </div>
                    </Button>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <MessageSquarePlus className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Nenhuma conversa encontrada.</p>
                    <p className="text-xs text-muted-foreground mt-1">Gere um relatório para um paciente para iniciar uma conversa.</p>
                     <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                        <span>Com dúvida?</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1" onClick={() => setSelectedContact(contacts.find(c => c.id === 'zelo-assistant') || null)}>
                                    <Cat className="h-4 w-4" /> Fale com o Zelo
                                </Button>
                            </PopoverTrigger>
                        </Popover>
                    </div>
                </div>
            )}
         </ScrollArea>
    </div>
  );
}
