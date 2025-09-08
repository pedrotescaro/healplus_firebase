
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
import { ImageStorageService } from "@/lib/image-storage";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const names = name.split(' ');
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || "" : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

// Function to generate the cropped image
function getCroppedImg(image: HTMLImageElement, crop: Crop): Promise<string> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return Promise.reject(new Error('Failed to get canvas context'));
  }

  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    resolve(canvas.toDataURL("image/jpeg"));
  });
}


export function ProfileForm() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = getAuth();

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

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          1, // aspect ratio 1:1
          width,
          height
        ),
        width,
        height
      );
      setCrop(newCrop);
    };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };
  
  const handleCropAndUpload = async () => {
    if (!completedCrop || !imgRef.current || !auth.currentUser) {
        toast({ title: "Erro", description: "Nenhuma área de corte selecionada.", variant: "destructive" });
        return;
    }

    setPhotoUploading(true);
    setIsCropModalOpen(false);

    try {
        const croppedImageDataUrl = await getCroppedImg(imgRef.current, completedCrop);
        
        // Save image to Realtime Database
        const imageId = await ImageStorageService.saveImageWithPath(
          croppedImageDataUrl,
          auth.currentUser.uid,
          'profile-pictures',
          {
            fileName: 'profile.jpg',
            mimeType: 'image/jpeg'
          }
        );

        // Get the image data to use as photoURL
        const imageData = await ImageStorageService.getImage(auth.currentUser.uid, imageId);
        const photoURL = imageData?.dataUri;

        if (photoURL) {
          await updateProfile(auth.currentUser, { photoURL });
          await refreshUser(); // Refresh user state in context

          toast({
              title: "Foto de Perfil Atualizada",
              description: "Sua nova foto de perfil foi salva no banco de dados.",
          });
        }
    } catch (error: any) {
        toast({
            title: "Erro no Upload",
            description: error.message || "Não foi possível salvar a nova foto.",
            variant: "destructive",
        });
    } finally {
        setPhotoUploading(false);
        setImageSrc(null);
        setCrop(undefined);
        setCompletedCrop(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
    <>
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
          {user?.role === 'professional' && (
            <>
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
            </>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </form>
      </Form>

      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajuste sua Foto de Perfil</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {imageSrc && (
               <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageSrc}
                  onLoad={onImageLoad}
                  style={{ maxHeight: '70vh' }}
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCropAndUpload} disabled={!completedCrop}>Salvar Foto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
