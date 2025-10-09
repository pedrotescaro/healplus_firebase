
"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import { Camera, CheckCircle, XCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface ImageCaptureProps {
  onCapture: (fileOrUrl: File | string) => void;
  children: ReactNode;
}

export function ImageCapture({ onCapture, children }: ImageCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isDialogOpen) {
      setCapturedImage(null);
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
            description: "Por favor, habilite a permissão da câmera nas configurações do seu navegador.",
          });
        }
      };
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isDialogOpen, toast]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleConfirm = async () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Capturar Imagem da Ferida</DialogTitle>
        </DialogHeader>
        <div className="relative w-full overflow-hidden rounded-md border bg-muted aspect-video">
          {hasCameraPermission === false ? (
            <div className="flex h-full items-center justify-center p-4">
              <Alert variant="destructive">
                <AlertTitle>Acesso à Câmera Necessário</AlertTitle>
                <AlertDescription>
                  Permita o acesso à câmera para usar esta funcionalidade.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="relative h-full w-full">
              <video
                ref={videoRef}
                className={cn("h-full w-full object-cover", capturedImage && "hidden")}
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              {capturedImage && (
                <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
              )}
              {/* Overlay com guia visual */}
              {!capturedImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11/12 h-5/6 border-4 border-dashed border-white/50 rounded-xl flex items-center justify-center">
                    <div className="bg-black/40 p-2 rounded-lg text-center">
                      <p className="text-white font-semibold">Mantenha a ferida dentro deste quadro</p>
                      <p className="text-white/80 text-sm">Distância ideal: ~15cm</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {capturedImage ? (
            <>
              <Button variant="outline" onClick={() => setCapturedImage(null)} className="w-full sm:w-auto">
                Tentar Novamente
              </Button>
              <Button onClick={handleConfirm} className="w-full sm:w-auto">
                <CheckCircle className="mr-2" /> Usar esta Foto
              </Button>
            </>
          ) : (
            <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
              <Camera className="mr-2" /> Tirar Foto
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="secondary" className="w-full sm:w-auto mt-2 sm:mt-0">
              <XCircle className="mr-2" /> Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
