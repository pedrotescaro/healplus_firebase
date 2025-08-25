import { ProfileForm } from "@/components/dashboard/profile-form";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil e preferências de exibição.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
          <CardDescription>Mantenha suas informações profissionais atualizadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>Personalize a aparência e o idioma do aplicativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
