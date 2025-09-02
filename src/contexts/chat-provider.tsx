
"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/firebase/client-app';
import { collection, query, where, getDocs, collectionGroup } from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';

interface ChatUser {
  id: string;
  name: string | null;
  photoURL: string | null;
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

    const fetchContacts = async () => {
      setLoadingContacts(true);
      try {
        let contactIds: string[] = [];
        let reportsQuery;

        if (user.role === 'professional') {
          // Professional: fetch all reports they created
          reportsQuery = query(collection(db, 'users', user.uid, 'reports'));
        } else {
          // Patient: fetch all reports where they are the patient (across all professionals)
          reportsQuery = query(collectionGroup(db, 'reports'), where('patientId', '==', user.uid));
        }

        const reportsSnapshot = await getDocs(reportsQuery);
        const ids = new Set(reportsSnapshot.docs.map(doc => {
            const data = doc.data();
            return user.role === 'professional' ? data.patientId : data.professionalId;
        }));
        contactIds = Array.from(ids);
        
        if (contactIds.length > 0) {
            const usersQuery = query(collection(db, 'users'), where('uid', 'in', contactIds));
            const usersSnapshot = await getDocs(usersQuery);
            const fetchedContacts = usersSnapshot.docs.map(doc => ({ id: doc.data().uid, name: doc.data().name, photoURL: doc.data().photoURL } as ChatUser));
            
            // Add Zelo to the top of the list
            setContacts([zeloContact, ...fetchedContacts]);

            const preselectedId = searchParams.get('patientId') || searchParams.get('professionalId');
            if (preselectedId) {
              const contactToSelect = fetchedContacts.find(c => c.id === preselectedId);
              if (contactToSelect) {
                setSelectedContact(contactToSelect);
                // Clean up URL params
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.delete('patientId');
                newParams.delete('professionalId');
                router.replace(`?${newParams.toString()}`);
              }
            } else if (fetchedContacts.length > 0 && !selectedContact) {
                // Do not automatically select the first contact
            }
        } else {
            setContacts([zeloContact]);
            setSelectedContact(null);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContacts();
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
