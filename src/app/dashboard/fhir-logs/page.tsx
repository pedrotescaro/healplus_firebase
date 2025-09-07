"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function FhirLogsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const q = query(collection(db, "users", user.uid, "fhirLogs"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    load();
  }, [user]);

  return (
    <Card>
      <CardHeader><CardTitle>FHIR Logs</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Status/Count</TableHead>
                <TableHead>Bundle/Ref</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(it => (
                <TableRow key={it.id}>
                  <TableCell>{it.type}</TableCell>
                  <TableCell>{it.status || it.count}</TableCell>
                  <TableCell className="font-mono text-xs">{it.bundleId || it.assessmentRef || '-'}</TableCell>
                  <TableCell className="text-xs">{it.createdAt?.toDate?.().toLocaleString?.('pt-BR') || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}


