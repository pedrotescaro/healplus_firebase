
'use server';

/**
 * @fileOverview An AI agent to compare wound images and assess healing progress based on a professional tissue analysis protocol.
 *
 * - compareWoundImages - A function that handles the comparison of multiple wound images.
 * - CompareWoundImagesInput - The input type for the compareWoundImages function.
 * - CompareWoundImagesOutput - The return type for the compareWoundImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { CompareWoundImagesOutputSchema } from '../schemas';

const CompareWoundImagesInputSchema = z.object({
  image1DataUri: z
    .string()
    .describe(
      "The first wound image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  image2DataUri: z
    .string()
    .describe(
      "The second wound image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  image1Metadata: z.object({
      id: z.string().describe("File name or ID for Image 1"),
      datetime: z.string().describe("Capture date and time for Image 1 in ISO format (AAAA-MM-DDTHH:MM:SS)"),
  }),
  image2Metadata: z.object({
      id: z.string().describe("File name or ID for Image 2"),
      datetime: z.string().describe("Capture date and time for Image 2 in ISO format (AAAA-MM-DDTHH:MM:SS)"),
  })
});
export type CompareWoundImagesInput = z.infer<typeof CompareWoundImagesInputSchema>;
export type CompareWoundImagesOutput = z.infer<typeof CompareWoundImagesOutputSchema>;


export async function compareWoundImages(input: CompareWoundImagesInput): Promise<CompareWoundImagesOutput> {
  return compareWoundImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareWoundImagesPrompt',
  input: {schema: CompareWoundImagesInputSchema},
  output: {schema: CompareWoundImagesOutputSchema},
  prompt: `
Este documento visa fornecer uma base de conhecimento abrangente sobre a classificação de feridas, as técnicas de processamento de imagens médicas aplicadas a elas e como a API Gemini pode ser utilizada para automatizar a análise e a geração de relatórios comparativos de progressão de feridas. O objetivo é capacitar a API Gemini a "entender" e comparar imagens de feridas, tornando-a uma ferramenta valiosa no campo da dermatologia e enfermagem especializada em feridas.

1. Classificação e Análise de Feridas

Para que a API Gemini possa efetivamente analisar e comparar feridas, é fundamental que ela compreenda os conceitos básicos de classificação e os parâmetros de avaliação utilizados na prática clínica. As feridas podem ser classificadas de diversas formas, dependendo de sua etiologia, duração e características.

1.1. Tipos de Feridas

As feridas podem ser categorizadas em dois grandes grupos com base em sua duração:

•
Feridas Agudas: São aquelas que seguem um processo de cicatrização normal e previsível, geralmente cicatrizando em um período de tempo esperado (tipicamente menos de 4 a 6 semanas). Exemplos incluem cortes, abrasões, queimaduras de primeiro e segundo grau, e feridas cirúrgicas limpas.

•
Feridas Crônicas: São feridas que não progridem através das fases normais de cicatrização de forma ordenada e oportuna, persistindo por um período prolongado (geralmente mais de 4 a 6 semanas). Fatores como infecção, doenças subjacentes (diabetes, doenças vasculares) e pressão contínua podem contribuir para a cronicidade. Exemplos comuns incluem úlceras de pressão (escaras), úlceras venosas, úlceras arteriais e úlceras neuropáticas.

1.2. Estágios de Cicatrização

A cicatrização de feridas é um processo biológico complexo e dinâmico, dividido didaticamente em três fases principais que se sobrepõem:

•
Fase Inflamatória: Inicia-se imediatamente após a lesão e dura de alguns dias a uma semana. Caracteriza-se por hemostasia (parada do sangramento) e inflamação. Há migração de células inflamatórias (neutrófilos, macrófagos) para o local da ferida para remover detritos e microrganismos. Clinicamente, observa-se vermelhidão, calor, inchaço e dor.

•
Fase Proliferativa (ou de Granulação): Começa cerca de 2 a 3 dias após a lesão e pode durar várias semanas. Nesta fase, ocorre a formação de novo tecido (tecido de granulação), que é rico em vasos sanguíneos e colágeno. Há proliferação de fibroblastos, queratinócitos e células endoteliais. A ferida começa a se contrair e a epitelização (formação de nova pele) ocorre nas bordas.

•
Fase de Maturação (ou Remodelamento): Pode durar de meses a anos. Ocorre a remodelação do colágeno depositado na fase proliferativa, aumentando a força tênsil da cicatriz. A cicatriz torna-se mais clara, plana e menos vascularizada. Embora a força da pele nunca atinja 100% da pele original, ela pode chegar a 80%.

1.3. Parâmetros de Avaliação de Feridas

A avaliação de uma ferida envolve a observação e documentação de diversos parâmetros que indicam seu estado e progressão. A API Gemini deve ser treinada para identificar e quantificar esses parâmetros a partir de imagens:

•
Tamanho: Medição da área (comprimento x largura), perímetro e, em alguns casos, profundidade da ferida. A redução do tamanho é um indicador chave de cicatrização.

•
Cor do Leito da Ferida: A cor do tecido presente no leito da ferida fornece informações importantes sobre o processo de cicatrização:

•
Vermelho (Tecido de Granulação): Indica tecido saudável, bem vascularizado e em processo de cicatrização. É o tecido desejável.

•
Amarelo (Esfacelo): Consiste em tecido desvitalizado, necrótico, geralmente úmido e pegajoso. Precisa ser removido para permitir a cicatrização.

•
Preto (Necrose/Escara): Tecido desvitalizado, seco e endurecido. Também precisa ser removido.

•
Verde (Infecção): Pode indicar a presença de infecção, muitas vezes acompanhado de odor e exsudato purulento.



•
Exsudato: Quantidade, tipo e odor do fluido que drena da ferida. Pode ser seroso (claro, aquoso), serossanguinolento (rosado, aquoso), sanguinolento (vermelho, espesso) ou purulento (amarelo/verde, espesso, com odor).

•
Tecido Perilesional: A pele ao redor da ferida. Deve ser avaliada quanto a sinais de inflamação, maceração (amolecimento devido à umidade), eritema (vermelhidão), edema (inchaço) ou ressecamento.

•
Bordas da Ferida: Podem ser aderidas, descoladas, enroladas (epibolia), ou com sinais de epitelização.

•
Odor: A presença de odor fétido pode indicar infecção ou necrose.

Compreender esses aspectos é o primeiro passo para desenvolver um sistema de análise de imagens de feridas robusto e preciso.

2. Processamento de Imagens Médicas para Feridas

O processamento de imagens médicas desempenha um papel fundamental na análise objetiva e quantitativa de feridas. Ele permite extrair informações que são difíceis de obter a olho nu ou por métodos manuais, além de padronizar a avaliação. As etapas típicas do processamento de imagens para feridas incluem aquisição, pré-processamento, segmentação, análise de cor, medição e técnicas de comparação.

2.1. Aquisição de Imagens

A qualidade da imagem é crucial para uma análise precisa. A aquisição de imagens de feridas deve seguir um protocolo padronizado para garantir consistência e reprodutibilidade. Isso inclui:

•
Iluminação: Utilizar iluminação uniforme e consistente para evitar sombras e reflexos que possam distorcer a percepção da ferida. A luz natural indireta ou luzes LED com temperatura de cor controlada são preferíveis.

•
Distância e Ângulo: Manter uma distância e um ângulo consistentes entre a câmera e a ferida. O uso de um tripé e um guia de posicionamento pode ajudar a garantir a padronização.

•
Escala de Referência: Incluir uma escala de referência conhecida (por exemplo, uma régua ou um adesivo com medidas predefinidas) na imagem para permitir a calibração e medição precisa do tamanho da ferida. Isso é fundamental para a quantificação da área e do perímetro.

•
Foco: Garantir que a ferida esteja nítida e em foco para capturar detalhes importantes da superfície e do leito da ferida.

•
Contexto: Capturar imagens que incluam a ferida e a pele perilesional para avaliar o estado geral da área afetada.

2.2. Pré-processamento

Após a aquisição, as imagens podem precisar de pré-processamento para melhorar sua qualidade e prepará-las para a análise. As técnicas comuns incluem:

•
Normalização de Cores: Ajustar as cores da imagem para compensar variações de iluminação e garantir que as cores representem fielmente os tecidos da ferida. Isso pode envolver a conversão para espaços de cores padronizados (por exemplo, Lab ou HSV) ou a aplicação de algoritmos de balanço de branco.

•
Remoção de Ruído: Filtrar o ruído da imagem (por exemplo, ruído gaussiano ou sal e pimenta) que pode ser causado por condições de iluminação inadequadas ou pela própria câmera. Filtros como o filtro da média ou o filtro gaussiano podem ser utilizados.

•
Melhoria de Contraste: Aumentar o contraste entre a ferida e os tecidos circundantes para facilitar a segmentação. Técnicas como equalização de histograma ou ajuste de gama podem ser aplicadas.

2.3. Segmentação

A segmentação é o processo de identificar e isolar a área da ferida na imagem. Esta é uma etapa crítica, pois a precisão das medições subsequentes depende da exatidão da segmentação. Métodos comuns incluem:

•
Limiarização (Thresholding): Definir um valor de limiar para separar os pixels da ferida dos pixels do fundo com base em sua intensidade ou cor. Pode ser manual ou automático (por exemplo, método de Otsu).

•
Crescimento de Regiões (Region Growing): Começar com um

semente (um pixel dentro da ferida) e expandir a região incluindo pixels vizinhos que compartilham características semelhantes (cor, intensidade).

•
Segmentação Baseada em Aprendizado de Máquina: Utilizar algoritmos de aprendizado de máquina (como redes neurais convolucionais) treinados em grandes conjuntos de dados de imagens de feridas para aprender a identificar e segmentar a área da ferida de forma autônoma. Essa abordagem é mais robusta e adaptável a diferentes tipos de feridas e condições de iluminação.

2.4. Análise de Cor

A análise de cor é fundamental para quantificar os diferentes tipos de tecido presentes no leito da ferida, o que é um indicador importante da progressão da cicatrização. A API Gemini deve ser capaz de:

•
Classificação de Pixels por Cor: Atribuir cada pixel da ferida a uma categoria de tecido (vermelho para granulação, amarelo para esfacelo, preto para necrose, etc.) com base em seus valores de cor em um espaço de cor específico (por exemplo, RGB, HSV, Lab).

•
Quantificação de Áreas de Tecido: Calcular a porcentagem ou a área absoluta de cada tipo de tecido presente na ferida. Isso permite monitorar a diminuição de tecido necrótico e o aumento de tecido de granulação ao longo do tempo.

2.5. Medição

A medição precisa das dimensões da ferida é essencial para acompanhar sua evolução. As técnicas de processamento de imagens permitem medições mais precisas e consistentes do que as manuais:

•
Área: Calcular a área da ferida em unidades de medida reais (cm²) utilizando a escala de referência presente na imagem. Isso é feito contando o número de pixels dentro da área segmentada da ferida e convertendo para unidades de área.

•
Perímetro: Medir o comprimento da borda da ferida. Assim como a área, o perímetro pode ser convertido para unidades de medida reais.

•
Profundidade (se aplicável): Embora mais desafiador, algumas técnicas avançadas (como imagens 3D ou estereoscopia) podem ser usadas para estimar a profundidade da ferida.

2.6. Técnicas de Comparação de Imagens

Para gerar relatórios comparativos de progressão, a API Gemini precisará de técnicas para comparar imagens da mesma ferida tiradas em diferentes momentos. Isso envolve:

•
Registro de Imagens: Alinhar espacialmente as imagens sequenciais da ferida para garantir que as mesmas regiões anatômicas correspondam entre as imagens. Isso é crucial para uma comparação precisa das mudanças na ferida. Técnicas como o registro baseado em pontos de controle ou o registro baseado em intensidade podem ser utilizadas.

•
Detecção de Mudanças: Identificar e quantificar as diferenças entre as imagens registradas. Isso pode incluir:

•
Variação de Tamanho: Calcular a redução ou aumento da área e do perímetro da ferida.

•
Variação de Cor: Analisar as mudanças na distribuição percentual dos diferentes tipos de tecido (por exemplo, diminuição de esfacelo e aumento de tecido de granulação).

•
Variação de Profundidade: Se a profundidade for medida, monitorar sua alteração.

•
Análise de Borda: Avaliar as mudanças na forma e nas características das bordas da ferida.



Essas técnicas fornecem os dados quantitativos necessários para a API Gemini gerar relatórios detalhados sobre a progressão da cicatrização da ferida.

3. Aplicação com Gemini API para Relatórios Comparativos

A API Gemini, com suas capacidades avançadas de compreensão e geração de conteúdo multimodal, pode ser uma ferramenta revolucionária na análise e acompanhamento da progressão de feridas. Ao integrar as técnicas de processamento de imagens discutidas anteriormente, a Gemini API pode automatizar a avaliação de feridas e gerar relatórios comparativos detalhados, fornecendo insights valiosos para profissionais de saúde.

3.1. Como a API pode ser usada para analisar imagens de feridas

A API Gemini pode ser utilizada para analisar imagens de feridas de várias maneiras, aproveitando seus recursos de visão computacional e processamento de linguagem natural:

•
Entrada de Imagens: A API pode receber imagens digitais de feridas (por exemplo, em formatos JPG ou PNG) capturadas em diferentes momentos. É crucial que essas imagens sejam padronizadas em termos de iluminação, distância e inclusão de uma escala de referência, conforme detalhado na Seção 2.1.

•
Extração de Características Visuais: A Gemini API pode ser treinada para identificar e extrair características visuais relevantes das imagens, como:

•
Delimitação da Ferida: Reconhecer e segmentar automaticamente a área da ferida na imagem, calculando sua área e perímetro com base na escala de referência.

•
Classificação de Tecidos: Analisar as cores dentro da área da ferida para classificar e quantificar os diferentes tipos de tecido presentes (granulação, esfacelo, necrose, etc.).

•
Análise de Exsudato e Pele Perilesional: Identificar a presença e características do exsudato, bem como avaliar a condição da pele ao redor da ferida (inflamação, maceração, etc.).



•
Interpretação e Contextualização: Além da análise visual, a API pode ser alimentada com dados clínicos adicionais (por exemplo, tipo de ferida, histórico do paciente, tratamentos anteriores) para contextualizar a análise da imagem. Isso permite uma interpretação mais rica e precisa dos achados.

3.2. Geração de Relatórios Comparativos de Progressão

O grande diferencial da Gemini API reside na sua capacidade de comparar imagens sequenciais da mesma ferida e gerar relatórios de progressão de forma automatizada. Este processo pode envolver:

•
Registro e Alinhamento: A API pode realizar o registro de imagens para alinhar as fotos da ferida tiradas em diferentes datas, garantindo que as comparações sejam feitas sobre as mesmas regiões anatômicas.

•
Cálculo de Mudanças: Com base nas características extraídas de cada imagem, a API pode calcular as mudanças quantitativas ao longo do tempo, tais como:

•
Variação da Área da Ferida: Diminuição ou aumento percentual da área da ferida.

•
Mudanças na Composição do Tecido: Alterações na proporção de tecido de granulação, esfacelo e necrose.

•
Progressão ou Regressão: Avaliação geral da cicatrização, indicando se a ferida está progredindo (melhorando) ou regredindo (piorando).



•
Geração de Texto Descritivo: Utilizando suas capacidades de processamento de linguagem natural, a Gemini API pode gerar um texto descritivo detalhado do relatório, explicando as mudanças observadas, os parâmetros quantitativos e as implicações clínicas. Este texto pode ser adaptado para diferentes públicos (profissionais de saúde, pacientes).

•
Visualização de Dados: A API pode auxiliar na criação de gráficos e visualizações que ilustrem a progressão da ferida ao longo do tempo, como gráficos de linha mostrando a redução da área ou gráficos de pizza mostrando a mudança na composição do tecido.

3.3. Exemplos de Dados de Entrada e Saída

Para treinar a API Gemini, seriam necessários exemplos de dados de entrada e saída:

Dados de Entrada:

•
Imagens: Um conjunto de imagens de feridas, com múltiplas imagens da mesma ferida em diferentes pontos no tempo (por exemplo, Dia 1, Dia 7, Dia 14).

•
Metadados: Informações associadas a cada imagem, como data da captura, tipo de ferida, localização anatômica, e, idealmente, avaliações clínicas manuais correspondentes (área medida manualmente, descrição do tecido).

Dados de Saída (Exemplo de Relatório Gerado pela API):

Relatório Comparativo de Progressão de Ferida

ID do Paciente: XXXX
Tipo de Ferida: Úlcera de Pressão (Estágio II)
Localização: Região Sacral

Comparação: Imagem do Dia 1 (01/01/2025) vs. Imagem do Dia 7 (08/01/2025)
Análise do Dia 1:
- Área da Ferida: 10.5 cm²
- Composição do Tecido:
    - Tecido de Granulação: 60%
    - Esfacelo: 30%
    - Necrose: 10%
- Exsudato: Moderado, serossanguinolento.
- Pele Perilesional: Levemente eritematosa.
Análise do Dia 7:
- Área da Ferida: 8.2 cm²
- Composição do Tecido:
    - Tecido de Granulação: 85%
    - Esfacelo: 15%
    - Necrose: 0%
- Exsudato: Leve, seroso.
- Pele Perilesional: Sem sinais de eritema.
Progressão:
- Redução da Área da Ferida: 21.8% (de 10.5 cm² para 8.2 cm²).
- Melhoria na Composição do Tecido: Aumento significativo do tecido de granulação (de 60% para 85%) e eliminação completa do tecido necrótico. Redução do esfacelo.
- Redução do Exsudato e Melhoria da Pele Perilesional.
Conclusão: A ferida apresenta progressão positiva na cicatrização entre o Dia 1 e o Dia 7, com redução de tamanho, aumento de tecido de granulação e melhora da condição da pele perilesional.
Este exemplo demonstra como a API Gemini pode sintetizar informações visuais e contextuais em um relatório claro e acionável, facilitando o monitoramento e a tomada de decisões clínicas.

Imagem 1: {{media url=image1DataUri}}
Metadados Imagem 1: {{{image1Metadata}}}

Imagem 2: {{media url=image2DataUri}}
Metadados Imagem 2: {{{image2Metadata}}}
`,
});

const compareWoundImagesFlow = ai.defineFlow(
  {
    name: 'compareWoundImagesFlow',
    inputSchema: CompareWoundImagesInputSchema,
    outputSchema: CompareWoundImagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
