// generatePdf.js
import jsPDF from 'jspdf';

export function generatePdf(summary, flagged) {
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text('Medical Report Summary', 10, 10);

  doc.text('Explanation:', 10, 20);
  doc.text(summary.text, 10, 30);

  doc.text('Risk Flags:', 10, 60);
  flagged.forEach((item, i) => {
    doc.text(`${item.label}: ${item.value} (${item.flag})`, 10, 70 + i * 10);
  });

  return doc.output('blob');
}

