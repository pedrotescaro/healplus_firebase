import * as React from "react";
import type { AnamnesisFormValues } from "@/lib/anamnesis-schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import Image from "next/image";

interface AnamnesisDetailsViewProps {
  record: AnamnesisFormValues;
}

const DetailItem = ({ label, value }: { label: string, value: any }) => {
  if (value === undefined || value === null || value === '' || value === false || (Array.isArray(value) && value.length === 0)) {
    return null;
  }
  const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value);
  const formattedLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <strong className="text-muted-foreground">{formattedLabel}:</strong>
      <span>{displayValue}</span>
    </div>
  );
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const validChildren = React.Children.toArray(children).filter(child => child !== null);
    if (validChildren.length === 0) {
        return null;
    }
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
                {validChildren}
            </CardContent>
        </Card>
    )
};


export function AnamnesisDetailsView({ record }: AnamnesisDetailsViewProps) {
    const personalDataKeys: (keyof AnamnesisFormValues)[] = ['data_nascimento', 'telefone', 'email', 'profissao', 'estado_civil'];
    const socialDataKeys: (keyof AnamnesisFormValues)[] = ['nivel_atividade', 'suporte_social', 'compreensao_adesao', 'fumante', 'ingestao_alcool', 'frequencia_alcool', 'pratica_atividade_fisica', 'qual_atividade', 'frequencia_atividade', 'estado_nutricional', 'ingestao_agua_dia'];
    const clinicalDataKeys: (keyof AnamnesisFormValues)[] = ['objetivo_tratamento', 'historico_cicrizacao', 'possui_alergia', 'qual_alergia', 'realizou_cirurgias', 'quais_cirurgias', 'claudicacao_intermitente', 'dor_repouso', 'pulsos_perifericos'];
    const comorbidityKeys: (keyof AnamnesisFormValues)[] = ['dmi', 'dmii', 'has', 'neoplasia', 'hiv_aids', 'obesidade', 'cardiopatia', 'dpoc', 'doenca_hematologica', 'doenca_vascular', 'demencia_senil', 'insuficiencia_renal', 'hanseniase', 'insuficiencia_hepatica', 'doenca_autoimune', 'outros_hpp'];
    const medicationKeys: (keyof AnamnesisFormValues)[] = ['anti_hipertensivo_nome','anti_hipertensivo_dose','corticoides_nome','corticoides_dose','hipoglicemiantes_orais_nome','hipoglicemiantes_orais_dose','aines_nome','aines_dose','insulina_nome','insulina_dose','drogas_vasoativa_nome','drogas_vasoativa_dose','suplemento_nome','suplemento_dose','anticoagulante_nome','anticoagulante_dose','vitaminico_nome','vitaminico_dose','antirretroviral_nome','antirretroviral_dose','outros_medicamento'];
    const woundDetailsKeys: (keyof AnamnesisFormValues)[] = ['ferida_largura', 'ferida_comprimento', 'ferida_profundidade', 'localizacao_ferida', 'etiologia_ferida', 'etiologia_outra', 'tempo_evolucao'];
    const tissueKeys: (keyof AnamnesisFormValues)[] = ['percentual_granulacao_leito', 'percentual_epitelizacao_leito', 'percentual_esfacelo_leito', 'percentual_necrose_seca_leito'];
    const infectionKeys: (keyof AnamnesisFormValues)[] = ['dor_escala', 'dor_fatores', 'inflamacao_rubor', 'inflamacao_calor', 'inflamacao_edema', 'inflamacao_dor_local', 'inflamacao_perda_funcao', 'infeccao_eritema_perilesional', 'infeccao_calor_local', 'infeccao_edema', 'infeccao_dor_local', 'infeccao_exsudato', 'infeccao_odor', 'infeccao_retardo_cicatrizacao', 'resultado_cultura'];
    const moistureKeys: (keyof AnamnesisFormValues)[] = ['quantidade_exsudato', 'tipo_exsudato', 'consistencia_exsudato'];
    const edgeKeys: (keyof AnamnesisFormValues)[] = ['bordas_caracteristicas', 'fixacao_bordas', 'velocidade_cicatrizacao', 'localizacao_tunel_cavidade', 'pele_perilesional_umidade', 'pele_perilesional_extensao', 'pele_perilesional_integra', 'pele_perilesional_eritematosa', 'pele_perilesional_macerada', 'pele_perilesional_seca_descamativa', 'pele_perilesional_eczematosa', 'pele_perilesional_hiperpigmentada', 'pele_perilesional_hipopigmentada', 'pele_perilesional_indurada', 'pele_perilesional_sensivel', 'pele_perilesional_edema'];
    const repairKeys: (keyof AnamnesisFormValues)[] = ['observacoes', 'profissional_responsavel', 'coren', 'data_retorno'];


  return (
    <div className="space-y-4 p-4">
        <Section title="Dados Pessoais">
            {personalDataKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
        </Section>
        <Section title="T - Tecido">
             {record.woundImageUri && (
                <div className="mb-4">
                    <h3 className="font-semibold text-sm mb-2 text-center text-muted-foreground">Imagem da Ferida</h3>
                     <div className="relative w-full max-w-sm mx-auto aspect-square">
                        <Image
                            src={record.woundImageUri}
                            alt={`Wound for ${record.nome_cliente}`}
                            layout="fill"
                            className="rounded-md object-contain"
                            data-ai-hint="wound"
                        />
                    </div>
                </div>
            )}
            {woundDetailsKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
            <Separator className="my-3"/>
            {tissueKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
        </Section>
        <Section title="I - Infecção e Inflamação">
            {infectionKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
        </Section>
        <Section title="M - Umidade (Exsudato)">
            {moistureKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
        </Section>
        <Section title="E - Bordas (Edge)">
            {edgeKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
        </Section>
        <Section title="R - Reparo e Recomendações">
            {repairKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
        </Section>
        <Section title="S - Fatores Sociais e do Paciente">
            {socialDataKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
        </Section>
        <Section title="Histórico Clínico e Comorbidades">
            {clinicalDataKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
             <Separator className="my-3"/>
            <p className="text-sm font-medium text-foreground">Comorbidades</p>
            {comorbidityKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
        </Section>
         <Section title="Medicamentos em Uso">
            {medicationKeys.map(key => <DetailItem key={key} label={key} value={record[key]} />)}
        </Section>
    </div>
  );
}
