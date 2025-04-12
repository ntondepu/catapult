import { PDFDocument, rgb } from 'pdf-lib';

async function generatePdfDocument(summary, flaggedResults) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const { width, height } = page.getSize();
  let yPosition = height - 50;

  // Add title
  page.drawText('Medical Report Summary', {
    x: 50,
    y: yPosition,
    size: 18,
    color: rgb(0, 0, 0.5),
  });
  yPosition -= 30;

  // Add summary content
  page.drawText(summary, {
    x: 50,
    y: yPosition,
    size: 12,
    color: rgb(0, 0, 0),
    maxWidth: width - 100,
  });
  yPosition -= 200;

  // Add flagged results
  page.drawText('Key Findings:', {
    x: 50,
    y: yPosition,
    size: 14,
    color: rgb(0.5, 0, 0),
  });
  yPosition -= 20;

  flaggedResults.forEach(result => {
    const color = result.status === 'normal'
      ? rgb(0, 0.5, 0)
      : rgb(0.8, 0, 0);

    page.drawText(
      `${result.test}: ${result.value} (${result.status})`,
      { x: 50, y: yPosition, size: 12, color }
    );
    yPosition -= 20;
  });

  return await pdfDoc.save();
}

// Named export
export async function generatePdf(summary, flaggedResults) {
  try {
    const pdfBytes = await generatePdfDocument(summary, flaggedResults);
    return pdfBytes;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Could not generate PDF');
  }
}