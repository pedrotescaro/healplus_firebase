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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Captura Inteligente de Feridas</h1>
          <p className="text-lg text-gray-300">
            Registre fotos da sua ferida para análise automática com IA e acompanhamento médico.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                    currentStep >= step.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-600 text-gray-300"
                  )}
                >
                  {step.id}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4",
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card - Wound Capture */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Captura da Ferida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6">
                Posicione a câmera sobre a ferida para captura automática.
              </p>
              
              {/* Image Capture Area */}
              <div
                className={cn(
                  "border-2 border-dashed border-blue-400 rounded-lg p-8 text-center cursor-pointer transition-colors",
                  "hover:border-blue-300 hover:bg-blue-500/10"
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {capturedImage ? (
                  <div className="space-y-4">
                    <img
                      src={capturedImage}
                      alt="Captured wound"
                      className="max-w-full h-64 object-contain rounded-lg mx-auto"
                    />
                    <p className="text-green-400">✓ Imagem capturada com sucesso!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium">Clique para capturar</p>
                    <p className="text-gray-400">ou arraste uma imagem aqui</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleCapture}
                  disabled={isCapturing}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isCapturing ? "Capturando..." : "Capturar Foto"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-500/10"
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
                  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
                >
                  Iniciar Análise IA
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Right Card - Capture Instructions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Instruções de Captura</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6">
                Siga estas diretrizes para obter a melhor análise.
              </p>

              <div className="space-y-4">
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
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{instruction.title}</h4>
                      <p className="text-sm text-gray-300">{instruction.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Tip */}
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-400">Dica Pro</h4>
                    <p className="text-sm text-gray-300">
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
          <Card className="mt-8 bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Analisando com IA...</h3>
              <p className="text-gray-300">Processando a imagem da ferida para análise detalhada.</p>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="mt-8 bg-slate-800/50 border-slate-700">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4 text-green-400">✓ Análise Concluída!</h3>
              <p className="text-gray-300 mb-4">
                A análise da ferida foi concluída com sucesso. Os resultados foram salvos e estão disponíveis no seu painel.
              </p>
              <Button
                onClick={() => {
                  setCurrentStep(1);
                  setCapturedImage(null);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Nova Captura
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
