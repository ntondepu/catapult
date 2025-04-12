<<<<<<< HEAD
// Check if file is selected and run OCR on the image
document.getElementById('processButton').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (file) {
        // Create a URL for the image
        const imageUrl = URL.createObjectURL(file);

        // Step 2: Run Tesseract.js OCR on the image
        Tesseract.recognize(
            imageUrl,
            'eng', // Language, 'eng' stands for English
            {
                logger: function(m) { console.log(m); }, // Log OCR progress
            }
        ).then(({ data: { text } }) => {
            // Step 3: Display the extracted text
            if (text.trim()) {
                document.getElementById('extractedText').textContent = text;
            } else {
                document.getElementById('extractedText').textContent = 'No text found.';
            }
        }).catch((err) => {
            console.error("Error recognizing text:", err);
            document.getElementById('extractedText').textContent = 'Error extracting text.';
        });
    } else {
        document.getElementById('extractedText').textContent = 'Please select a file.';
    }
});
=======
import { processFile } from './src/index.js';

document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // Show loading state
    document.getElementById('results').innerHTML = '<p>Processing...</p>';

    // Process the file
    const { summary, flagged, pdfBlob } = await processFile(file);

    // Display results
    document.getElementById('results').innerHTML = `
      <h3>Summary</h3>
      <p>${summary}</p>
      <h3>Key Findings</h3>
      <ul>
        ${Object.entries(flagged).map(([test, result]) => `
          <li style="color: ${result.flag === 'Green' ? 'green' : result.flag === 'Yellow' ? 'orange' : 'red'}">
            ${test}: ${result.explanation}
          </li>
        `).join('')}
      </ul>
      <button id="downloadPdf">Download PDF Summary</button>
    `;

    // Set up download button
    document.getElementById('downloadPdf').addEventListener('click', () => {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'medical-summary.pdf';
      a.click();
      URL.revokeObjectURL(url);
    });

  } catch (error) {
    document.getElementById('results').innerHTML = `
      <p class="error">Error: ${error.message}</p>
    `;
    console.error(error);
  }
});
>>>>>>> 2891275 (fixed some errors in index.js and parsePdf.js)
