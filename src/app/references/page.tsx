
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, BookOpen } from "lucide-react";
import Link from "next/link";

const references = [
  {
    id: 1,
    text: "ARAÚJO, T. M. et al. Realidade virtual no alívio da dor durante a troca de curativos de feridas crônicas. Revista da Escola de Enfermagem da USP, São Paulo, v. 55, e20200513, 2021. DOI: https://doi.org/10.1590/1980-220X-REEUSP-2020-0513. Disponível em: https://www.scielo.br/j/reeusp/a/xLqsRvkycBVLt3DD7BsM4tP/?lang=pt&format=pdf. Acesso em: 30 maio 2025."
  },
  {
    id: 2,
    text: "BORGES, Eline Lima; SOUZA, Perla Oliveira Soares de. Feridas: como tratar. 3. ed. Rio de Janeiro: Rubio, 2024. p. 61-88."
  },
  {
    id: 3,
    text: "FLORIANÓPOLIS. Prefeitura Municipal. Secretaria Municipal de Saúde. Protocolo de cuidados de feridas. Florianópolis, SC: SMS, 2008."
  },
  {
    id: 4,
    text: "GERMANO, Renan Soares; ELISEO, Maria Amelia; SILVEIRA, Ismar Frango. Introdução à acessibilidade na Web: do conceito à prática. In: JORNADAS IBERO-AMERICANAS DE INTERAÇÃO HUMANO-COMPUTADOR, 7., 2021, São Paulo. Anais [...]. São Paulo: Sociedade Brasileira de Computação, 2021."
  },
  {
    id: 5,
    text: "LIMA, E. V. M. et al. Construction of a mobile application for wound assessment for nursing students and professionals. Estima – Brazilian Journal of Enterostomal Therapy, [S. l.], v. 22, art. 1515, 2024. Disponível em: https://www.revistaestima.com.br/estima/article/view/1515. Acesso em: 1 nov. 2024."
  },
  {
    id: 6,
    text: "MADRIL MEDEIROS, R. M. et al. Contribuição de um software para o registro, monitoramento e avaliação de feridas. Global Academic Nursing Journal, [S. l.], v. 2, n. 3, p. e146, 2021. DOI: 10.5935/2675-5602.20200146. Disponível em: https://www.globalacademicnursing.com/index.php/globacadnurs/article/view/123. Acesso em: 7 mar. 2025."
  },
  {
    id: 7,
    text: "MEDETEC. Medetec Image Databases. A collection of wound images for research and education. Disponível em: https://www.medetec.co.uk/files/medetec-image-databases.html.",
    link: "https://www.medetec.co.uk/files/medetec-image-databases.html"
  },
  {
    id: 8,
    text: "MENOITA, E.; SEARA, A.; SANTOS, V. Plano de Tratamento dirigido aos Sinais Clínicos da Infecção da Ferida. Journal of Aging & Inovation, v. 3, n. 2, p. 62-73, 2014.",
    link: "https://journalofagingandinnovation.org/wp-content/uploads/6-infeccao-feridas-update.pdf"
  },
  {
    id: 9,
    text: "PAULA, M. A. B.; SANTOS, V. L. C. G. O significado de ser especialista para o enfermeiro estomaterapeuta. Revista Latino-Americana de Enfermagem, Ribeirão Preto, v. 11, n. 4, p. 474–482, jul. 2003. Disponível em: https://www.scielo.br/j/rlae/a/mvBJQ3wFgTGjT6hJ4NNDVxS/. Acesso em: 13 nov. 2024."
  },
  {
    id: 10,
    text: "ROCHA, Adiel Andrade. Feridômetro: aplicativo de auxílio à aprendizagem do acrônimo TIMERS. 2021. Trabalho de Conclusão de Curso (Graduação em Ciência da Computação) – Universidade Federal de Campina Grande, Campina Grande, 2021. Disponível em: https://dspace.sti.ufcg.edu.br/bitstream/riufcg/19691/1/ADIEL%20ANDRADE%20ROCHA%20-%20TCC%20CI%C3%8ANCIA%20DA%20COMPUTA%C3%87%C3%83O%202021.pdf. Acesso em: 2 set. 2025."
  },
  {
    id: 11,
    text: "SILVA, Cláudio Xavier da. Sis-MF - Aplicativo para monitoramento da cicatrização de feridas. 2018. Dissertação (Mestrado Profissional em Ciências) – Universidade Federal de São Paulo, São Paulo, 2018."
  },
  {
    id: 12,
    text: "SOARES PACZEK, R. et al. A ESTOMATERAPIA COMO CAMPO DE ESTÁGIO. In: CONGRESSO BRASILEIRO DE ESTOMATERAPIA, [S. l.], 2024. Anais [...]. [S. l.]: SOBEST, 2024. Disponível em: https://anais.sobest.com.br/cbe/article/view/447. Acesso em: 20 out. 2024."
  }
];

export default function ReferencesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Referências Bibliográficas</CardTitle>
          <CardDescription>
            Fontes utilizadas como base para o desenvolvimento e as análises do Heal+.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {references.map((ref) => (
              <li key={ref.id} className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                <p className="text-muted-foreground">{ref.text}</p>
                {ref.link && (
                  <a
                    href={ref.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    Acessar link
                  </a>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Voltar para a Página Inicial
          </Link>
        </Button>
      </div>
    </div>
  );
}
