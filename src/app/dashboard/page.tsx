"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GitCompareArrows, User, ClipboardList } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

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
              Carregue uma imagem da ferida e insira os dados da anamnese para gerar um relatório abrangente com IA.
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
              Analise o progresso da cicatrização comparando duas imagens da ferida com insights da IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/compare" passHref>
              <Button className="w-full">Comparar Imagens</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Gerenciar seu Perfil
            </CardTitle>
            <CardDescription>
              Mantenha suas informações profissionais e credenciais atualizadas para um acesso seguro.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/profile" passHref>
              <Button className="w-full">Ver Perfil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
