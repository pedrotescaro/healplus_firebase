
"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GitCompareArrows, User, ClipboardList, PlusCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { AnamnesisFormValues } from "@/lib/anamnesis-schema";
import { Badge } from "@/components/ui/badge";

type StoredAnamnesis = AnamnesisFormValues & { id: string };

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentAnamneses, setRecentAnamneses] = useState<StoredAnamnesis[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("heal-plus-anamneses");
      if (storedData) {
        const allRecords: StoredAnamnesis[] = JSON.parse(storedData);
        // Get the 5 most recent records
        const recent = allRecords.slice(-5).reverse();
        setRecentAnamneses(recent);
      }
    } catch (error) {
      console.error("Failed to load anamnesis records from localStorage", error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo(a), {user?.name}</h1>
        <p className="text-muted-foreground">Aqui está um resumo rápido do que você pode fazer.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Nova Ficha de Anamnese
            </CardTitle>
            <CardDescription>
              Crie uma nova ficha de anamnese detalhada para avaliar o paciente e a ferida.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/anamnesis" passHref>
              <Button className="w-full">Criar Ficha</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Gerar Relatório da Ferida
            </CardTitle>
            <CardDescription>
              Carregue uma imagem e dados da anamnese para gerar um relatório com IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/report" passHref>
              <Button className="w-full">Criar Relatório</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompareArrows className="h-5 w-5 text-primary" />
              Comparar Imagens da Ferida
            </CardTitle>
            <CardDescription>
              Analise o progresso da cicatrização comparando duas imagens com IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/compare" passHref>
              <Button className="w-full">Comparar Imagens</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Fichas de Anamnese Recentes
          </CardTitle>
          <CardDescription>
            Veja as últimas fichas de anamnese que você preencheu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentAnamneses.length > 0 ? (
            <div className="space-y-4">
              {recentAnamneses.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="font-semibold">{record.nome_cliente}</p>
                    <p className="text-sm text-muted-foreground">
                      Consulta em: {new Date(record.data_consulta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  </div>
                  <Badge variant="outline">{record.localizacao_ferida}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma ficha de anamnese encontrada.</p>
              <Link href="/dashboard/anamnesis" passHref>
                <Button variant="outline">
                  <PlusCircle className="mr-2" />
                  Criar Primeira Ficha
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
        { recentAnamneses.length > 0 && (
          <CardFooter>
            <Link href="/dashboard/anamnesis" className="w-full">
              <Button variant="secondary" className="w-full">Ver todas as fichas</Button>
            </Link>
          </CardFooter>
        )}
      </Card>

    </div>
  );
}
