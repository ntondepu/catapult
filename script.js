import { parsePdf } from './src/parsePdf.js';
import { runOcr } from './src/runOcr.js';
import { stripPII, validateFile } from './src/utils.js';

// Store the selected file globally
let selectedFile = null;

// File selection handler
document.getElementById('fileInput').addEventListener('change', (e) => {
  selectedFile = e.target.files[0];
  document.getElementById('processButton').disabled = !selectedFile;
});

// Process button handler
document.getElementById('processButton').addEventListener('click', async () => {
  if (!selectedFile) {
    document.getElementById('results').innerHTML = `
      <p class="error">Please select a file first!</p>
    `;
    return;
  }
// In your script.js - Make sure you have this event listener:
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  document.getElementById('processButton').disabled = !file; // Enable if file exists
});

  try {
    // Validate file
    validateFile(selectedFile);

    // Show loading state
    document.getElementById('results').innerHTML = '<p>Processing your file...</p>';
    document.getElementById('processButton').disabled = true;
    document.getElementById('fileInput').disabled = true;

    // Process file based on type
    let extractedText;
    if (selectedFile.type === 'application/pdf') {
      extractedText = await parsePdf(selectedFile);
    } else {
      extractedText = await runOcr(selectedFile);
    }

    // Clean the text
    const cleanText = stripPII(extractedText);

    // Display results
    document.getElementById('results').innerHTML = `
      <h3>Extracted Text:</h3>
      <div class="text-output">${cleanText}</div>
      <button id="clearResults">Clear Results</button>
    `;

    // Add clear results button functionality
    document.getElementById('clearResults').addEventListener('click', () => {
      document.getElementById('results').innerHTML = '';
      document.getElementById('fileInput').value = '';
      selectedFile = null;
      document.getElementById('processButton').disabled = true;
      document.getElementById('fileInput').disabled = false;
    });

  } catch (error) {
    document.getElementById('results').innerHTML = `
      <p class="error">Error: ${error.message}</p>
    `;
    console.error('Processing error:', error);
    document.getElementById('processButton').disabled = false;
    document.getElementById('fileInput').disabled = false;
  } finally {
    document.getElementById('processButton').disabled = false;
  }
});