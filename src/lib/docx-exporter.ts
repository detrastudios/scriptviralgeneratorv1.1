"use client"

import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export const exportToDocx = (script: string, hashtags: string) => {
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
            spacing: { line: 276, after: 200 }, // 1.15 line spacing, 10pt after
          }
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Script Konten",
            heading: HeadingLevel.HEADING_1,
          }),
          ...script.split('\n').filter(line => line.trim() !== '').map(line => new Paragraph({ 
            text: line,
            style: "Normal"
          })),
          new Paragraph({
            text: "Hashtags",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480 },
          }),
          new Paragraph({
            text: hashtags,
            style: "Normal"
          }),
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
