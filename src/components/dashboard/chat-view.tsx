
"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/firebase/client-app';
import { collection, onSnapshot, addDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/chat-provider';

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
  const { selectedContact } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
    }, (error) => {
        console.error("Error fetching messages:", error);
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
     <Card className="flex flex-col h-full">
        {selectedContact ? (
          <>
            <div className="flex items-center p-4 border-b">
               <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={selectedContact.photoURL ?? undefined} />
                  <AvatarFallback>{getInitials(selectedContact.name)}</AvatarFallback>
               </Avatar>
               <div>
                  <h3 className="font-semibold text-lg">{selectedContact.name}</h3>
               </div>
            </div>
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
  )
}
