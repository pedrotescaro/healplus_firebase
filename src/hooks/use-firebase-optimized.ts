import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/firebase/client-app';

// Cache para evitar requisições desnecessárias
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface UseFirebaseOptimizedOptions {
  cacheKey?: string;
  enableRealtime?: boolean;
  staleTime?: number;
}

export function useFirebaseOptimized<T>(
  collectionPath: string,
  options: UseFirebaseOptimizedOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { cacheKey, enableRealtime = false, staleTime = CACHE_DURATION } = options;

  // Verificar cache
  const getCachedData = useCallback((key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      return cached.data;
    }
    return null;
  }, [staleTime]);

  // Salvar no cache
  const setCachedData = useCallback((key: string, data: any) => {
    cache.set(key, { data, timestamp: Date.now() });
  }, []);

  // Função para buscar dados
  const fetchData = useCallback(async () => {
    if (!collectionPath) return;

    const key = cacheKey || collectionPath;
    const cachedData = getCachedData(key);
    
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const q = query(collection(db, collectionPath), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      
      setData(docs);
      setCachedData(key, docs);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [collectionPath, cacheKey, getCachedData, setCachedData]);

  // Função para adicionar documento
  const addDocument = useCallback(async (documentData: Omit<T, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, collectionPath), {
        ...documentData,
        createdAt: serverTimestamp(),
      });
      
      // Invalidar cache
      if (cacheKey) {
        cache.delete(cacheKey);
      }
      
      return docRef;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [collectionPath, cacheKey]);

  // Função para buscar documento específico
  const getDocument = useCallback(async (docId: string) => {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [collectionPath]);

  // Efeito para buscar dados iniciais
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Efeito para real-time updates
  useEffect(() => {
    if (!enableRealtime || !collectionPath) return;

    const q = query(collection(db, collectionPath), orderBy('createdAt', 'desc'));
    const unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      setData(docs);
      setCachedData(collectionPath, docs);
    }, (err) => {
      setError(err);
    });

    return () => unsubscribe();
  }, [collectionPath, enableRealtime, setCachedData]);

  // Memoizar dados para evitar re-renders desnecessários
  const memoizedData = useMemo(() => data, [data]);

  return {
    data: memoizedData,
    loading,
    error,
    refetch: fetchData,
    addDocument,
    getDocument,
  };
}

// Hook específico para anamnesis
export function useAnamnesisRecords(userId?: string) {
  const collectionPath = userId ? `users/${userId}/anamnesis` : '';
  
  return useFirebaseOptimized(collectionPath, {
    cacheKey: `anamnesis-${userId}`,
    enableRealtime: true,
  });
}

// Hook específico para relatórios
export function useReports(userId?: string) {
  const collectionPath = userId ? `users/${userId}/reports` : '';
  
  return useFirebaseOptimized(collectionPath, {
    cacheKey: `reports-${userId}`,
    enableRealtime: true,
  });
}
