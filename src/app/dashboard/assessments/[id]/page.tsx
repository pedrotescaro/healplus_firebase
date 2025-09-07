"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

export default function AssessmentDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [item, setItem] = useState<any | null>(null);
  const [opacity, setOpacity] = useState<number>(50);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid, "assessments", params.id);
      const snap = await getDoc(ref);
      if (snap.exists()) setItem({ id: snap.id, ...snap.data() });
    };
    load();
  }, [user, params.id]);

  if (!item) return null;

  const analysis = item.analysis || {};
  const tissueStr = analysis.tissueQuant?.map((t: any) => `${t.class}:${t.percent}%`).join(" | ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment {item.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="relative w-full max-w-md aspect-square">
              {item.imageUri ? (
                <Image src={item.imageUri} alt="Wound" layout="fill" className="object-contain rounded" />
              ) : (
                <div className="w-full h-full border rounded flex items-center justify-center text-muted-foreground">Sem imagem</div>
              )}
              {analysis.segmentationMaskUri && (
                <img src={analysis.segmentationMaskUri} alt="Mask" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: opacity/100 }} />
              )}
            </div>
            {analysis.segmentationMaskUri && (
              <div className="mt-2">
                <Label>Opacidade da Máscara</Label>
                <Slider defaultValue={[opacity]} max={100} step={5} onValueChange={(v) => setOpacity(v[0] ?? 50)} />
              </div>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="font-semibold">Tecido:</span> {tissueStr}</div>
            <div><span className="font-semibold">Área:</span> {analysis?.area?.value} {analysis?.area?.unit}</div>
            <div><span className="font-semibold">Perímetro:</span> {analysis?.perimeter?.value} {analysis?.perimeter?.unit}</div>
            <div className="text-xs text-muted-foreground">Criado: {item.createdAt?.toDate?.().toLocaleString?.('pt-BR') || '-'}</div>
            <div className="pt-2"><Link className="underline" href="/dashboard/assessments">Voltar</Link></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


