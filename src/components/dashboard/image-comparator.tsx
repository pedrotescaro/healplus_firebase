
"use client";

import { useState } from "react";
import Image from "next/image";
import { compareWoundImages, CompareWoundImagesOutput } from "@/ai/flows/compare-wound-images";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fileToDataUri } from "@/lib/file-to-data-uri";
import { UploadCloud, Loader2, GitCompareArrows, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ImageCapture } from "./image-capture";

export function ImageComparator() {
  const [image1, setImage1] = useState<File | null>(null);
  const [image1Preview, setImage1Preview] = useState<string | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image2Preview, setImage2Preview] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [comparison, setComparison] = useState<CompareWoundImagesOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File, imageNumber: 1 | 2) => {
    const setFile = imageNumber === 1 ? setImage1 : setImage2;
    const setPreview = imageNumber === 1 ? setImage1Preview : setImage2Preview;
    
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, imageNumber);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image1 || !image2) {
      toast({
        title: "Imagens Faltando",
        description: "Por favor, envie ambas as imagens da ferida para comparação.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setComparison(null);
    try {
      const [image1DataUri, image2DataUri] = await Promise.all([
        fileToDataUri(image1),
        fileToDataUri(image2),
      ]);
      const result = await compareWoundImages({ image1DataUri, image2DataUri, additionalNotes });
      setComparison(result);
    } catch (error) {
      console.error("Erro ao comparar imagens:", error);
      toast({
        title: "Erro",
        description: "Falha ao comparar as imagens. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const ImageUploader = ({ 
    id, 
    onFileChange, 
    onCapture,
    previewSrc, 
    label 
  }: { 
    id: string, 
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    onCapture: (file: File) => void,
    previewSrc: string | null, 
    label: string 
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed bg-card">
        {previewSrc ? (
          <div className="relative h-full w-full">
            <Image src={previewSrc} alt="Pré-visualização da ferida" layout="fill" className="object-contain" data-ai-hint="wound" />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
            <label htmlFor={id} className="w-full cursor-pointer flex-grow flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <UploadCloud className="mb-2 h-8 w-8" />
                <p className="font-semibold">Arraste ou clique para enviar</p>
                <p className="text-xs">PNG, JPG, ou WEBP</p>
              </div>
            </label>
            <div className="text-xs text-muted-foreground -my-2">OU</div>
            <div onClick={(e) => e.stopPropagation()} className="p-2">
              <ImageCapture onCapture={onCapture}>
                <Button type="button" variant="outline">
                  <Camera className="mr-2" />
                  Tirar Foto com a Câmera
                </Button>
              </ImageCapture>
            </div>
          </div>
        )}
      </div>
      <Input id={id} type="file" className="sr-only" accept="image/*" onChange={onFileChange} />
      {previewSrc && (
        <Button type="button" variant="link" className="w-full" onClick={() => {
          const isImage1 = id === 'image-1';
          if (isImage1) {
            setImage1(null);
            setImage1Preview(null);
          } else {
            setImage2(null);
            setImage2Preview(null);
          }
        }}>
          Remover Imagem
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader 
            id="image-1" 
            onFileChange={(e) => handleFileChange(e, 1)} 
            onCapture={(file) => handleFileSelect(file, 1)}
            previewSrc={image1Preview} 
            label="Imagem 1 (ex: mais antiga)" 
          />
          <ImageUploader 
            id="image-2" 
            onFileChange={(e) => handleFileChange(e, 2)} 
            onCapture={(file) => handleFileSelect(file, 2)}
            previewSrc={image2Preview} 
            label="Imagem 2 (ex: mais recente)" 
          />
        </div>
        <div className="space-y-2">
            <Label htmlFor="additional-notes">Notas Adicionais (Opcional)</Label>
            <Textarea
              id="additional-notes"
              placeholder="Forneça qualquer contexto, como mudanças no tratamento entre as fotos..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Comparar Imagens
        </Button>
      </form>

      {loading && (
        <div className="flex items-center justify-center flex-col text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Comparando imagens... A IA está analisando as mudanças.</p>
        </div>
      )}

      {comparison && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompareArrows className="h-5 w-5 text-primary" />
              Resultado da Comparação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Resumo da Comparação</h3>
              <p className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">{comparison.comparisonSummary}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-2">Ações Sugeridas</h3>
              <p className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">{comparison.suggestedActions}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
