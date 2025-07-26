'use server';

import { z } from 'zod';
import {
  generateViralScript,
  type GenerateViralScriptInput,
  type GenerateViralScriptOutput,
} from '@/ai/flows/generate-viral-script';

// This needs to match the schema in the AI flow and the form.
const FormSchema = z.object({
  productLink: z.string().url({ message: 'Harap masukkan URL produk yang valid.' }).min(1, { message: 'Link produk tidak boleh kosong.' }),
  languageStyle: z.enum(['persuasif', 'profesional', 'edukatif', 'santai', 'fun/menghibur', '1-kalimat', 'listicle', 'how-to', 'curhatan', 'storyselling', 'storytelling relate', 'storytelling halus', 'problem-agitation-solution']),
  scriptLength: z.number().min(0).max(60),
  hookType: z.enum(['tidak ada', 'kontroversial', 'pertanyaan retoris', 'kutipan relatable', 'fakta mengejutkan', 'masalah dan solusi', 'before after', 'X dibanding Y', 'testimoni/review', 'first impression/unboxing']),
  keywords: z.string().optional(),
  ctaType: z.enum(['interaksi', 'share/save', 'klik link', 'beli/checkout', 'coba gratis/demo', 'edukasi/follow up', 'validasi diri', 'keranjang']),
  outputCount: z.number().min(0).max(20),
});


export async function generateScriptAction(
  values: GenerateViralScriptInput
): Promise<{data: GenerateViralScriptOutput | null; error: string | null}> {
  const validatedFields = FormSchema.safeParse(values);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat()[0] || 'Data yang dimasukkan tidak valid.';
    console.error('Validation Error:', errorMessages);
    return {
      data: null,
      error: firstError,
    };
  }
  
  try {
    const result = await generateViralScript(validatedFields.data);
    return { data: result, error: null };
  } catch (error) {
    console.error('AI Generation Error:', error);
    return {
        data: null,
        error: 'Terjadi kesalahan saat membuat script. Silakan coba lagi nanti.'
    };
  }
}
