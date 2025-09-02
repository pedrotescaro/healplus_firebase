
"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/firebase/client-app';
import { collection, query, where, getDocs, onSnapshot, addDoc, serverTimestamp, orderBy, doc, getDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatUser {
  id: string;
  name: string | null;
  photoURL: string | null;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
}

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "?";
  const names = name.split(' ');
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || "" : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function ChatView() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [contacts, setContacts] = useState<ChatUser[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      setLoadingContacts(true);
      try {
        let contactIds: string[] = [];
        if (user.role === 'professional') {
          const reportsQuery = query(collection(db, 'reports'), where('professionalId', '==', user.uid));
          const reportsSnapshot = await getDocs(reportsQuery);
          const patientIds = new Set(reportsSnapshot.docs.map(doc => doc.data().patientId));
          contactIds = Array.from(patientIds);
        } else {
          const reportsQuery = query(collection(db, 'reports'), where('patientId', '==', user.uid));
          const reportsSnapshot = await getDocs(reportsQuery);
          const professionalIds = new Set(reportsSnapshot.docs.map(doc => doc.data().professionalId));
          contactIds = Array.from(professionalIds);
        }
        
        if (contactIds.length > 0) {
            const usersQuery = query(collection(db, 'users'), where('uid', 'in', contactIds));
            const usersSnapshot = await getDocs(usersQuery);
            const fetchedContacts = usersSnapshot.docs.map(doc => ({ id: doc.data().uid, ...doc.data() } as ChatUser));
            setContacts(fetchedContacts);

            const preselectedPatientId = searchParams.get('patientId');
            if (preselectedPatientId) {
              const contactToSelect = fetchedContacts.find(c => c.id === preselectedPatientId);
              if (contactToSelect) {
                setSelectedContact(contactToSelect);
              }
            } else if (fetchedContacts.length > 0) {
                setSelectedContact(fetchedContacts[0]);
            }
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContacts();
  }, [user, searchParams]);

  useEffect(() => {
    if (!user || !selectedContact) {
        setMessages([]);
        return;
    };

    setLoadingMessages(true);
    const chatId = [user.uid, selectedContact.id].sort().join('_');
    const messagesQuery = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp'));

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(fetchedMessages);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [user, selectedContact]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user || !selectedContact) return;

    const chatId = [user.uid, selectedContact.id].sort().join('_');
    
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: newMessage,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 h-full">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Contatos</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {loadingContacts ? (
             <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : contacts.length > 0 ? (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <Button
                  key={contact.id}
                  variant={selectedContact?.id === contact.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start h-14"
                  onClick={() => setSelectedContact(contact)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={contact.photoURL ?? undefined} />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{contact.name}</span>
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">Nenhum contato encontrado.</p>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col h-full">
        {selectedContact ? (
          <>
            <CardHeader className="flex-row items-center space-x-4 border-b">
               <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedContact.photoURL ?? undefined} />
                  <AvatarFallback>{getInitials(selectedContact.name)}</AvatarFallback>
               </Avatar>
               <div>
                  <CardTitle className="text-xl">{selectedContact.name}</CardTitle>
               </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                 {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex items-end gap-2", msg.senderId === user?.uid ? "justify-end" : "justify-start")}>
                         {msg.senderId !== user?.uid && (
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedContact.photoURL ?? undefined} />
                                <AvatarFallback>{getInitials(selectedContact.name)}</AvatarFallback>
                             </Avatar>
                         )}
                        <div
                            className={cn(
                            "max-w-xs md:max-w-md rounded-lg px-4 py-2 text-sm",
                            msg.senderId === user?.uid ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}
                        >
                            {msg.text}
                        </div>
                        </div>
                    ))}
                    </div>
                )}
            </ScrollArea>
            <div className="p-4 border-t">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  autoComplete="off"
                />
                <Button type="submit" size="icon">
                  <Send />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <User className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Selecione um contato</h3>
            <p className="text-muted-foreground">Escolha um {user?.role === 'professional' ? 'paciente' : 'profissional'} da lista para iniciar uma conversa.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
