import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// The googleAI() plugin automatically looks for a GEMINI_API_KEY 
// in the environment variables. This is configured in apphosting.yaml.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
