"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

export default function AssessmentDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [item, setItem] = useState<any | null>(null);
  const [opacity, setOpacity] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);

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
        <div className="flex gap-2">
          <Button variant="secondary" disabled={loading} onClick={async () => {
            try {
              setLoading(true);
              // mock reprocess: bump modelVersion suffix
              const current = item.analysis?.modelVersion || 'vision-0.1.0';
              const next = current.replace(/(\d+)$/, (m: string) => String(Number(m) + 1));
              const ref = doc(db, "users", user!.uid, "assessments", params.id);
              await updateDoc(ref, { "analysis.modelVersion": next });
              setItem({ ...item, analysis: { ...item.analysis, modelVersion: next } });
              // @ts-ignore
              toast?.({ title: "Reprocessado (mock)", description: `Modelo: ${next}` });
            } finally {
              setLoading(false);
            }
          }}>Reprocessar (mock)</Button>
        </div>
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
              {analysis.gradcamUri && (
                <img src={analysis.gradcamUri} alt="Grad-CAM" className="absolute inset-0 w-full h-full object-contain mix-blend-multiply pointer-events-none" style={{ opacity: opacity/100 }} />
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


