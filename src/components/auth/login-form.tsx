
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/lib/schemas";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { DisclaimerDialog } from "./disclaimer-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/contexts/app-provider";

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const MicrosoftIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.4 22.5H2.3V13.4H11.4V22.5Z" fill="#F25022"/>
        <path d="M21.8 22.5H12.6V13.4H21.8V22.5Z" fill="#7FBA00"/>
        <path d="M11.4 12.2H2.3V3.1H11.4V12.2Z" fill="#00A4EF"/>
        <path d="M21.8 12.2H12.6V3.1H21.8V12.2Z" fill="#FFB900"/>
    </svg>
);

const DISCLAIMER_AGREED_KEY = 'heal-plus-disclaimer-agreed';

export function LoginForm() {
  const router = useRouter();
  const { login, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [microsoftLoading, setMicrosoftLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [loginValues, setLoginValues] = useState<z.infer<typeof loginSchema> | null>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'google' | 'microsoft' | null>(null);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState<boolean | null>(null);
  
  useEffect(() => {
    // This code runs only on the client, preventing hydration errors
    try {
      const agreed = localStorage.getItem(DISCLAIMER_AGREED_KEY) === 'true';
      setDisclaimerAgreed(agreed);
    } catch (error) {
      console.error("Could not access localStorage", error);
      setDisclaimerAgreed(false);
    }
  }, []);


  function onSubmit(values: z.infer<typeof loginSchema>) {
    if (disclaimerAgreed) {
      handleEmailLogin(values);
    } else {
      setLoginValues(values);
      setLoginMethod('email');
      setShowDisclaimer(true);
    }
  }

  function handleGoogleClick() {
    if (disclaimerAgreed) {
      handleGoogleLogin();
    } else {
      setLoginMethod('google');
      setShowDisclaimer(true);
    }
  }

  function handleMicrosoftClick() {
    if (disclaimerAgreed) {
        handleMicrosoftLogin();
    } else {
        setLoginMethod('microsoft');
        setShowDisclaimer(true);
    }
  }

  async function handleDisclaimerAgree() {
    setShowDisclaimer(false);
    try {
      localStorage.setItem(DISCLAIMER_AGREED_KEY, 'true');
      setDisclaimerAgreed(true);
    } catch (error) {
      console.error("Could not set item in localStorage", error);
    }

    if (loginMethod === 'email' && loginValues) {
        await handleEmailLogin(loginValues);
    } else if (loginMethod === 'google') {
        await handleGoogleLogin();
    } else if (loginMethod === 'microsoft') {
        await handleMicrosoftLogin();
    }
    setLoginMethod(null);
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleEmailLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await login(values.email, values.password);
      router.push("/dashboard");
    } catch (error: any) {
       toast({
        title: t.loginErrorTitle,
        description: error.message || t.loginErrorDescription,
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
        await loginWithGoogle();
        router.push("/dashboard");
    } catch (error: any) {
        toast({
            title: t.loginGoogleErrorTitle,
            description: error.code === 'auth/popup-closed-by-user' 
                ? t.loginPopupClosed
                : error.message || t.loginGoogleErrorDescription,
            variant: "destructive",
        });
    } finally {
        setGoogleLoading(false);
    }
  }

  async function handleMicrosoftLogin() {
    setMicrosoftLoading(true);
    try {
        await loginWithMicrosoft();
        router.push("/dashboard");
    } catch (error: any) {
        toast({
            title: t.loginMicrosoftErrorTitle,
            description: error.code === 'auth/popup-closed-by-user' 
                ? t.loginPopupClosed
                : error.message || t.loginMicrosoftErrorDescription,
            variant: "destructive",
        });
    } finally {
        setMicrosoftLoading(false);
    }
  }

  if (disclaimerAgreed === null) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.password}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      aria-label={showPassword ? t.hidePassword : t.showPassword}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.signIn}
          </Button>
        </form>
      </Form>
       <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t.orContinueWith}
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button variant="outline" size="icon" onClick={handleGoogleClick} disabled={googleLoading || microsoftLoading} aria-label={t.loginWithGoogle}>
            {googleLoading ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
        </Button>
        <Button variant="outline" size="icon" onClick={handleMicrosoftClick} disabled={googleLoading || microsoftLoading} aria-label={t.loginWithMicrosoft}>
            {microsoftLoading ? <Loader2 className="animate-spin" /> : <MicrosoftIcon />}
        </Button>
      </div>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {t.dontHaveAccount}{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          {t.signUp}
        </Link>
      </div>
      <DisclaimerDialog 
        isOpen={showDisclaimer} 
        onOpenChange={setShowDisclaimer} 
        onAgree={handleDisclaimerAgree} 
      />
    </>
  );
}
