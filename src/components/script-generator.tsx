"use client";

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateScriptAction } from '@/app/actions';
import type { GenerateViralScriptOutput, GenerateViralScriptInput } from '@/ai/flows/generate-viral-script';
import { Loader2, ClipboardCopy, FileDown } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { exportToDocx } from '@/lib/docx-exporter';
import { Skeleton } from './ui/skeleton';
import { Slider } from './ui/slider';

const FormSchema = z.object({
  productLink: z.string().url({ message: 'Harap masukkan URL produk yang valid.' }).min(1, { message: 'Link produk tidak boleh kosong.' }),
  languageStyle: z.enum(['persuasif', 'profesional', 'edukatif', 'santai', 'fun/menghibur', '1-kalimat', 'listicle', 'how-to', 'curhatan', 'storyselling', 'storytelling relate', 'storytelling halus', 'problem-agitation-solution'], {
    required_error: "Gaya bahasa harus dipilih."
  }),
  hookType: z.enum(['tidak ada', 'kontroversial', 'pertanyaan retoris', 'kutipan relatable', 'fakta mengejutkan', 'masalah dan solusi', 'before after', 'X dibanding Y', 'testimoni/review', 'first impression/unboxing'], {
    required_error: "Jenis hook harus dipilih."
  }),
  ctaType: z.enum(['interaksi', 'share/save', 'klik link', 'beli/checkout', 'coba gratis/demo', 'edukasi/follow up', 'validasi diri'], {
    required_error: "Jenis CTA harus dipilih."
  }),
  scriptLength: z.number().min(0).max(60),
  outputCount: z.number().min(1).max(15),
});

export function ScriptGenerator() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<GenerateViralScriptOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productLink: '',
      scriptLength: 30,
      outputCount: 6,
    },
  });

  const scriptLengthValue = form.watch('scriptLength');
  const outputCountValue = form.watch('outputCount');

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResults(null);
    const { data: resultData, error } = await generateScriptAction(data as GenerateViralScriptInput);
    setIsLoading(false);

    if (error || !resultData) {
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Script',
        description: error || 'Terjadi kesalahan yang tidak diketahui.',
      });
    } else {
      setResults(resultData);
    }
  }

  const handleCopy = (option: GenerateViralScriptOutput['scriptOptions'][0]) => {
    const textToCopy = `Judul: ${option.judul}\n\nHook: ${option.hook}\n\nScript: ${option.script}\n\nCTA: ${option.cta}\n\nCaption singkat: ${option.caption}\n\nHashtag: ${option.hashtags}`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Berhasil Disalin!',
      description: 'Script dan semua detailnya telah disalin ke clipboard.',
    });
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Viral Script Generator</CardTitle>
          <CardDescription>
            Masukkan link produk dan pilih preferensi Anda untuk menghasilkan
            script konten affiliate yang menarik.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="productLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Produk</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://shopee.co.id/product/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="languageStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gaya Bahasa</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih gaya bahasa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="santai">Santai</SelectItem>
                          <SelectItem value="how-to">How-To / Tips</SelectItem>
                          <SelectItem value="listicle">Listicle</SelectItem>
                          <SelectItem value="curhatan">Curhatan / Self-Talk</SelectItem>
                          <SelectItem value="edukatif">Edukatif</SelectItem>
                          <SelectItem value="persuasif">Persuasif</SelectItem>
                          <SelectItem value="profesional">Profesional</SelectItem>
                          <SelectItem value="1-kalimat">1-Kalimat / 1-Kata</SelectItem>
                          <SelectItem value="fun/menghibur">Fun/Menghibur</SelectItem>
                          <SelectItem value="storyselling">Storyselling</SelectItem>
                          <SelectItem value="storytelling halus">Storytelling halus</SelectItem>
                          <SelectItem value="storytelling relate">Storytelling relate</SelectItem>
                          <SelectItem value="problem-agitation-solution">Problem – Agitation – Solution</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="hookType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Hook</FormLabel>
                         <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis hook" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tidak ada">Tidak Ada</SelectItem>
                            <SelectItem value="X dibanding Y">X dibanding Y</SelectItem>
                            <SelectItem value="before after">Before After</SelectItem>
                            <SelectItem value="kontroversial">Kontroversial</SelectItem>
                            <SelectItem value="testimoni/review">Testimoni/Review</SelectItem>
                            <SelectItem value="kutipan relatable">Kutipan Relatable</SelectItem>
                            <SelectItem value="masalah dan solusi">Masalah dan Solusi</SelectItem>
                            <SelectItem value="fakta mengejutkan">Fakta Mengejutkan</SelectItem>
                            <SelectItem value="pertanyaan retoris">Pertanyaan Retoris</SelectItem>
                            <SelectItem value="first impression/unboxing">First Impression/Unboxing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <FormField
                control={form.control}
                name="ctaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis CTA</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis CTA" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="interaksi">CTA Interaksi</SelectItem>
                        <SelectItem value="share/save">CTA Share/Save</SelectItem>
                        <SelectItem value="klik link">CTA Klik Link</SelectItem>
                        <SelectItem value="beli/checkout">CTA Beli/Checkout</SelectItem>
                        <SelectItem value="coba gratis/demo">CTA Coba Gratis/Demo</SelectItem>
                        <SelectItem value="edukasi/follow up">CTA Edukasi/Follow Up</SelectItem>
                        <SelectItem value="validasi diri">CTA Validasi Diri</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="scriptLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durasi (detik)</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={60}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Durasi video: {scriptLengthValue} detik.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="outputCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Hasil</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={15}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Jumlah output: {outputCountValue} script.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Membuat Script...
                  </>
                ) : (
                  'Buat Script'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(outputCountValue)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                 <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {results && (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Hasil Script Anda</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.scriptOptions.map((option, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                      <CardTitle>Opsi Script {index + 1}</CardTitle>
                      <CardDescription>Durasi: {option.durasi} detik</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <ScrollArea className="h-80 w-full rounded-md border p-4">
                      <div className="space-y-4 whitespace-pre-wrap text-sm">
                        <div>
                          <h4 className="font-semibold mb-1">Judul:</h4>
                          <p>{option.judul}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Hook:</h4>
                          <p>{option.hook}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Script:</h4>
                          <p>{option.script}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">CTA:</h4>
                          <p>{option.cta}</p>
                        </div>
                         <div>
                          <h4 className="font-semibold mb-1">Caption Singkat:</h4>
                          <p>{option.caption}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Hashtag:</h4>
                          <p className="text-muted-foreground">{option.hashtags}</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="gap-2">
                      <Button
                      variant="outline"
                      onClick={() => handleCopy(option)}
                      >
                      <ClipboardCopy className="mr-2 h-4 w-4" />
                      Salin
                      </Button>
                      <Button onClick={() => exportToDocx(option)}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Ekspor
                      </Button>
                  </CardFooter>
                </Card>
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
