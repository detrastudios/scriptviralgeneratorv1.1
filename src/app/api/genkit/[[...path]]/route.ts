
import { createNextRouteHandler } from '@genkit-ai/next';

// Import your flows here
import '@/ai/flows/generate-viral-script';

const handler = createNextRouteHandler();

export { handler as GET, handler as POST };
