
"use client";

import { useState } from "react";
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

const GoogleIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

export function LoginForm() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [loginValues, setLoginValues] = useState<z.infer<typeof loginSchema> | null>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'google' | null>(null);


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoginValues(values);
    setLoginMethod('email');
    setShowDisclaimer(true);
  }

  function handleGoogleClick() {
    setLoginMethod('google');
    setShowDisclaimer(true);
  }

  async function handleDisclaimerAgree() {
    setShowDisclaimer(false);
    if (loginMethod === 'email' && loginValues) {
        await handleEmailLogin(loginValues);
    } else if (loginMethod === 'google') {
        await handleGoogleLogin();
    }
    setLoginMethod(null);
  }

  async function handleEmailLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await login(values.email, values.password);
      router.push("/dashboard");
    } catch (error: any) {
       toast({
        title: "Erro no Login",
        description: error.message || "Credenciais inválidas ou e-mail não verificado.",
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
            title: "Erro no Login com Google",
            description: error.code === 'auth/popup-closed-by-user' 
                ? "A janela de login foi fechada. Por favor, tente novamente."
                : error.message || "Não foi possível fazer login com o Google.",
            variant: "destructive",
        });
    } finally {
        setGoogleLoading(false);
    }
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
            Sign In
          </Button>
        </form>
      </Form>
       <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continue com
          </span>
        </div>
      </div>
       <Button variant="outline" className="w-full" onClick={handleGoogleClick} disabled={googleLoading}>
        {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Google
      </Button>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
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
