import { parsePdf } from './src/parsePdf.js';
import { runOcr } from './src/runOcr.js';
import { stripPII, validateFile } from './src/utils.js';

document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // Validate file
    validateFile(file);

    // Show loading state
    document.getElementById('results').innerHTML = '<p>Processing your file...</p>';

    // Process file based on type
    let extractedText;
    if (file.type === 'application/pdf') {
      extractedText = await parsePdf(file);
    } else {
      extractedText = await runOcr(file);
    }

    // Clean the text
    const cleanText = stripPII(extractedText);

    // Display results (simplified for now)
    document.getElementById('results').innerHTML = `
      <h3>Extracted Text:</h3>
      <div class="text-output">${cleanText}</div>
    `;

  } catch (error) {
    document.getElementById('results').innerHTML = `
      <p class="error">Error: ${error.message}</p>
    `;
    console.error('Processing error:', error);
  }
});