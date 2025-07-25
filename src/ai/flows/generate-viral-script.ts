'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating viral marketing scripts based on product links and user-defined preferences.
 *
 * It exports:
 * - `generateViralScript`: An async function that takes `GenerateViralScriptInput` and returns a `Promise` of `GenerateViralScriptOutput`.
 * - `GenerateViralScriptInput`: The input type for the `generateViralScript` function.
 * - `GenerateViralScriptOutput`: The output type for the `generateViralScript` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const GenerateViralScriptInputSchema = z.object({
  productLink: z
    .string()
    .describe(
      'The link to the product being promoted. Can be from Shopee, Tokopedia, TikTok, Instagram, or Lynk.id.'
    ),
  languageStyle: z.enum([
    'persuasif',
    'profesional',
    'edukatif',
    'santai',
    'fun/menghibur',
    '1-kalimat',
    'listicle',
    'how-to',
    'curhatan',
    'storyselling',
    'storytelling relate',
    'storytelling halus'
  ]).describe('The desired language style for the script.'),
  scriptLength: z.number().describe('The desired script length in seconds (0-60).'),
  hookType: z
    .enum([
      'tidak ada',
      'kontroversial',
      'pertanyaan retoris',
      'kutipan relatable',
      'fakta mengejutkan',
      'masalah dan solusi',
      'before after',
      'X dibanding Y',
      'testimoni/review',
      'first impression/unboxing',
    ])
    .describe('The desired hook type for the script.'),
});

export type GenerateViralScriptInput = z.infer<typeof GenerateViralScriptInputSchema>;

// Define the output schema for the flow
const GenerateViralScriptOutputSchema = z.object({
  scriptOptions: z.array(
    z.object({
      script: z.string().describe('A generated marketing script option.'),
      hashtags: z.string().describe('Relevant and powerful hashtags for the script.'),
    })
  ).length(6).describe('Six different script options with hashtags.'),
});

export type GenerateViralScriptOutput = z.infer<typeof GenerateViralScriptOutputSchema>;

// Define the wrapper function
export async function generateViralScript(
  input: GenerateViralScriptInput
): Promise<GenerateViralScriptOutput> {
  return generateViralScriptFlow(input);
}

// Define the prompt
const generateViralScriptPrompt = ai.definePrompt({
  name: 'generateViralScriptPrompt',
  input: {schema: GenerateViralScriptInputSchema},
  output: {schema: GenerateViralScriptOutputSchema},
  prompt: `You are an expert marketing script generator for social media.

You will generate 6 different script options based on the product link and the following preferences:

Product Link: {{{productLink}}}
Language Style: {{{languageStyle}}}
Script Length: Target a video duration of approximately {{{scriptLength}}} seconds.
Hook Type: {{{hookType}}}

Each script option should include relevant and powerful hashtags.  The script and hashtags should be tailored to the Indonesian market.

Ensure that the output provides six distinct script options, each with its own unique script and set of hashtags. Be creative and persuasive.
`,
});

// Define the flow
const generateViralScriptFlow = ai.defineFlow(
  {
    name: 'generateViralScriptFlow',
    inputSchema: GenerateViralScriptInputSchema,
    outputSchema: GenerateViralScriptOutputSchema,
  },
  async input => {
    const {output} = await generateViralScriptPrompt(input);
    return output!;
  }
);
