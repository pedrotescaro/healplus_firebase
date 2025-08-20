
"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import html2canvas from "html2canvas";

interface ImageCaptureProps {
  onCapture: (file: File) => void;
  children: React.ReactNode;
}

export function ImageCapture({ onCapture, children }: ImageCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only request permission when the dialog is opened
    if (isDialogOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Acesso à Câmera Negado",
            description: "Por favor, habilite a permissão da câmera nas configurações do seu navegador para usar esta função.",
          });
        }
      };
      getCameraPermission();
    } else {
      // Cleanup: stop camera stream when dialog is closed
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
       setCapturedImage(null); // Reset captured image
    }
  }, [isDialogOpen, toast]);

  const handleCapture = async () => {
    if (videoRef.current) {
        const canvas = await html2canvas(videoRef.current);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `capture-${new Date().toISOString()}.png`, { type: 'image/png' });
          onCapture(file);
          setIsDialogOpen(false);
        });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Capturar Imagem da Ferida</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
          {hasCameraPermission === false ? (
             <div className="flex h-full items-center justify-center p-4">
                <Alert variant="destructive">
                    <AlertTitle>Acesso à Câmera Necessário</AlertTitle>
                    <AlertDescription>
                        Por favor, permita o acesso à câmera para usar esta funcionalidade.
                    </AlertDescription>
                </Alert>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                autoPlay
                playsInline
                muted
                style={{ display: capturedImage ? 'none' : 'block' }}
              />
              {capturedImage && (
                <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
              )}
            </>
          )}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
            {capturedImage ? (
                <>
                    <Button variant="outline" onClick={() => setCapturedImage(null)} className="w-full sm:w-auto">
                        <RefreshCcw className="mr-2" /> Tentar Novamente
                    </Button>
                    <Button onClick={handleConfirm} className="w-full sm:w-auto">
                        <Check className="mr-2" /> Usar esta Foto
                    </Button>
                </>
            ) : (
                 <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                    <Camera className="mr-2" /> Tirar Foto
                </Button>
            )}
            <DialogClose asChild>
                 <Button variant="secondary" className="w-full sm:w-auto mt-2 sm:mt-0">
                    <X className="mr-2" /> Cancelar
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
