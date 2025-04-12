import Tesseract from 'tesseract.js';

export async function runOcr(file) {
  try {
    const url = URL.createObjectURL(file);

    const { data: { text } } = await Tesseract.recognize(
      url,
      'eng',
      { logger: m => console.log(m) }
    );

    URL.revokeObjectURL(url);
    return text;
  } catch (error) {
    console.error('OCR Processing Error:', error);
    throw new Error('Failed to process image file');
  }
}