import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { upsertDocuments } from '../lib/pinecone';

async function ingestPdf(filePath: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);
  const text: string = data.text;
  const chunkSize = 1000;
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  const docs = chunks.map((chunk, idx) => ({
    id: `${path.basename(filePath)}_${idx}`,
    text: chunk,
    metadata: { source: filePath },
  }));
  await upsertDocuments(docs);
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: ts-node scripts/ingest.ts <PDF_FILE_PATH>');
    process.exit(1);
  }
  await ingestPdf(filePath);
  console.log('Ingestion complete');
}

main().catch((err) => {
  console.error(err);
});
