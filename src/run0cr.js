import Tesseract from 'tesseract.js';

export async function runOCR(file) {
  return new Promise((resolve, reject) => {
    // Create a URL for the file
    const url = URL.createObjectURL(file);
    Tesseract.recognize(
      url,
      'eng',
      {
        logger: m => console.log(m) // Optional: Logs progress in console
      }
    ).then(({ data: { text } }) => {
      resolve(text);
    }).catch(err => {
      reject(err);
    });
  });
}

