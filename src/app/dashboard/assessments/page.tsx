"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const q = query(collection(db, "users", user.uid, "assessments"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    load();
  }, [user]);

  return (
    <Card>
      <CardHeader><CardTitle>Assessments</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tecido (%)</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Perímetro</TableHead>
                <TableHead>Criado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(it => (
                <TableRow key={it.id}>
                  <TableCell className="font-mono text-xs"><Link className="underline" href={`/dashboard/assessments/${it.id}`}>{it.id}</Link></TableCell>
                  <TableCell className="text-xs">{it.analysis?.tissueQuant?.map((t:any)=>`${t.class}:${t.percent}%`).join(" | ")}</TableCell>
                  <TableCell>{it.analysis?.area?.value} {it.analysis?.area?.unit}</TableCell>
                  <TableCell>{it.analysis?.perimeter?.value} {it.analysis?.perimeter?.unit}</TableCell>
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


