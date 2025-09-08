export type TissueQuant = { class: string; percent: number };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
const AI_BASE = process.env.NEXT_PUBLIC_AI_BASE || 'http://localhost:5000';

export async function createAssessment(woundId: string, payload: unknown): Promise<{ assessmentId: string }>{
  try {
    const res = await fetch(`${API_BASE}/wounds/${woundId}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to create assessment: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Network error in createAssessment:', error);
    throw error;
  }
}

export async function getAnalysis(assessmentId: string): Promise<{
  segmentationMaskUri: string;
  tissueQuant: TissueQuant[];
  area: { value: number; unit: string };
  perimeter: { value: number; unit: string };
  gradcamUri?: string;
}>{
  try {
    const res = await fetch(`${API_BASE}/assessments/${assessmentId}/analysis`);
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to get analysis: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Network error in getAnalysis:', error);
    throw error;
  }
}

export async function requestVisionAnalysis(input: unknown): Promise<{ jobId: string }>{
  try {
    const res = await fetch(`${AI_BASE}/analysis/vision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to enqueue vision analysis: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Network error in requestVisionAnalysis:', error);
    throw error;
  }
}

export async function getRisk(input: unknown): Promise<{
  infection: { level: string; score: number; factors: string[] };
  healing: { probHeal30: number; timeToHeal: number; stagnation: boolean; factors: string[] };
}>{
  try {
    const res = await fetch(`${AI_BASE}/analysis/risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to compute risk: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Network error in getRisk:', error);
    throw error;
  }
}

export async function fhirPush(assessmentId: string): Promise<{ bundleId: string; status: string }>{
  try {
    const res = await fetch(`${API_BASE}/fhir/sync/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId })
    });
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      throw new Error(`FHIR push failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Network error in fhirPush:', error);
    throw error;
  }
}

export async function fhirPull(patientId: string): Promise<{ resources: any[] }>{
  try {
    const res = await fetch(`${API_BASE}/fhir/sync/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, resources: ['Patient','Condition','MedicationRequest'] })
    });
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      throw new Error(`FHIR pull failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Network error in fhirPull:', error);
    throw error;
  }
}


