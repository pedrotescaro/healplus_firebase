
"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/firebase/client-app';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';

interface ChatUser {
  id: string;
  name: string | null;
  photoURL: string | null;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
}

interface ChatContextType {
  contacts: ChatUser[];
  selectedContact: ChatUser | null;
  setSelectedContact: (user: ChatUser | null) => void;
  loadingContacts: boolean;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

const zeloContact: ChatUser = {
  id: 'zelo-assistant',
  name: 'Zelo',
  photoURL: null, // We'll use a fallback icon
  lastMessage: 'Pergunte-me qualquer coisa!',
};


export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [contacts, setContacts] = useState<ChatUser[]>([zeloContact]);
  const [selectedContact, setSelectedContact] = useState<ChatUser | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingContacts(false);
      return;
    };

    const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid),
        orderBy('timestampUltimaMensagem', 'desc')
    );
    
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
        setLoadingContacts(true);
        const fetchedChats = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const otherParticipantId = data.participants.find((p: string) => p !== user.uid);
            
            // Handle case where chat might be with Zelo or self, though unlikely
            if (!otherParticipantId) return null;

            return {
                id: otherParticipantId,
                name: data.nomesParticipantes[otherParticipantId] || 'Usuário Desconhecido',
                photoURL: data.photoURLs[otherParticipantId] || null,
                lastMessage: data.ultimaMensagem,
                lastMessageTimestamp: data.timestampUltimaMensagem?.toDate(),
            };
        }).filter(Boolean) as ChatUser[]; // filter(Boolean) removes nulls

        setContacts([zeloContact, ...fetchedChats]);
        setLoadingContacts(false);
        
        // Logic to pre-select a contact from URL params
        const preselectedId = searchParams.get('patientId') || searchParams.get('professionalId');
        if (preselectedId) {
          const contactToSelect = fetchedChats.find(c => c.id === preselectedId);
          if (contactToSelect) {
            setSelectedContact(contactToSelect);
            // Clean up URL params
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('patientId');
            newParams.delete('professionalId');
            router.replace(`?${newParams.toString()}`);
          }
        }

    }, (error) => {
        console.error("Error fetching chats:", error);
        setLoadingContacts(false);
    });
    
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <ChatContext.Provider value={{ contacts, selectedContact, setSelectedContact, loadingContacts }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
