"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, MessageCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { ImageStorageService } from "@/lib/image-storage";
import { useToast } from "@/hooks/use-toast";

export default function WoundCapturePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 1, title: "Preparação", description: "Prepare o ambiente e a ferida" },
    { id: 2, title: "Captura", description: "Capture a foto da ferida" },
    { id: 3, title: "Análise IA", description: "Análise automática com IA" },
    { id: 4, title: "Resultados", description: "Visualize os resultados" }
  ];

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Simulate capture process
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        setCurrentStep(2);
        setIsCapturing(false);
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
      }, 2000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCapturing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const dataUri = await ImageStorageService.fileToDataUri(file);
        const compressedDataUri = await ImageStorageService.compressImage(dataUri);
        setCapturedImage(compressedDataUri);
        setCurrentStep(2);
      } catch (error) {
        toast({
          title: "Erro no Upload",
          description: "Não foi possível processar a imagem.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const dataUri = await ImageStorageService.fileToDataUri(file);
        const compressedDataUri = await ImageStorageService.compressImage(dataUri);
        setCapturedImage(compressedDataUri);
        setCurrentStep(2);
      } catch (error) {
        toast({
          title: "Erro no Upload",
          description: "Não foi possível processar a imagem.",
          variant: "destructive"
        });
      }
    }
  };

  const startAnalysis = async () => {
    if (!capturedImage || !user) return;
    
    setCurrentStep(3);
    setIsSaving(true);
    
    try {
      // Save image to Realtime Database
      const imageId = await ImageStorageService.saveImageWithPath(
        capturedImage,
        user.uid,
        'wound-captures',
        {
          fileName: `wound-capture-${Date.now()}.jpg`,
          mimeType: 'image/jpeg'
        }
      );
      
      toast({
        title: "Imagem Salva",
        description: "A imagem foi salva no banco de dados com sucesso.",
      });
      
      // Simulate AI analysis
      setTimeout(() => {
        setCurrentStep(4);
        setIsSaving(false);
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar a imagem.",
        variant: "destructive"
      });
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground page-responsive">
      <div className="container-responsive">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-responsive-2xl sm:text-responsive-3xl lg:text-responsive-4xl font-bold mb-2">Captura Inteligente de Feridas</h1>
          <p className="text-responsive-sm sm:text-responsive-base lg:text-responsive-lg text-muted-foreground">
            Registre fotos da sua ferida para análise automática com IA e acompanhamento médico.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center w-full sm:w-auto">
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-responsive-xs sm:text-responsive-sm font-semibold flex-shrink-0",
                    currentStep >= step.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-600 text-gray-300"
                  )}
                >
                  {step.id}
                </div>
                <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                  <p className="font-medium text-responsive-sm sm:text-responsive-base truncate">{step.title}</p>
                  <p className="text-responsive-xs sm:text-responsive-sm text-gray-400 hidden sm:block">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "hidden sm:block flex-1 h-0.5 mx-4",
                      currentStep > step.id ? "bg-blue-500" : "bg-gray-600"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Card - Wound Capture */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-card-foreground text-lg sm:text-xl">Captura da Ferida</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                Posicione a câmera sobre a ferida para captura automática.
              </p>
              
              {/* Image Capture Area */}
              <div
                className={cn(
                  "border-2 border-dashed border-primary rounded-lg p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-colors",
                  "hover:border-primary/70 hover:bg-primary/5"
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {capturedImage ? (
                  <div className="space-y-3 sm:space-y-4">
                    <img
                      src={capturedImage}
                      alt="Captured wound"
                      className="max-w-full h-48 sm:h-56 lg:h-64 object-contain rounded-lg mx-auto"
                    />
                    <p className="text-green-400 text-sm sm:text-base">✓ Imagem capturada com sucesso!</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                    </div>
                    <p className="text-foreground font-medium text-sm sm:text-base">Clique para capturar</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">ou arraste uma imagem aqui</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                <Button
                  onClick={handleCapture}
                  disabled={isCapturing}
                  className="flex-1"
                  size="sm"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{isCapturing ? "Capturando..." : "Capturar Foto"}</span>
                  <span className="sm:hidden">{isCapturing ? "Capturando..." : "Capturar"}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {capturedImage && currentStep === 2 && (
                <Button
                  onClick={startAnalysis}
                  className="w-full mt-4"
                  size="sm"
                >
                  Iniciar Análise IA
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Right Card - Capture Instructions */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-card-foreground text-lg sm:text-xl">Instruções de Captura</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                Siga estas diretrizes para obter a melhor análise.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    title: "Iluminação Adequada",
                    description: "Use luz natural ou artificial clara, evite sombras."
                  },
                  {
                    title: "Distância Correta",
                    description: "Mantenha 15-20cm de distância da ferida."
                  },
                  {
                    title: "Ângulo Perpendicular",
                    description: "Capture diretamente de cima, sem inclinação."
                  },
                  {
                    title: "Foco na Ferida",
                    description: "Centralize a ferida na imagem, com margem ao redor."
                  }
                ].map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center text-xs font-semibold text-primary-foreground flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground text-sm sm:text-base">{instruction.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{instruction.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Tip */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-accent border border-border rounded-lg">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-accent-foreground text-sm sm:text-base">Dica Pro</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Use uma régua ou moeda como referência de escala para medições mais precisas.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        {currentStep === 3 && (
          <Card className="mt-6 sm:mt-8 bg-card border-border">
            <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
              <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3 sm:mb-4"></div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Analisando com IA...</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Processando a imagem da ferida para análise detalhada.</p>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="mt-6 sm:mt-8 bg-card border-border">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-600 dark:text-green-400">✓ Análise Concluída!</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                A análise da ferida foi concluída com sucesso. Os resultados foram salvos e estão disponíveis no seu painel.
              </p>
              <Button
                onClick={() => {
                  setCurrentStep(1);
                  setCapturedImage(null);
                }}
                size="sm"
                className="w-full sm:w-auto"
              >
                Nova Captura
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>
    </div>
  );
}
