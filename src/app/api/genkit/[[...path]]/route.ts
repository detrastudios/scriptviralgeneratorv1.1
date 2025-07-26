
// app/api/genkit/[[...path]]/route.ts
import { createNextRouteHandler } from '@genkit-ai/next';
import '@/ai/flows/generate-viral-script';

const handler = createNextRouteHandler();
export { handler as GET, handler as POST };
