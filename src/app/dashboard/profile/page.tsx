
"use client";

import { ProfileForm } from "@/components/dashboard/profile-form";
import { SettingsForm } from "@/components/dashboard/settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, User, Settings, AlertTriangle, Shield } from "lucide-react";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { deleteAccount } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast({
        title: "Conta Excluída",
        description: "Sua conta foi excluída com sucesso.",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Erro ao Excluir Conta",
        description:
          error.message ||
          "Não foi possível excluir sua conta. Tente fazer login novamente e repita o processo.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header com gradiente e estatísticas */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t.settingsTitle}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {t.settingsDescription}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="p-3 bg-primary rounded-full">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-xs text-muted-foreground mt-2">Perfil</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card de Perfil */}
        <Card className="shadow-lg border-border/50">
          <CardHeader className="bg-gradient-to-r from-blue-500/5 via-blue-500/3 to-transparent border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              {t.profileTitle}
            </CardTitle>
            <CardDescription>{t.profileDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ProfileForm />
          </CardContent>
        </Card>

        {/* Card de Configurações */}
        <Card className="shadow-lg border-border/50">
          <CardHeader className="bg-gradient-to-r from-green-500/5 via-green-500/3 to-transparent border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              {t.preferencesTitle}
            </CardTitle>
            <CardDescription>{t.preferencesDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <SettingsForm />
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-lg shadow-red-500/10">
        <CardHeader className="bg-gradient-to-r from-red-500/5 via-red-500/3 to-transparent border-b border-red-200">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            Zona de Perigo
          </CardTitle>
          <CardDescription className="text-red-700">
            A ação a seguir é permanente e não pode ser desfeita.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Excluir Conta</p>
                <p className="text-sm text-red-600">Remover permanentemente todos os dados</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md"
                >
                  Excluir Minha Conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Você tem certeza absoluta?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá
                    permanentemente sua conta e removerá seus dados de nossos
                    servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sim, excluir conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
