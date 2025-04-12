import Tesseract from 'tesseract.js';

export async function runOcr(file) {
    return new Promise((resolve, reject) => {
        // Create a URL for the file (from the remote version)
        const url = URL.createObjectURL(file);

        // Use Tesseract to recognize text
        Tesseract.recognize(
            url, // Using the URL for the file
            'eng', // Language for OCR (English)
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
