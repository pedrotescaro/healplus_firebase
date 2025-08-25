
"use client";

import { ProfileForm } from "@/components/dashboard/profile-form";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function ProfilePage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.settingsTitle}</h1>
        <p className="text-muted-foreground">{t.settingsDescription}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t.profileTitle}</CardTitle>
          <CardDescription>{t.profileDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.preferencesTitle}</CardTitle>
          <CardDescription>{t.preferencesDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
