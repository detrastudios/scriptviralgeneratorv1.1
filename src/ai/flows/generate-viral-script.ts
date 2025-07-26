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
    'storytelling halus',
    'problem-agitation-solution',
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
  keywords: z.string().optional().describe('Optional keywords to guide the script generation.'),
  ctaType: z.enum([
    'interaksi',
    'share/save',
    'klik link',
    'beli/checkout',
    'crosscheck',
    'edukasi/follow up',
    'validasi diri',
    'keranjang',
  ]).describe('The desired Call to Action (CTA) type for the script.'),
  outputCount: z.number().min(0).max(20).describe('The number of script options to generate.'),
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
CTA Type: {{{ctaType}}}
{{#if keywords}}
Keywords: {{{keywords}}}
{{/if}}

**Crucial Instruction:** The script's content MUST be readable within the specified video duration. The target video duration is exactly **{{{scriptLength}}} seconds**. Adjust the word count and pacing of the script to strictly meet this time limit. Do not generate a script that is too long or too short for a {{{scriptLength}}}-second video.

{{#if keywords}}
**Keyword Integration:** If keywords are provided, you MUST integrate them naturally into the script content (hook, script, caption) to make it more relevant and targeted.
{{/if}}

**CTA Generation Logic:**
Based on the selected '{{{ctaType}}}', generate a Call to Action that aligns with the following goals and examples.

- **If a specific CTA type is chosen**:
  - **interaksi**:
    - **Tujuan**: Bikin audiens komen / reply / engage
    - **Contoh**: “Kamu pernah ngalamin ini juga?”, “Setuju gak? Tulis di komen ya.”, “Coba tebak hasil akhirnya!”
  - **share/save**:
    - **Tujuan**: Konten disimpan atau dibagikan
    - **Contoh**: “Save dulu biar gak lupa”, “Share ke temenmu yang butuh ini”, “Nanti kamu bakal nyari konten ini lagi, trust me.”
  - **klik link**:
    - **Tujuan**: Bawa traffic ke bio / landing page / WA
    - **Contoh**: “Klik link di bio buat cobain sekarang”, “Aku taruh linknya di atas ya”, “Mau coba? Link ada di bio.”
  - **beli/checkout**:
    - **Tujuan**: Bikin orang langsung ambil keputusan beli
    - **Contoh**: “Langsung checkout sebelum habis ya”, “Gak usah mikir lama, klik beli aja”, “Yang mau langsung order, cek link-nya sekarang”
  - **crosscheck**:
    - **Tujuan**: Menciptakan urgensi agar penonton segera mengecek harga di keranjang, seringkali dengan membandingkan harga yang mungkin disebutkan di video dengan harga terkini.
    - **Contoh**: “Coba crosscheck harganya, katanya lagi diskon lho.”, “Biar yakin, cek dulu harganya di keranjang sekarang.”, “Jangan-jangan harganya udah naik besok, cek sekarang!”, "Crosscheck harga di keranjang deh, mumpung masih ada."
  - **edukasi/follow up**:
    - **Tujuan**: Cocok buat konten soft selling atau tips
    - **Contoh**: “Follow buat dapet tips jualan tiap hari”, “Besok aku bahas bagian kedua, stay tune ya”, “Kalau kamu suka konten kayak gini, kasih ❤️”
  - **validasi diri**:
    - **Tujuan**: Bikin audiens ngerasa relate dan terlibat
    - **Contoh**: “Yang pernah ngerasa gini, angkat tangan 🙋‍♂️”, “Berapa banyak dari kamu yang ngalamin ini?”, “Kalau kamu salah satunya, kamu gak sendiri”
  - **keranjang**:
    - **Tujuan**: Mengarahkan audiens untuk klik ikon keranjang di pojok kiri bawah layar, yang umum di platform seperti TikTok, tanpa menyebutkan warna spesifik (seperti kuning atau oranye) untuk menghindari pelanggaran.
    - **Contoh**: "Produknya ada di ikon keranjang di bawah ya!", "Langsung aja klik keranjang di pojok kiri bawah!", "Checkout sekarang di keranjang belanja sebelum kehabisan.", "Cek produknya di tautan keranjang di bawah."

Each script option must include relevant and powerful hashtags. All content must be tailored to the Indonesian market.

Generate the output in the following structured format for each option:
- Durasi: [The specified script length in seconds]
- Judul: [A catchy title for the video]
- Hook: [The hook to grab the viewer's attention, based on the selected hook type]
- Script: [The main body of the script]
- CTA: [The call to action, based on the selected CTA type]
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
