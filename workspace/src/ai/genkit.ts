import {genkit, GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// The googleAI() plugin automatically looks for a GEMINI_API_KEY
// in the environment variables. This is configured in apphosting.yaml for production
// and in the .env file for local development.

const plugins: GenkitPlugin[] = [];
// Only initialize the Google AI plugin if the API key is available.
if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
}

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.0-flash',
});
