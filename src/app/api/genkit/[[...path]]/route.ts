import createNextRouteHandler from '@genkit-ai/next';

export const dynamic = 'force-dynamic'; // 🛠 Ini kunci biar tidak di-static generate

const handler = createNextRouteHandler();
export { handler as GET, handler as POST };
