import { config } from 'dotenv';
config();

import '@/ai/flows/generate-wound-report.ts';
import '@/ai/flows/compare-wound-images.ts';