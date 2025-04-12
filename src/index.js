import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { parsePdf } from './parsePdf.js';
import { runOcr } from './runOcr.js';
import { summarizeText } from './summarizeText.js';
import { analyzeReport as flagRisks } from './riskFlagger.js';
import { generatePdf } from './generatePdf.js';
import { webcrypto } from 'node:crypto';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.mjs',
  import.meta.url
).toString();

// Polyfills
globalThis.crypto = webcrypto;

// Only include if you actually need DOMMatrix
try {
  const { DOMMatrix } = await import('canvas');
  global.DOMMatrix = DOMMatrix;
} catch {
  console.warn('Canvas not available - DOMMatrix polyfill skipped');
}

export async function processFile(file) {
  let text = '';

  if (file.type === 'application/pdf') {
    text = await parsePdf(file);
  } else if (file.type.startsWith('image/')) {
    text = await runOcr(file);
  }

  const summary = await summarizeText(text);
  const flagged = flagRisks(summary);
  const pdfBlob = await generatePdf(summary, flagged);

  return { summary, flagged, pdfBlob };
}