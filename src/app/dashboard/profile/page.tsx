import { ProfileForm } from "@/components/dashboard/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil do Usuário</h1>
        <p className="text-muted-foreground">Gerencie suas informações profissionais e credenciais.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Perfil</CardTitle>
          <CardDescription>Mantenha suas informações atualizadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
