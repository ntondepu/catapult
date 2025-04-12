export async function parsePdf(file) {
  try {
    // Dynamic import handles module compatibility
    const pdfjsLib = await import('pdfjs-dist');
    const { getDocument } = pdfjsLib.default || pdfjsLib;

    const worker = await import('pdfjs-dist/build/pdf.worker.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

    // Rest of your implementation...
  } catch (error) {
    console.error('PDF Processing Error:', error);
    throw new Error('Failed to parse PDF document');
  }
}