
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { anamnesisFormSchema, AnamnesisFormValues } from "@/lib/anamnesis-schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { WoundBedProgress } from "./wound-bed-progress";
import { User, Stethoscope, HeartPulse, Pill, Microscope, FilePlus, Info, MapPin, RefreshCw, Syringe, Droplets, Ruler, RedoDot, UploadCloud, Camera } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { BodyMapSelector } from "./body-map-selector";
import { ImageCapture } from "./image-capture";
import { fileToDataUri } from "@/lib/file-to-data-uri";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db, storage } from "@/firebase/client-app";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDoc, doc, updateDoc, query, where, getDocs, limit } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

export function AnamnesisForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const defaultValues: Partial<AnamnesisFormValues> = {
    patientId: "",
    nome_cliente: "",
    data_nascimento: "",
    telefone: "",
    email: "",
    profissao: "",
    estado_civil: "",
    nivel_atividade: "",
    suporte_social: "",
    compreensao_adesao: "",
    objetivo_tratamento: "",
    historico_cicrizacao: "",
    estado_nutricional: "",
    possui_alergia: false,
    qual_alergia: "",
    pratica_atividade_fisica: false,
    qual_atividade: "",
    frequencia_atividade: "",
    ingestao_agua_dia: "",
    ingestao_alcool: false,
    frequencia_alcool: "",
    realizou_cirurgias: false,
    quais_cirurgias: "",
    claudicacao_intermitente: false,
    dor_repouso: false,
    pulsos_perifericos: "",
    fumante: false,
    dmi: false,
    dmii: false,
    has: false,
    neoplasia: false,
    hiv_aids: false,
    obesidade: false,
    cardiopatia: false,
    dpoc: false,
    doenca_hematologica: false,
    doenca_vascular: false,
    demencia_senil: false,
    insuficiencia_renal: false,
    hanseniase: false,
    insuficiencia_hepatica: false,
    doenca_autoimune: false,
    outros_hpp: "",
    anti_hipertensivo: false,
    anti_hipertensivo_nome: "",
    anti_hipertensivo_dose: "",
    corticoides: false,
    corticoides_nome: "",
    corticoides_dose: "",
    hipoglicemiantes_orais: false,
    hipoglicemiantes_orais_nome: "",
    hipoglicemiantes_orais_dose: "",
    aines: false,
    aines_nome: "",
    aines_dose: "",
    insulina: false,
    insulina_nome: "",
    insulina_dose: "",
    drogas_vasoativa: false,
    drogas_vasoativa_nome: "",
    drogas_vasoativa_dose: "",
    suplemento: false,
    suplemento_nome: "",
    suplemento_dose: "",
    anticoagulante: false,
    anticoagulante_nome: "",
    anticoagulante_dose: "",
    vitaminico: false,
    vitaminico_nome: "",
    vitaminico_dose: "",
    antirretroviral: false,
    antirretroviral_nome: "",
    antirretroviral_dose: "",
    outros_medicamento: "",
    woundImageUri: "",
    ferida_largura: 0,
    ferida_comprimento: 0,
    ferida_profundidade: 0,
    localizacao_ferida: "",
    etiologia_ferida: "",
    etiologia_outra: "",
    tempo_evolucao: "",
    dor_escala: 0,
    dor_fatores: "",
    percentual_granulacao_leito: 0,
    percentual_epitelizacao_leito: 0,
    percentual_esfacelo_leito: 0,
    percentual_necrose_seca_leito: 0,
    inflamacao_rubor: false,
    inflamacao_calor: false,
    inflamacao_edema: false,
    inflamacao_dor_local: false,
    inflamacao_perda_funcao: false,
    infeccao_eritema_perilesional: false,
    infeccao_calor_local: false,
    infeccao_edema: false,
    infeccao_dor_local: false,
    infeccao_exsudato: false,
    infeccao_odor: false,
    infeccao_retardo_cicatrizacao: false,
    cultura_realizada: false,
    resultado_cultura: "",
    quantidade_exsudato: "",
    tipo_exsudato: "",
    consistencia_exsudato: "",
    pele_perilesional_umidade: "",
    pele_perilesional_extensao: "",
    bordas_caracteristicas: "",
    fixacao_bordas: "",
    tunel_cavidade: false,
    localizacao_tunel_cavidade: "",
    velocidade_cicatrizacao: "",
    pele_perilesional_integra: false,
    pele_perilesional_eritematosa: false,
    pele_perilesional_macerada: false,
    pele_perilesional_seca_descamativa: false,
    pele_perilesional_eczematosa: false,
    pele_perilesional_hiperpigmentada: false,
    pele_perilesional_hipopigmentada: false,
    pele_perilesional_indurada: false,
    pele_perilesional_sensivel: false,
    pele_perilesional_edema: false,
    observacoes: "",
    data_consulta: new Date().toISOString().split('T')[0],
    hora_consulta: new Date().toTimeString().slice(0, 5),
    profissional_responsavel: "",
    coren: "",
    data_retorno: "",
  };

  const form = useForm<AnamnesisFormValues>({
    resolver: zodResolver(anamnesisFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && user) {
      setIsEditMode(true);
      setRecordId(editId);
      const fetchRecord = async () => {
        try {
          const docRef = doc(db, "users", user.uid, "anamnesis", editId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            form.reset(docSnap.data() as AnamnesisFormValues);
          } else {
            toast({ title: "Erro", description: "Ficha de anamnese não encontrada.", variant: "destructive" });
            router.push('/dashboard/anamnesis-records');
          }
        } catch (error) {
          console.error("Error fetching from Firestore:", error);
          toast({ title: "Erro", description: "Não foi possível carregar a ficha.", variant: "destructive" });
        }
      };
      fetchRecord();
    }
  }, [searchParams, form, router, toast, user]);

  const watch = form.watch();

  const tissueData = [
    { name: "percentual_granulacao_leito" as const, value: watch.percentual_granulacao_leito || 0 },
    { name: "percentual_epitelizacao_leito" as const, value: watch.percentual_epitelizacao_leito || 0 },
    { name: "percentual_esfacelo_leito" as const, value: watch.percentual_esfacelo_leito || 0 },
    { name: "percentual_necrose_seca_leito" as const, value: watch.percentual_necrose_seca_leito || 0 },
  ];

  const getPainColorClasses = (value: number) => {
    if (value <= 3) return { range: "bg-green-500", thumb: "border-green-500" };
    if (value <= 6) return { range: "bg-yellow-500", thumb: "border-yellow-500" };
    return { range: "bg-red-500", thumb: "border-red-500" };
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = async (fileOrData: File | string) => {
    try {
      if (typeof fileOrData === 'string') {
        form.setValue('woundImageUri', fileOrData);
      } else {
        const dataUri = await fileToDataUri(fileOrData);
        form.setValue('woundImageUri', dataUri);
      }
    } catch (error) {
       toast({ title: "Erro ao carregar imagem", description: "Não foi possível processar o arquivo.", variant: "destructive" });
    }
  };


  const renderMedicationFields = (name: "anti_hipertensivo" | "corticoides" | "hipoglicemiantes_orais" | "aines" | "insulina" | "drogas_vasoativa" | "suplemento" | "anticoagulante" | "vitaminico" | "antirretroviral") => {
    return watch[name] && (
      <>
        <FormField
          control={form.control}
          name={`${name}_nome`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${name}_dose`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dose</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    )
  };

  async function onSubmit(data: AnamnesisFormValues) {
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado para salvar uma ficha.", variant: "destructive" });
      return;
    }

    const totalPercentage = (data.percentual_granulacao_leito || 0) + (data.percentual_epitelizacao_leito || 0) + (data.percentual_esfacelo_leito || 0) + (data.percentual_necrose_seca_leito || 0);
    if (totalPercentage > 100) {
      toast({
        title: "Percentual Inválido",
        description: `A soma dos percentuais do leito da ferida não pode exceder 100%. Total atual: ${totalPercentage}%.`,
        variant: "destructive",
      });
      return;
    }

    if (!data.patientId) {
        data.patientId = `unregistered_${uuidv4()}`;
    }

    // Upload imagem ao Storage se for data URI
    try {
      if (data.woundImageUri && data.woundImageUri.startsWith('data:')) {
        const imagePath = `users/${user.uid}/anamnesis/${uuidv4()}.png`;
        const sref = ref(storage, imagePath);
        await uploadString(sref, data.woundImageUri, 'data_url');
        const imageUrl = await getDownloadURL(sref);
        data.woundImageUri = imageUrl;
      }
    } catch (e) {
      toast({ title: "Falha ao enviar imagem", description: "Tente novamente.", variant: "destructive" });
      return;
    }

    // Sanitize data to ensure no undefined values are sent to Firestore
    const sanitizedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === undefined ? "" : value])
    );

    try {
      if (isEditMode && recordId) {
        // Update existing record in Firestore
        const docRef = doc(db, "users", user.uid, "anamnesis", recordId);
        await updateDoc(docRef, sanitizedData);
        toast({
          title: "Formulário Atualizado",
          description: "A ficha de anamnese foi atualizada com sucesso.",
        });
        router.push("/dashboard/anamnesis-records");
      } else {
        // Create new record in Firestore
        await addDoc(collection(db, "users", user.uid, "anamnesis"), sanitizedData);
        toast({
          title: "Formulário Salvo",
          description: "A ficha de anamnese foi salva com sucesso no Firestore.",
        });
        form.reset(defaultValues);
      }
    } catch (error: any) {
       toast({
        title: "Erro ao Salvar",
        description: error.message || "Não foi possível salvar a ficha no Firestore.",
        variant: "destructive",
      });
      console.error("Failed to save anamnesis to Firestore", error);
    }
  }

  const handleReset = () => {
    form.reset(defaultValues);
    setIsEditMode(false);
    setRecordId(null);
    router.push('/dashboard/anamnesis');
    toast({
      title: "Formulário Limpo",
      description: "Você está preenchendo uma nova ficha de anamnese.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Accordion type="multiple" defaultValue={['item-0']} className="w-full">
          <AccordionItem value="item-0">
            <AccordionTrigger className="text-lg font-semibold"><User className="mr-2 text-primary" /> Dados Pessoais</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2 border-l-2 border-primary/20">
                <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => <Input type="hidden" {...field} />}
                />
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="nome_cliente" render={({ field }) => ( <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="data_nascimento" render={({ field }) => ( <FormItem><FormLabel>Data de Nascimento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="telefone" render={({ field }) => ( <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="profissao" render={({ field }) => ( <FormItem><FormLabel>Profissão</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="estado_civil" render={({ field }) => ( <FormItem><FormLabel>Estado Civil</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold"><Microscope className="mr-2 text-primary" /> T - Tecido</AccordionTrigger>
            <AccordionContent className="space-y-6 p-2 border-l-2 border-primary/20">
              <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="woundImageUri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagem da Ferida</FormLabel>
                        <FormControl>
                           <div className="relative flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-4">
                              {field.value ? (
                                <div className="relative h-full w-full">
                                  <Image src={field.value} alt="Pré-visualização da ferida" layout="fill" className="object-contain" data-ai-hint="wound" />
                                </div>
                              ) : (
                                <>
                                  <label htmlFor="wound-image-input" className="w-full cursor-pointer flex-grow flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors">
                                    <UploadCloud className="mb-2 h-8 w-8" />
                                    <p className="font-semibold">Arraste ou clique para enviar</p>
                                    <p className="text-xs">PNG, JPG, ou WEBP</p>
                                  </label>
                                  <div className="my-2 text-xs text-muted-foreground">OU</div>
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <ImageCapture onCapture={handleFileSelect}>
                                      <Button type="button" variant="outline" size="sm">
                                        <Camera className="mr-2" />
                                        Tirar Foto
                                      </Button>
                                    </ImageCapture>
                                  </div>
                                </>
                              )}
                            </div>
                        </FormControl>
                        <Input id="wound-image-input" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        <FormMessage />
                        {field.value && (
                          <Button type="button" variant="link" className="w-full" onClick={() => field.onChange("")}>
                            Remover Imagem
                          </Button>
                        )}
                      </FormItem>
                    )}
                  />
                  <h4 className="font-semibold text-md">Dimensões e Características Gerais</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="ferida_largura" render={({ field }) => ( <FormItem><FormLabel>Largura (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="ferida_comprimento" render={({ field }) => ( <FormItem><FormLabel>Comprimento (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="ferida_profundidade" render={({ field }) => ( <FormItem><FormLabel>Profundidade (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                   <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="localizacao_ferida"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Localização</FormLabel>
                               <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input {...field} readOnly placeholder="Selecione no mapa corporal" />
                                </FormControl>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button type="button" variant="outline" size="icon">
                                      <MapPin />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>Selecione a Localização da Ferida</DialogTitle>
                                      <DialogDescription>
                                        Clique em uma parte do corpo para selecioná-la.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <BodyMapSelector
                                      onLocationSelect={(location) => {
                                        field.onChange(location);
                                      }}
                                      currentLocation={field.value}
                                    />
                                    <DialogClose />
                                  </DialogContent>
                                </Dialog>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <FormField control={form.control} name="tempo_evolucao" render={({ field }) => ( <FormItem><FormLabel>Tempo de Evolução</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField
                        control={form.control}
                        name="etiologia_ferida"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Etiologia</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione a causa..." /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Lesão por Pressão">Lesão por Pressão</SelectItem>
                                <SelectItem value="Úlcera Venosa">Úlcera Venosa</SelectItem>
                                <SelectItem value="Úlcera Arterial">Úlcera Arterial</SelectItem>
                                <SelectItem value="Pé Diabético">Pé Diabético (Neuropática)</SelectItem>
                                <SelectItem value="Ferida Cirúrgica">Ferida Cirúrgica</SelectItem>
                                <SelectItem value="Ferida Traumática">Ferida Traumática</SelectItem>
                                <SelectItem value="Queimadura">Queimadura</SelectItem>
                                <SelectItem value="Outra">Outra</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {watch.etiologia_ferida === 'Outra' && (
                        <FormField control={form.control} name="etiologia_outra" render={({ field }) => ( <FormItem><FormLabel>Especifique a Etiologia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                      )}
                  </div>
              </div>
              <Separator />
              <div className="space-y-4">
                  <h4 className="font-semibold text-md">Avaliação do Leito da Ferida</h4>
                  <div className="mb-4">
                    <WoundBedProgress data={tissueData} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField control={form.control} name="percentual_granulacao_leito" render={({ field }) => ( <FormItem><FormLabel>Granulação (%)</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="percentual_epitelizacao_leito" render={({ field }) => ( <FormItem><FormLabel>Epitelização (%)</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="percentual_esfacelo_leito" render={({ field }) => ( <FormItem><FormLabel>Esfacelo (%)</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}/></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="percentual_necrose_seca_leito" render={({ field }) => ( <FormItem><FormLabel>Necrose Seca (%)</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}/></FormControl><FormMessage /></FormItem> )} />
                  </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold"><Syringe className="mr-2 text-primary" /> I - Infecção e Inflamação</AccordionTrigger>
            <AccordionContent className="space-y-6 p-2 border-l-2 border-primary/20">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="dor_escala"
                  render={({ field }) => {
                    const painValue = field.value ?? 0;
                    const colors = getPainColorClasses(painValue);
                    return (
                      <FormItem>
                        <FormLabel>Intensidade da Dor (0-10): {painValue}</FormLabel>
                        <FormControl>
                        <Slider
                            min={0}
                            max={10}
                            step={1}
                            value={[painValue]}
                            onValueChange={(value) => field.onChange(value[0])}
                            rangeClassName={colors.range}
                            thumbClassName={colors.thumb}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                <FormField control={form.control} name="dor_fatores" render={({ field }) => ( <FormItem><FormLabel>Fatores que Aliviam/Pioram a Dor</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-medium mb-2">Sinais de Inflamação</h5>
                    <div className="space-y-2">
                      <FormField control={form.control} name="inflamacao_rubor" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Rubor</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="inflamacao_calor" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Calor</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="inflamacao_edema" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Edema</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="inflamacao_dor_local" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Dor Local</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="inflamacao_perda_funcao" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Perda de Função</FormLabel></FormItem> )} />
                    </div>
                  </div>
                   <div>
                    <h5 className="font-medium mb-2">Sinais de Infecção Local</h5>
                    <div className="space-y-2">
                       <FormField control={form.control} name="infeccao_eritema_perilesional" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Eritema Perilesional</FormLabel></FormItem> )} />
                       <FormField control={form.control} name="infeccao_calor_local" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Calor Local</FormLabel></FormItem> )} />
                       <FormField control={form.control} name="infeccao_edema" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Edema</FormLabel></FormItem> )} />
                       <FormField control={form.control} name="infeccao_dor_local" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Dor Local</FormLabel></FormItem> )} />
                       <FormField control={form.control} name="infeccao_exsudato" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Exsudato Purulento</FormLabel></FormItem> )} />
                       <FormField control={form.control} name="infeccao_odor" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Odor Fétido</FormLabel></FormItem> )} />
                       <FormField control={form.control} name="infeccao_retardo_cicatrizacao" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Retardo na Cicatrização</FormLabel></FormItem> )} />
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <FormField control={form.control} name="cultura_realizada" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Cultura da Ferida Realizada?</FormLabel></FormItem> )} />
                  {watch.cultura_realizada && <FormField control={form.control} name="resultado_cultura" render={({ field }) => ( <FormItem><FormLabel>Resultado da Cultura</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold"><Droplets className="mr-2 text-primary" /> M - Umidade (Exsudato)</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2 border-l-2 border-primary/20">
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="quantidade_exsudato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ausente">Ausente</SelectItem>
                          <SelectItem value="Escasso">Escasso</SelectItem>
                          <SelectItem value="Pequeno">Pequeno</SelectItem>
                          <SelectItem value="Moderado">Moderado</SelectItem>
                          <SelectItem value="Abundante">Abundante</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo_exsudato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Seroso">Seroso</SelectItem>
                          <SelectItem value="Sanguinolento">Sanguinolento</SelectItem>
                          <SelectItem value="Serossanguinolento">Serossanguinolento</SelectItem>
                          <SelectItem value="Purulento">Purulento</SelectItem>
                          <SelectItem value="Seropurulento">Seropurulento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="consistencia_exsudato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consistência</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fina">Fina</SelectItem>
                          <SelectItem value="Viscosa">Viscosa</SelectItem>
                          <SelectItem value="Espessa">Espessa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold"><Ruler className="mr-2 text-primary" /> E - Bordas (Edge)</AccordionTrigger>
            <AccordionContent className="space-y-6 p-2 border-l-2 border-primary/20">
               <div className="space-y-4">
                  <h4 className="font-semibold text-md">Bordas da Ferida</h4>
                   <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bordas_caracteristicas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Características das Bordas</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Regulares">Regulares</SelectItem>
                                <SelectItem value="Irregulares">Irregulares</SelectItem>
                                <SelectItem value="Elevadas">Elevadas</SelectItem>
                                <SelectItem value="Maceradas">Maceradas</SelectItem>
                                <SelectItem value="Epitelizadas">Epitelizadas</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fixacao_bordas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fixação das Bordas</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Aderidas">Aderidas</SelectItem>
                                <SelectItem value="Não Aderidas">Não Aderidas</SelectItem>
                                <SelectItem value="Descoladas">Descoladas</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="velocidade_cicatrizacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Velocidade de Cicatrização</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Rápida">Rápida</SelectItem>
                                <SelectItem value="Moderada">Moderada</SelectItem>
                                <SelectItem value="Lenta">Lenta</SelectItem>
                                <SelectItem value="Estagnada">Estagnada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   </div>
                   <div className="grid md:grid-cols-2 gap-4 pt-2">
                     <FormField control={form.control} name="tunel_cavidade" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Presença de Túneis ou Cavidade?</FormLabel></FormItem> )} />
                     {watch.tunel_cavidade && <FormField control={form.control} name="localizacao_tunel_cavidade" render={({ field }) => ( <FormItem><FormLabel>Localização</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />}
                   </div>
               </div>
                <Separator />
               <div className="space-y-4">
                  <h4 className="font-semibold text-md">Pele Perilesional</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="pele_perilesional_umidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Umidade da Pele</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Seca">Seca</SelectItem>
                                <SelectItem value="Hidratada">Hidratada</SelectItem>
                                <SelectItem value="Macerada">Macerada</SelectItem>
                                <SelectItem value="Edemaciada">Edemaciada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     <FormField control={form.control} name="pele_perilesional_extensao" render={({ field }) => ( <FormItem><FormLabel>Extensão da Alteração</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <h5 className="font-medium mb-2 pt-2">Condição da Pele</h5>
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <FormField control={form.control} name="pele_perilesional_integra" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Íntegra</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="pele_perilesional_eritematosa" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Eritematosa</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="pele_perilesional_macerada" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Macerada</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="pele_perilesional_seca_descamativa" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Seca e Descamativa</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="pele_perilesional_eczematosa" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Eczematosa</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="pele_perilesional_hiperpigmentada" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Hiperpigmentada</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="pele_perilesional_hipopigmentada" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Hipopigmentada</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="pele_perilesional_indurada" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Indurada</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="pele_perilesional_sensivel" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Sensível</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="pele_perilesional_edema" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Edema</FormLabel></FormItem> )} />
                   </div>
               </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-semibold"><RedoDot className="mr-2 text-primary" /> R - Reparo e Recomendações</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2 border-l-2 border-primary/20">
              <FormField control={form.control} name="observacoes" render={({ field }) => ( <FormItem><FormLabel>Observações e Plano de Tratamento</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem> )} />
               <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="data_consulta" render={({ field }) => ( <FormItem><FormLabel>Data da Consulta</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="hora_consulta" render={({ field }) => ( <FormItem><FormLabel>Hora da Consulta</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="profissional_responsavel" render={({ field }) => ( <FormItem><FormLabel>Profissional Responsável</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="coren" render={({ field }) => ( <FormItem><FormLabel>COREN/CRM</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="data_retorno" render={({ field }) => ( <FormItem><FormLabel>Data de Retorno</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-semibold"><Info className="mr-2 text-primary" /> S - Fatores Sociais e Histórico do Paciente</AccordionTrigger>
            <AccordionContent className="space-y-6 p-2 border-l-2 border-primary/20">
              <div className="space-y-4">
                <h4 className="font-semibold text-md">Fatores Sociais e de Autocuidado</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="nivel_atividade" render={({ field }) => ( <FormItem><FormLabel>Nível de Atividade</FormLabel><FormControl><Input placeholder="Ex: Acamado, Ativo" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="compreensao_adesao" render={({ field }) => ( <FormItem><FormLabel>Compreensão e Adesão</FormLabel><FormControl><Input placeholder="Ex: Boa, Regular, Baixa" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <FormField control={form.control} name="suporte_social" render={({ field }) => ( <FormItem><FormLabel>Suporte Social e Cuidadores</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
              <Separator />
               <h4 className="font-semibold text-md">Hábitos e Histórico Pessoal</h4>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  <FormField control={form.control} name="pratica_atividade_fisica" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Pratica atividade física?</FormLabel></FormItem> )} />
                  {watch.pratica_atividade_fisica && <div className="col-span-2 grid md:grid-cols-2 gap-4"><FormField control={form.control} name="qual_atividade" render={({ field }) => ( <FormItem><FormLabel>Qual atividade?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} /> <FormField control={form.control} name="frequencia_atividade" render={({ field }) => ( <FormItem><FormLabel>Frequência</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} /></div>}
                  <FormField control={form.control} name="ingestao_alcool" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Ingere álcool?</FormLabel></FormItem> )} />
                  {watch.ingestao_alcool && <FormField control={form.control} name="frequencia_alcool" render={({ field }) => ( <FormItem><FormLabel>Frequência</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />}
                  <FormField control={form.control} name="fumante" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>É fumante?</FormLabel></FormItem> )} />
                </div>
                <Separator />
                <h4 className="font-semibold text-md">Estado Nutricional</h4>
                <FormField control={form.control} name="estado_nutricional" render={({ field }) => ( <FormItem><FormLabel>Avaliação Nutricional</FormLabel><FormControl><Textarea placeholder="Alimentação, peso, etc." {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="ingestao_agua_dia" render={({ field }) => ( <FormItem><FormLabel>Ingestão de Água por Dia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-lg font-semibold"><Stethoscope className="mr-2 text-primary" /> Histórico Clínico e Comorbidades</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2 border-l-2 border-primary/20">
              <FormField control={form.control} name="objetivo_tratamento" render={({ field }) => ( <FormItem><FormLabel>Objetivo do Tratamento</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="historico_cicrizacao" render={({ field }) => ( <FormItem><FormLabel>Histórico de Cicatrização</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                <FormField control={form.control} name="possui_alergia" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Possui alergia?</FormLabel></FormItem> )} />
                {watch.possui_alergia && <FormField control={form.control} name="qual_alergia" render={({ field }) => ( <FormItem><FormLabel>Qual alergia?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />}
                <FormField control={form.control} name="realizou_cirurgias" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Realizou cirurgias?</FormLabel></FormItem> )} />
                {watch.realizou_cirurgias && <div className="col-span-2"><FormField control={form.control} name="quais_cirurgias" render={({ field }) => ( <FormItem><FormLabel>Quais cirurgias?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} /></div>}
              </div>
              <Separator />
              <h4 className="font-semibold text-md">Função Vascular</h4>
              <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="claudicacao_intermitente" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Claudicação Intermitente</FormLabel></FormItem> )} />
                  <FormField control={form.control} name="dor_repouso" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Dor em Repouso</FormLabel></FormItem> )} />
              </div>
              <FormField control={form.control} name="pulsos_perifericos" render={({ field }) => ( <FormItem><FormLabel>Pulsos Periféricos</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
               <Separator />
                <h4 className="font-semibold text-md">Comorbidades</h4>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <FormField control={form.control} name="dmi" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>DMI</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="dmii" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>DMII</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="has" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>HAS</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="neoplasia" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Neoplasia</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="hiv_aids" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>HIV/AIDS</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="obesidade" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Obesidade</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="cardiopatia" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Cardiopatia</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="dpoc" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>DPOC</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="doenca_hematologica" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Doença Hematológica</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="doenca_vascular" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Doença Vascular</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="demencia_senil" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Demência Senil</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="insuficiencia_renal" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Insuficiência Renal</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="hanseniase" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Hanseníase</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="insuficiencia_hepatica" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Insuficiência Hepática</FormLabel></FormItem> )} />
                      <FormField control={form.control} name="doenca_autoimune" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Doença Autoimune</FormLabel></FormItem> )} />
                  </div>
                  <FormField control={form.control} name="outros_hpp" render={({ field }) => ( <FormItem><FormLabel>Outras Condições</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <Separator />
                <h4 className="font-semibold text-md">Medicamentos em Uso</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    <div className="space-y-2"><FormField control={form.control} name="anti_hipertensivo" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Anti-hipertensivo</FormLabel></FormItem> )} /> {renderMedicationFields("anti_hipertensivo")}</div>
                    <div className="space-y-2"><FormField control={form.control} name="corticoides" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Corticoides</FormLabel></FormItem> )} /> {renderMedicationFields("corticoides")}</div>
                    <div className="space-y-2"><FormField control={form.control} name="hipoglicemiantes_orais" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Hipoglicemiantes Orais</FormLabel></FormItem> )} /> {renderMedicationFields("hipoglicemiantes_orais")}</div>
                    <div className="space-y-2"><FormField control={form.control} name="aines" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>AINES</FormLabel></FormItem> )} /> {renderMedicationFields("aines")}</div>
                    <div className="space-y-2"><FormField control={form.control} name="insulina" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Insulina</FormLabel></FormItem> )} /> {renderMedicationFields("insulina")}</div>
                    <div className="space-y-2"><FormField control={form.control} name="drogas_vasoativa" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Drogas Vasoativas</FormLabel></FormItem> )} /> {renderMedicationFields("drogas_vasoativa")}</div>
                    <div className="space-y-2"><FormField control={form.control} name="suplemento" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Suplemento</FormLabel></FormItem> )} /> {renderMedicationFields("suplemento")}</div>
                    <div className="space-y-2"><FormField control={form.control} name="anticoagulante" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Anticoagulante</FormLabel></FormItem> )} /> {renderMedicationFields("anticoagulante")}</div>
                    <div className="space-y-2"><FormField control={form.control} name="vitaminico" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Vitamínico</FormLabel></FormItem> )} /> {renderMedicationFields("vitaminico")}</div>
                    <div className="space-y-2"><FormField control={form.control} name="antirretroviral" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Antirretroviral</FormLabel></FormItem> )} /> {renderMedicationFields("antirretroviral")}</div>
                </div>
                 <FormField control={form.control} name="outros_medicamento" render={({ field }) => ( <FormItem><FormLabel>Outros Medicamentos</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="flex flex-wrap gap-4">
            <Button type="submit" className="w-full sm:w-auto">
              {isEditMode ? "Atualizar Avaliação" : "Salvar Avaliação"}
            </Button>
            {isEditMode && (
              <Button type="button" variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Criar Nova Avaliação
              </Button>
            )}
        </div>
      </form>
    </Form>
  );
}
