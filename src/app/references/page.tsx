
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, BookOpen } from "lucide-react";
import Link from "next/link";

const references = [
  {
    id: 1,
    text: "Borges, Eline Lima; Souza, Perla Oliveira Soares de. Feridas: como tratar – 3 ed. Rio de Janeiro: Rubio 2024. 61-88 p."
  },
  {
    id: 2,
    text: "Menoita,E; Seara, a.; Santos, V. Plano de Tratamento dirigido aos Sinais Clínicos da Infecção da Ferida, Journal of Aging & Inovation, 3 (2):62-73, 2014.",
    link: "https://journalofagingandinnovation.org/wp-content/uploads/6-infeccao-feridas-update.pdf"
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
