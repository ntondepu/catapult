// index.js
import { parsePdf } from './parsePdf.js';
import { runOcr } from './runOcr.js';
import { summarizeText } from './summarizeText.js';
import { flagRisks } from './riskFlagger.js';
import { generatePdf } from './generatePdf.js';

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

