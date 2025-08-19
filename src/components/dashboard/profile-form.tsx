
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
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
import { profileSchema } from "@/lib/schemas";
import { Loader2 } from "lucide-react";
import { getAuth, updateProfile } from "firebase/auth";

export function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      specialty: "Especialista em Feridas", // Mock data - or load from a user profile service
      crm_coren: "123456-SP", // Mock data - or load from a user profile service
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setLoading(true);
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: values.name });
        // In a real app, you would also save specialty and crm_coren to your database (e.g., Firestore)
        toast({
          title: "Perfil Atualizado",
          description: "Suas informações foram salvas com sucesso.",
        });
        // You might want to refresh the user state in your context here
      } catch (error: any) {
        toast({
          title: "Erro ao Atualizar",
          description: error.message || "Não foi possível salvar as alterações.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
       toast({
          title: "Erro",
          description: "Nenhum usuário autenticado encontrado.",
          variant: "destructive",
        });
       setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Dra. Joana da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
                <Input type="email" value={user?.email || ""} disabled />
            </FormControl>
        </FormItem>
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialidade</FormLabel>
              <FormControl>
                <Input placeholder="ex: Dermatologia, Enfermagem" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="crm_coren"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CRM/COREN</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: 123456-SP"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Alterações
        </Button>
      </form>
    </Form>
  );
}
