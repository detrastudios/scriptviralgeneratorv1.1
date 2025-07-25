"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateScriptAction } from "@/app/actions";
import type {
  GenerateViralScriptOutput,
  GenerateViralScriptInput,
} from "@/ai/flows/generate-viral-script";
import { Loader2, ClipboardCopy, FileDown, Wand2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { exportToDocx } from "@/lib/docx-exporter";
import { Skeleton } from "./ui/skeleton";
import { Slider } from "./ui/slider";

const FormSchema = z.object({
  productLink: z
    .string()
    .url({ message: "Harap masukkan URL produk yang valid." })
    .min(1, { message: "Link produk tidak boleh kosong." }),
  languageStyle: z.enum([
    "persuasif",
    "profesional",
    "edukatif",
    "santai",
    "fun/menghibur",
    "1-kalimat",
    "listicle",
    "how-to",
    "curhatan",
    "storyselling",
    "storytelling relate",
    "storytelling halus",
    "problem-agitation-solution",
  ]),
  hookType: z.enum([
    "tidak ada",
    "kontroversial",
    "pertanyaan retoris",
    "kutipan relatable",
    "fakta mengejutkan",
    "masalah dan solusi",
    "before after",
    "X dibanding Y",
    "testimoni/review",
    "first impression/unboxing",
  ]),
  ctaType: z.enum([
    "interaksi",
    "share/save",
    "klik link",
    "beli/checkout",
    "coba gratis/demo",
    "edukasi/follow up",
    "validasi diri",
    "random sesuai marketplace",
  ]),
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
      productLink: "",
      languageStyle: "santai",
      hookType: "tidak ada",
      ctaType: "random sesuai marketplace",
      scriptLength: 30,
      outputCount: 6,
    },
  });

  const { watch, handleSubmit, control } = form;
  const scriptLengthValue = watch("scriptLength");
  const outputCountValue = watch("outputCount");

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setResults(null);
    const { data: resultData, error } = await generateScriptAction(
      data as GenerateViralScriptInput
    );
    setIsLoading(false);

    if (error || !resultData) {
      toast({
        variant: "destructive",
        title: "Gagal Membuat Script",
        description: error || "Terjadi kesalahan yang tidak diketahui.",
      });
    } else {
      setResults(resultData);
    }
  };

  const handleCopy = (option: GenerateViralScriptOutput["scriptOptions"][0]) => {
    const textToCopy = `Judul: ${option.judul || "-"}
Hook: ${option.hook || "-"}
Script: ${option.script || "-"}
CTA: ${option.cta || "-"}
Caption singkat: ${option.caption || "-"}
Hashtag: ${option.hashtags || "-"}`;

    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Berhasil Disalin!",
      description: "Script dan semua detailnya telah disalin ke clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center p-8">
          <CardTitle className="text-3xl font-bold">Stop Mikir Keras, Mulai Klik Cerdas</CardTitle>
          <CardDescription className="text-base">
            Masukkan link produk dan preferensi Anda untuk membuat konten viral.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="productLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Produk</FormLabel>
                    <FormControl>
                      <Input placeholder="https://shopee.co.id/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="languageStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gaya Bahasa</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih gaya bahasa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FormSchema.shape.languageStyle.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="hookType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Hook</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis hook" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FormSchema.shape.hookType.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="ctaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis CTA</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis CTA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FormSchema.shape.ctaType.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <FormField
                  control={control}
                  name="scriptLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durasi Video: {scriptLengthValue} detik</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={60}
                          step={1}
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="outputCount"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>Jumlah Opsi: {outputCountValue} script</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={15}
                          step={1}
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full md:w-1/2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Membuat Script...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Buat Script Ajaib
                    </>
                  )}
                </Button>
              </div>
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
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
              <CardFooter className="gap-2">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Hasil Script Ajaib Anda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.scriptOptions.map((option, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">Opsi Script {index + 1}</CardTitle>
                  <CardDescription>
                    Durasi: {option.durasi || "-"} detik
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <ScrollArea className="h-80 w-full rounded-md border p-4">
                    <div className="space-y-4 whitespace-pre-wrap text-sm">
                      <div>
                        <h4 className="font-semibold">Judul:</h4>
                        <p>{option.judul || "-"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Hook:</h4>
                        <p>{option.hook || "-"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Script:</h4>
                        <p>{option.script || "-"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">CTA:</h4>
                        <p>{option.cta || "-"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Caption:</h4>
                        <p>{option.caption || "-"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Hashtag:</h4>
                        <p className="text-muted-foreground">
                          {option.hashtags || "-"}
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-2">
                  <Button variant="outline" onClick={() => handleCopy(option)}>
                    <ClipboardCopy className="mr-2 h-4 w-4" />
                    Salin Semua
                  </Button>
                  <Button onClick={() => exportToDocx(option)}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Ekspor ke Word
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
