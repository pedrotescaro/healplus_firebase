
"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, User, MessageSquare } from "lucide-react";
import { useTranslation } from "@/contexts/app-provider";

export function PatientDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Zelo, seu assistente Heal+: cuidado inteligente, decisões seguras.</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Relatórios estruturados em minutos, com linguagem clínica e apoio à decisão.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-primary" />
              {t.myReportsCardTitle}
            </CardTitle>
            <CardDescription>
              {t.myReportsCardDescriptionPatient}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/reports" passHref>
              <Button className="w-full">{t.viewReportsBtn}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {t.profileCardTitle}
            </CardTitle>
            <CardDescription>
              {t.profileCardDescriptionPatient}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href="/dashboard/profile" passHref>
              <Button className="w-full">{t.profileCardBtn}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
