
"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";

export default function SignupPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-col items-center justify-center gap-4">
            <Logo />
             <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">{t.createAccount}</h1>
                <p className="text-sm text-muted-foreground">{t.createAccountPrompt}</p>
            </div>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
