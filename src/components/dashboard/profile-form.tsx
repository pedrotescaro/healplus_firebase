
"use client";

import { useState, useRef, ChangeEvent } from "react";
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
import { Loader2, Camera } from "lucide-react";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";


const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const names = name.split(' ');
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || "" : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function ProfileForm() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = getAuth();
  const storage = getStorage();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      specialty: "Especialista em Feridas", // Mock data
      crm_coren: "123456-SP", // Mock data
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setPhotoUploading(true);
    try {
      const filePath = `profile-pictures/${auth.currentUser.uid}/${file.name}`;
      const fileRef = storageRef(storage, filePath);
      
      const snapshot = await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);

      await updateProfile(auth.currentUser, { photoURL });
      await refreshUser(); // Refresh user state in context

      toast({
        title: "Foto de Perfil Atualizada",
        description: "Sua nova foto de perfil foi salva.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no Upload",
        description: error.message || "Não foi possível carregar a nova foto.",
        variant: "destructive",
      });
    } finally {
      setPhotoUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setLoading(true);
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: values.name });
        await refreshUser(); // Refresh user state
        
        toast({
          title: "Perfil Atualizado",
          description: "Suas informações foram salvas com sucesso.",
        });
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
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-primary/20">
              <AvatarImage src={user?.photoURL ?? undefined} alt={user?.name ?? "User Avatar"} />
              <AvatarFallback className="text-4xl">{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute bottom-1 right-1 rounded-full h-10 w-10"
              onClick={handleAvatarClick}
              disabled={photoUploading}
            >
              {photoUploading ? <Loader2 className="animate-spin" /> : <Camera />}
              <span className="sr-only">Mudar foto de perfil</span>
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />
          </div>
        </div>

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
