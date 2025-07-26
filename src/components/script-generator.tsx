
"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateScriptAction } from "@/app/actions";
import { RocketLoader } from "./rocket-loader";
import { type GenerateViralScriptOutput } from "@/ai/flows/generate-viral-script";
import { cn } from "@/lib/utils";
import { exportToDocx } from "@/lib/docx-exporter";
import { FileDown, Copy } from "lucide-react";


// Skema validasi form
const FormSchema = z.object({
  productLink: z.string().url({ message: 'Harap masukkan URL produk yang valid.' }).min(1, { message: 'Link produk tidak boleh kosong.' }),
  languageStyle: z.enum(['persuasif', 'profesional', 'edukatif', 'santai', 'fun/menghibur', '1-kalimat', 'listicle', 'how-to', 'curhatan', 'storyselling', 'storytelling relate', 'storytelling halus', 'problem-agitation-solution']),
  scriptLength: z.number().min(0).max(60),
  hookType: z.enum(['tidak ada', 'kontroversial', 'pertanyaan retoris', 'kutipan relatable', 'fakta mengejutkan', 'masalah dan solusi', 'before after', 'X dibanding Y', 'testimoni/review', 'first impression/unboxing']),
  ctaType: z.enum(['interaksi', 'share/save', 'klik link', 'beli/checkout', 'coba gratis/demo', 'edukasi/follow up', 'validasi diri', 'random sesuai marketplace']),
  outputCount: z.number().min(1).max(15),
});

export function ScriptGenerator() {
  const { toast } = useToast();
  const [results, setResults] = useState<GenerateViralScriptOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productLink: "",
      languageStyle: "persuasif",
      scriptLength: 30,
      hookType: "tidak ada",
      ctaType: "random sesuai marketplace",
      outputCount: 3,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setResults(null);
    const result = await generateScriptAction(data);
    if (result.error) {
      toast({
        title: "Gagal Membuat Script",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setResults(result.data);
    }
    setLoading(false);
  }

  const handleCopy = (option: GenerateViralScriptOutput['scriptOptions'][0], index: number) => {
    const textToCopy = `Durasi: ${option.durasi} detik\nJudul: ${option.judul}\nHook: ${option.hook}\nScript: ${option.script}\nCTA: ${option.cta}\nCaption Singkat: ${option.caption}\nHashtag: ${option.hashtags}`;
    navigator.clipboard.writeText(textToCopy);
    setClickedIndex(index);
    setTimeout(() => {
      setClickedIndex(null);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader className="text-center p-8">
              <CardTitle className="text-3xl font-bold">Stop Mikir Keras, Mulai Klik Cerdas</CardTitle>
              <CardDescription>Masukkan link produk digitalmu dan dapatkan ide konten viral otomatis!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="productLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Produk</FormLabel>
                    <FormControl>
                      <Input placeholder="https://tokopedia.com/produkA" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih gaya bahasa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="persuasif">Persuasif</SelectItem>
                          <SelectItem value="profesional">Profesional</SelectItem>
                          <SelectItem value="edukatif">Edukatif</SelectItem>
                          <SelectItem value="santai">Santai</SelectItem>
                          <SelectItem value="fun/menghibur">Fun/Menghibur</SelectItem>
                          <SelectItem value="1-kalimat">1 Kalimat</SelectItem>
                          <SelectItem value="listicle">Listicle</SelectItem>
                          <SelectItem value="how-to">How-to</SelectItem>
                          <SelectItem value="curhatan">Curhatan</SelectItem>
                          <SelectItem value="storyselling">Storyselling</SelectItem>
                          <SelectItem value="storytelling relate">Storytelling Relate</SelectItem>
                          <SelectItem value="storytelling halus">Storytelling Halus</SelectItem>
                          <SelectItem value="problem-agitation-solution">Problem-Agitation-Solution</SelectItem>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <SelectItem value="masalah dan solusi">Masalah & Solusi</SelectItem>
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
                <FormField
                  control={form.control}
                  name="ctaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis CTA</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis CTA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="interaksi">Interaksi</SelectItem>
                          <SelectItem value="share/save">Share/Save</SelectItem>
                          <SelectItem value="klik link">Klik Link</SelectItem>
                          <SelectItem value="beli/checkout">Beli/Checkout</SelectItem>
                          <SelectItem value="coba gratis/demo">Coba Gratis/Demo</SelectItem>
                          <SelectItem value="edukasi/follow up">Edukasi/Follow Up</SelectItem>
                          <SelectItem value="validasi diri">Validasi Diri</SelectItem>
                          <SelectItem value="random sesuai marketplace">Random Sesuai Marketplace</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="outputCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Opsi Script (1-15)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={15} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="scriptLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durasi Script (detik): {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[30]}
                        min={0}
                        max={60}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                Buatkan Script
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {loading && <RocketLoader />}

      {results && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">✨ Ini Dia, Script Ajaibmu!</CardTitle>
              <CardDescription>Pilih, salin, dan jadilah viral. Semudah itu!</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full p-1">
                <div className="space-y-6 pr-4">
                  {results.scriptOptions.map((option, index) => (
                    <div key={index} className="border p-6 rounded-lg bg-background/50 shadow-md transition-all hover:shadow-glow hover:border-primary/20">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Opsi {index + 1}</p>
                          <h3 className="text-lg font-semibold text-primary">{option.judul}</h3>
                          <p className="text-sm text-muted-foreground">Durasi: {option.durasi} detik</p>
                        </div>
                        <div className="flex gap-2">
                           <Button
                            variant="outline"
                            size="icon"
                            onClick={() => exportToDocx(option)}
                          >
                            <FileDown />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCopy(option, index)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={cn(
                              (clickedIndex === index || hoveredIndex === index) && "animate-flash",
                            )}
                          >
                            <Copy />
                            <span className="sr-only">
                              {clickedIndex === index || hoveredIndex === index ? "Salin Semua" : "Copy"}
                            </span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <div><strong className="font-semibold text-foreground/90">Hook:</strong><p className="text-muted-foreground mt-1">{option.hook}</p></div>
                        <Separator />
                        <div><strong className="font-semibold text-foreground/90">Script:</strong><p className="text-muted-foreground mt-1 whitespace-pre-line">{option.script}</p></div>
                        <Separator />
                        <div><strong className="font-semibold text-foreground/90">CTA:</strong><p className="text-muted-foreground mt-1">{option.cta}</p></div>
                        <Separator />
                        <div><strong className="font-semibold text-foreground/90">Caption Singkat:</strong><p className="text-muted-foreground mt-1">{option.caption}</p></div>
                        <Separator />
                        <div><strong className="font-semibold text-foreground/90">Hashtag:</strong><p className="text-muted-foreground mt-1">{option.hashtags}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
