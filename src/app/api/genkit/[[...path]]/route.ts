
import {startGenkitServer} from '@genkit-ai/next';

// Import your flows here
import '@/ai/flows/generate-viral-script';

export const {GET, POST} = startGenkitServer();
