export type TissueQuant = { class: string; percent: number };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
const AI_BASE = process.env.NEXT_PUBLIC_AI_BASE || 'http://localhost:5000';

export async function createAssessment(woundId: string, payload: unknown): Promise<{ assessmentId: string }>{
  const res = await fetch(`${API_BASE}/wounds/${woundId}/assessments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create assessment');
  return res.json();
}

export async function getAnalysis(assessmentId: string): Promise<{
  segmentationMaskUri: string;
  tissueQuant: TissueQuant[];
  area: { value: number; unit: string };
  perimeter: { value: number; unit: string };
  gradcamUri?: string;
}>{
  const res = await fetch(`${API_BASE}/assessments/${assessmentId}/analysis`);
  if (!res.ok) throw new Error('Failed to get analysis');
  return res.json();
}

export async function requestVisionAnalysis(input: unknown): Promise<{ jobId: string }>{
  const res = await fetch(`${AI_BASE}/analysis/vision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error('Failed to enqueue vision analysis');
  return res.json();
}

export async function getRisk(input: unknown): Promise<{
  infection: { level: string; score: number; factors: string[] };
  healing: { probHeal30: number; timeToHeal: number; stagnation: boolean; factors: string[] };
}>{
  const res = await fetch(`${AI_BASE}/analysis/risk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error('Failed to compute risk');
  return res.json();
}


