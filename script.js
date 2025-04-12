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
