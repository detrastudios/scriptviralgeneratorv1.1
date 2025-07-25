"use client"

import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import type { GenerateViralScriptOutput } from '@/ai/flows/generate-viral-script';

type ScriptOption = GenerateViralScriptOutput['scriptOptions'][0];

export const exportToDocx = (option: ScriptOption) => {
  const { judul, hook, script, cta, caption, hashtags, durasi } = option;

  const doc = new Document({
    creator: "Script Viral Generator",
    title: "Script Konten Affiliate",
    description: "Dihasilkan oleh Script Viral Generator",
    styles: {
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 32, // 16pt
            bold: true,
            color: "2E2E2E",
          },
          paragraph: {
            spacing: { after: 240 }, // 12pt
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 28, // 14pt
            bold: true,
            color: "4E4E4E",
          },
          paragraph: {
            spacing: { before: 360, after: 120 },
          },
        },
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 24, // 12pt
            color: "595959",
          },
          paragraph: {
            spacing: { line: 276, after: 160 }, // 1.15 line spacing, 8pt after
          }
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `Script Konten (Durasi: ${durasi} detik)`,
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph({ text: "Judul", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: judul, style: "Normal" }),

          new Paragraph({ text: "Hook", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: hook, style: "Normal" }),
          
          new Paragraph({ text: "Script", heading: HeadingLevel.HEADING_2 }),
          ...script.split('\n').filter(line => line.trim() !== '').map(line => new Paragraph({ 
            text: line,
            style: "Normal"
          })),

          new Paragraph({ text: "CTA", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: cta, style: "Normal" }),

          new Paragraph({ text: "Caption Singkat", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: caption, style: "Normal" }),

          new Paragraph({ text: "Hashtags", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: hashtags, style: "Normal" }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, "script-viral.docx");
  }).catch(error => {
    console.error("Gagal membuat dokumen:", error);
  });
};
