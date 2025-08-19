"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { WoundBedProgress } from "./wound-bed-progress";

export function AnamnesisForm() {
  const { toast } = useToast();
  const form = useForm<AnamnesisFormValues>({
    resolver: zodResolver(anamnesisFormSchema),
    defaultValues: {
      // Initialize boolean fields to false
      usa_medicacao: false, possui_doenca: false, possui_alergia: false,
      pratica_atividade_fisica: false, ingestao_alcool: false, tem_filhos: false,
      realizou_cirurgias: false, claudicacao_intermitente: false, dor_repouso: false,
      fumante: false, dmi: false, dmii: false, has: false, neoplasia: false,
      hiv_aids: false, obesidade: false, cardiopatia: false, dpoc: false,
      doenca_hematologica: false, doenca_vascular: false, demencia_senil: false,
      insuficiencia_renal: false, hanseniase: false, insuficiencia_hepatica: false,
      doenca_autoimune: false, anti_hipertensivo: false, corticoides: false,
      hipoglicemiantes_orais: false, aines: false, insulina: false,
      drogas_vasoativa: false, suplemento: false, anticoagulante: false,
      vitaminico: false, antirretroviral: false, inflamacao_rubor: false,
      inflamacao_calor: false, inflamacao_edema: false, inflamacao_dor_local: false,
      inflamacao_perda_funcao: false, infeccao_eritema_perilesional: false,
      infeccao_calor_local: false, infeccao_edema: false, infeccao_dor_local: false,
      infeccao_exsudato: false, infeccao_odor: false, infeccao_retardo_cicatrizacao: false,
      cultura_realizada: false, tunel_cavidade: false, pele_perilesional_integra: false,
      pele_perilesional_eritematosa: false, pele_perilesional_macerada: false,
      pele_perilesional_seca_descamativa: false, pele_perilesional_eczematosa: false,
      pele_perilesional_hiperpigmentada: false, pele_perilesional_hipopigmentada: false,
      pele_perilesional_indurada: false, pele_perilesional_sensivel: false,
      pele_perilesional_edema: false,
      data_consulta: new Date().toISOString().split('T')[0], // default to today
      hora_consulta: new Date().toTimeString().slice(0, 5), // default to now
      percentual_granulacao_leito: 0,
      percentual_epitelizacao_leito: 0,
      percentual_esfacelo_leito: 0,
      percentual_necrose_seca_leito: 0,
    },
  });

  const watch = form.watch();

  const tissueData = [
    { name: "percentual_granulacao_leito" as const, value: watch.percentual_granulacao_leito || 0 },
    { name: "percentual_epitelizacao_leito" as const, value: watch.percentual_epitelizacao_leito || 0 },
    { name: "percentual_esfacelo_leito" as const, value: watch.percentual_esfacelo_leito || 0 },
    { name: "percentual_necrose_seca_leito" as const, value: watch.percentual_necrose_seca_leito || 0 },
  ];

  function onSubmit(data: AnamnesisFormValues) {
    const totalPercentage = data.percentual_granulacao_leito + data.percentual_epitelizacao_leito + data.percentual_esfacelo_leito + data.percentual_necrose_seca_leito;
    if (totalPercentage > 100) {
      toast({
        title: "Percentual Inválido",
        description: `A soma dos percentuais do leito da ferida não pode exceder 100%. Total atual: ${totalPercentage}%.`,
        variant: "destructive",
      });
      return;
    }
    console.log(data);
    toast({
      title: "Formulário Enviado",
      description: "A ficha de anamnese foi salva com sucesso.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
          
          {/* Dados Pessoais */}
          <AccordionItem value="item-1">
            <AccordionTrigger>Dados Pessoais</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="nome_cliente" render={({ field }) => ( <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="data_nascimento" render={({ field }) => ( <FormItem><FormLabel>Data de Nascimento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="telefone" render={({ field }) => ( <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="profissao" render={({ field }) => ( <FormItem><FormLabel>Profissão</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="estado_civil" render={({ field }) => ( <FormItem><FormLabel>Estado Civil</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="nivel_atividade" render={({ field }) => ( <FormItem><FormLabel>Nível de Atividade</FormLabel><FormControl><Input placeholder="Ex: Acamado, Ativo" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="compreensao_adesao" render={({ field }) => ( <FormItem><FormLabel>Compreensão e Adesão</FormLabel><FormControl><Input placeholder="Ex: Boa, Regular, Baixa" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
              <FormField control={form.control} name="suporte_social" render={({ field }) => ( <FormItem><FormLabel>Suporte Social e Cuidadores</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
            </AccordionContent>
          </AccordionItem>

          {/* Dados Clínicos */}
          <AccordionItem value="item-2">
            <AccordionTrigger>Dados Clínicos</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              <FormField control={form.control} name="objetivo_tratamento" render={({ field }) => ( <FormItem><FormLabel>Objetivo do Tratamento</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="historico_cicatrizacao" render={({ field }) => ( <FormItem><FormLabel>Histórico de Cicatrização</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="estado_nutricional" render={({ field }) => ( <FormItem><FormLabel>Estado Nutricional</FormLabel><FormControl><Textarea placeholder="Alimentação, peso, etc." {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="ingestao_agua_dia" render={({ field }) => ( <FormItem><FormLabel>Ingestão de Água por Dia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                <FormField control={form.control} name="usa_medicacao" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Usa medicação?</FormLabel></FormItem> )} />
                {watch.usa_medicacao && <FormField control={form.control} name="qual_medicacao" render={({ field }) => ( <FormItem><FormLabel>Qual medicação?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />}
                <FormField control={form.control} name="possui_doenca" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Possui doença?</FormLabel></FormItem> )} />
                {watch.possui_doenca && <FormField control={form.control} name="qual_doenca" render={({ field }) => ( <FormItem><FormLabel>Qual doença?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />}
                <FormField control={form.control} name="possui_alergia" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Possui alergia?</FormLabel></FormItem> )} />
                {watch.possui_alergia && <FormField control={form.control} name="qual_alergia" render={({ field }) => ( <FormItem><FormLabel>Qual alergia?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />}
                <FormField control={form.control} name="pratica_atividade_fisica" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Pratica atividade física?</FormLabel></FormItem> )} />
                {watch.pratica_atividade_fisica && <>
                  <FormField control={form.control} name="qual_atividade" render={({ field }) => ( <FormItem><FormLabel>Qual atividade?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="frequencia_atividade" render={({ field }) => ( <FormItem><FormLabel>Frequência</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </>}
                <FormField control={form.control} name="ingestao_alcool" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Ingere álcool?</FormLabel></FormItem> )} />
                {watch.ingestao_alcool && <FormField control={form.control} name="frequencia_alcool" render={({ field }) => ( <FormItem><FormLabel>Frequência</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />}
                <FormField control={form.control} name="tem_filhos" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Tem filhos?</FormLabel></FormItem> )} />
                {watch.tem_filhos && <FormField control={form.control} name="quantos_filhos" render={({ field }) => ( <FormItem><FormLabel>Quantos?</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />}
                <FormField control={form.control} name="realizou_cirurgias" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Realizou cirurgias?</FormLabel></FormItem> )} />
                {watch.realizou_cirurgias && <FormField control={form.control} name="quais_cirurgias" render={({ field }) => ( <FormItem><FormLabel>Quais cirurgias?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />}
                <FormField control={form.control} name="fumante" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>É fumante?</FormLabel></FormItem> )} />
              </div>
              <Separator />
              <h4 className="font-semibold">Função Vascular</h4>
              <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="claudicacao_intermitente" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Claudicação Intermitente</FormLabel></FormItem> )} />
                  <FormField control={form.control} name="dor_repouso" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Dor em Repouso</FormLabel></FormItem> )} />
              </div>
              <FormField control={form.control} name="pulsos_perifericos" render={({ field }) => ( <FormItem><FormLabel>Pulsos Periféricos</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            </AccordionContent>
          </AccordionItem>

          {/* HPP e Comorbidades */}
          <AccordionItem value="item-3">
              <AccordionTrigger>HPP e Comorbidades</AccordionTrigger>
              <AccordionContent className="p-1">
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
                  <div className="mt-4">
                      <FormField control={form.control} name="outros_hpp" render={({ field }) => ( <FormItem><FormLabel>Outros</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
              </AccordionContent>
          </AccordionItem>

          {/* Avaliação da Ferida */}
          <AccordionItem value="item-4">
            <AccordionTrigger>Avaliação da Ferida</AccordionTrigger>
            <AccordionContent className="space-y-6 p-1">
              <div>
                <h4 className="font-semibold mb-2">Tamanho e Características</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="ferida_largura" render={({ field }) => ( <FormItem><FormLabel>Largura (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="ferida_comprimento" render={({ field }) => ( <FormItem><FormLabel>Comprimento (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="ferida_profundidade" render={({ field }) => ( <FormItem><FormLabel>Profundidade (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
              </div>
              <Separator />
               <div>
                  <h4 className="font-semibold mb-2">Localização e Evolução</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="localizacao_ferida" render={({ field }) => ( <FormItem><FormLabel>Localização</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="tempo_evolucao" render={({ field }) => ( <FormItem><FormLabel>Tempo de Evolução</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="etiologia_ferida" render={({ field }) => ( <FormItem><FormLabel>Etiologia</FormLabel><FormControl><Input placeholder="Ex: Pressão, Vascular" {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="etiologia_outra" render={({ field }) => ( <FormItem><FormLabel>Outra Etiologia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
              </div>
              <Separator />
               <div>
                  <h4 className="font-semibold mb-2">Leito da Ferida (%)</h4>
                  <div className="mb-4">
                    <WoundBedProgress data={tissueData} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField control={form.control} name="percentual_granulacao_leito" render={({ field }) => ( <FormItem><FormLabel>Granulação</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="percentual_epitelizacao_leito" render={({ field }) => ( <FormItem><FormLabel>Epitelização</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="percentual_esfacelo_leito" render={({ field }) => ( <FormItem><FormLabel>Esfacelo</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="percentual_necrose_seca_leito" render={({ field }) => ( <FormItem><FormLabel>Necrose Seca</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
              </div>
              <Separator />
              <div>
                  <h4 className="font-semibold mb-2">Exsudato</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                      <FormField control={form.control} name="quantidade_exsudato" render={({ field }) => ( <FormItem><FormLabel>Quantidade</FormLabel><FormControl><Input placeholder="Ausente, Escasso..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="tipo_exsudato" render={({ field }) => ( <FormItem><FormLabel>Tipo</FormLabel><FormControl><Input placeholder="Seroso, Purulento..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="consistencia_exsudato" render={({ field }) => ( <FormItem><FormLabel>Consistência</FormLabel><FormControl><Input placeholder="Fina, Viscosa..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Informações Adicionais */}
          <AccordionItem value="item-5">
            <AccordionTrigger>Informações Adicionais e Responsável</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              <FormField control={form.control} name="observacoes" render={({ field }) => ( <FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem> )} />
               <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="data_consulta" render={({ field }) => ( <FormItem><FormLabel>Data da Consulta</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="hora_consulta" render={({ field }) => ( <FormItem><FormLabel>Hora da Consulta</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="profissional_responsavel" render={({ field }) => ( <FormItem><FormLabel>Profissional Responsável</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="coren" render={({ field }) => ( <FormItem><FormLabel>COREN/CRM</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        <Button type="submit" className="w-full md:w-auto">Salvar Anamnese</Button>
      </form>
    </Form>
  );
}
