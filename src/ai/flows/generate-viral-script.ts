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
  outputCount: z.number().min(1).max(15).describe('The number of script options to generate.'),
});

export type GenerateViralScriptInput = z.infer<typeof GenerateViralScriptInputSchema>;

// Define the output schema for the flow
const GenerateViralScriptOutputSchema = z.object({
  scriptOptions: z.array(
    z.object({
      durasi: z.string().describe('The duration of the video script in seconds.'),
      judul: z.string().describe('A catchy title for the video.'),
      hook: z.string().describe('The hook to grab the viewer\'s attention.'),
      script: z.string().describe('The main body of the script.'),
      cta: z.string().describe('The call to action.'),
      caption: z.string().describe('A short caption for the social media post.'),
      hashtags: z.string().describe('Relevant and powerful hashtags for the script.'),
    })
  ).describe('A variable number of script options with hashtags, based on outputCount.'),
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
  prompt: `You are an expert marketing script generator for social media. Your primary goal is to create scripts that are precisely tailored to the user's specified video duration.

You will generate {{{outputCount}}} different script options based on the product link and the following preferences:

Product Link: {{{productLink}}}
Language Style: {{{languageStyle}}}
Hook Type: {{{hookType}}}

**Crucial Instruction:** The script's content MUST be readable within the specified video duration. The target video duration is exactly **{{{scriptLength}}} seconds**. Adjust the word count and pacing of the script to strictly meet this time limit. Do not generate a script that is too long or too short for a {{{scriptLength}}}-second video.

Each script option must include relevant and powerful hashtags. All content must be tailored to the Indonesian market.

Generate the output in the following structured format for each option:
- Durasi: [The specified script length in seconds]
- Judul: [A catchy title for the video]
- Hook: [The hook to grab the viewer's attention, based on the selected hook type]
- Script: [The main body of the script]
- CTA: [The call to action]
- Caption singkat: [A short caption for the social media post]
- Hashtag: [Relevant and powerful hashtags]

Ensure that the output provides exactly {{{outputCount}}} distinct script options, each with its own unique content for every field. Be creative and persuasive while strictly adhering to the time constraint.
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
