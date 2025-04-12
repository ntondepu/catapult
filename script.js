// Handle file input and process the file
document.getElementById("fileInput").addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const extractedText = await extractTextFromFile(file); // OCR/PDF text extraction
    displayExtractedText(extractedText);

    const summary = await generateSummary(extractedText);
    displaySummary(summary);

    const questions = await generateFollowUpQuestions(extractedText);
    displayFollowUpQuestions(questions);
});

// Extract text from file (OCR for images, PDF parsing for PDFs)
async function extractTextFromFile(file) {
    if (file.type === "application/pdf") {
        // Handle PDF files
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
        const text = await extractTextFromPDF(pdf);
        return text;
    } else if (file.type.startsWith("image")) {
        // Handle image files with OCR
        return await processImageWithOCR(file);
    }
}

// Generate a summary using Hugging Face's summarization model
async function generateSummary(text) {
    const model = await hf.load('facebook/bart-large-cnn');
    const summary = await model.summarize(text);
    return summary;
}

// Generate follow-up questions based on extracted text
async function generateFollowUpQuestions(text) {
    const model = await hf.load('facebook/bart-large-cnn'); // Replace with the model for follow-ups if needed
    const questions = await model.generateQuestions(text); // Modify this as needed based on Hugging Face capabilities
    return questions;
}

// Display extracted text on the page
function displayExtractedText(text) {
    document.getElementById("extractedText").innerText = text;
}

// Display summary on the page
function displaySummary(summary) {
    document.getElementById("summary").innerText = summary;
}

// Display follow-up questions on the page
function displayFollowUpQuestions(questions) {
    const questionsList = document.getElementById("followUpQuestions");
    questionsList.innerHTML = "";
    questions.forEach(question => {
        const li = document.createElement("li");
        li.textContent = question;
        questionsList.appendChild(li);
    });
}

// Process image with OCR (using Tesseract.js)
async function processImageWithOCR(imageFile) {
    const { createWorker } = Tesseract;
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
}

// Extract text from PDF using pdf.js
async function extractTextFromPDF(pdf) {
    let textContent = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        content.items.forEach(item => {
            textContent += item.str + " ";
        });
    }
    return textContent;
}
