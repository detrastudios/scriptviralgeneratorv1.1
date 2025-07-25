"use client";

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
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
import type { GenerateViralScriptOutput } from '@/ai/flows/generate-viral-script';
import { Loader2, ClipboardCopy, FileDown } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { exportToDocx } from '@/lib/docx-exporter';
import { Skeleton } from './ui/skeleton';

const FormSchema = z.object({
  productLink: z.string().url({ message: 'Harap masukkan URL produk yang valid.' }).min(1, { message: 'Link produk tidak boleh kosong.' }),
  languageStyle: z.enum(['persuasif', 'storytelling', 'profesional', 'edukatif', 'santai', 'fun/menghibur'], {
    required_error: "Gaya bahasa harus dipilih."
  }),
  scriptLength: z.enum(['pendek', 'sedang', 'panjang'], {
    required_error: "Panjang tulisan harus dipilih."
  }),
  hookType: z.enum(['tidak ada', 'kontroversial', 'pertanyaan retoris', 'kutipan relatable', 'fakta mengejutkan', 'masalah dan solusi', 'before after', 'X dibanding Y', 'testimoni/review', 'first impression/unboxing'], {
    required_error: "Jenis hook harus dipilih."
  }),
});

export function ScriptGenerator() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<GenerateViralScriptOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productLink: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResults(null);
    const { data: resultData, error } = await generateScriptAction(data);
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

  const handleCopy = (script: string, hashtags: string) => {
    const textToCopy = `${script}\n\n${hashtags}`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Berhasil Disalin!',
      description: 'Script dan hashtag telah disalin ke clipboard.',
    });
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Buat Script Viral Anda</CardTitle>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          <SelectItem value="persuasif">Persuasif</SelectItem>
                          <SelectItem value="storytelling">Storytelling</SelectItem>
                          <SelectItem value="profesional">Profesional</SelectItem>
                          <SelectItem value="edukatif">Edukatif</SelectItem>
                          <SelectItem value="santai">Santai</SelectItem>
                          <SelectItem value="fun/menghibur">Fun/Menghibur</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scriptLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panjang Tulisan</FormLabel>
                       <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih panjang tulisan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pendek">Pendek (&lt; 30 detik)</SelectItem>
                          <SelectItem value="sedang">Sedang (30-60 detik)</SelectItem>
                          <SelectItem value="panjang">Panjang (&gt; 60 detik)</SelectItem>
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
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tidak ada">Tidak Ada</SelectItem>
                          <SelectItem value="kontroversial">Kontroversial</SelectItem>
                          <SelectItem value="pertanyaan retoris">Pertanyaan Retoris</SelectItem>
                          <SelectItem value="kutipan relatable">Kutipan Relatable</SelectItem>
                          <SelectItem value="fakta mengejutkan">Fakta Mengejutkan</SelectItem>
                          <SelectItem value="masalah dan solusi">Masalah dan Solusi</SelectItem>
                          <SelectItem value="before after">Before After</SelectItem>
                          <SelectItem value="X dibanding Y">X dibanding Y</SelectItem>
                          <SelectItem value="testimoni/review">Testimoni/Review</SelectItem>
                          <SelectItem value="first impression/unboxing">First Impression/Unboxing</SelectItem>
                        </SelectContent>
                      </Select>
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
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
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
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <ScrollArea className="h-48 w-full rounded-md border p-4">
                      <p className="text-sm whitespace-pre-wrap">{option.script}</p>
                    </ScrollArea>
                    <div>
                        <h4 className="font-semibold mb-2">Hashtag:</h4>
                        <p className="text-sm text-muted-foreground">{option.hashtags}</p>
                    </div>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button
                    variant="outline"
                    onClick={() => handleCopy(option.script, option.hashtags)}
                    >
                    <ClipboardCopy className="mr-2 h-4 w-4" />
                    Salin
                    </Button>
                    <Button onClick={() => exportToDocx(option.script, option.hashtags)}>
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
