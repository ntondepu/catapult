import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0';

// Load the summarization and text-generation pipelines
const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
const questionGenerator = await pipeline('text-generation', 'Xenova/gpt2');

const fileInput = document.getElementById('fileInput');
const processButton = document.getElementById('processButton');
const imagePreview = document.getElementById('imagePreview');
const extractedTextElem = document.getElementById('extractedText');
const summaryElem = document.getElementById('summary');
const questionsList = document.getElementById('questionsList');

let extractedText = '';

fileInput.addEventListener('change', handleFileSelect);
processButton.addEventListener('click', async () => {
  if (!extractedText) {
    alert('Please upload and extract text first.');
    return;
  }

  // Run summarization
  summaryElem.textContent = 'Generating summary...';
  const summaryResult = await summarizer(extractedText, {
    min_length: 20,
    max_length: 100,
  });
  summaryElem.textContent = summaryResult[0].summary_text;

  // Generate follow-up questions
  questionsList.innerHTML = '<li>Generating questions...</li>';
  const questionResult = await questionGenerator(
    `Suggest 3 follow-up questions a patient might ask based on this summary: ${summaryResult[0].summary_text}`,
    { max_length: 100 }
  );

  const questions = questionResult[0].generated_text
    .split(/[0-9]\.|\n/)
    .map(q => q.trim())
    .filter(q => q.length > 10);

  questionsList.innerHTML = '';
  questions.forEach(q => {
    const li = document.createElement('li');
    li.textContent = q;
    questionsList.appendChild(li);
  });
});

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  imagePreview.innerHTML = '';
  extractedTextElem.textContent = 'Extracting text...';
  summaryElem.textContent = 'No summary yet.';
  questionsList.innerHTML = '<li>No questions generated yet.</li>';

  const reader = new FileReader();

  if (file.type === 'application/pdf') {
    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      extractedText = text;
      extractedTextElem.textContent = text.trim();
    };
    reader.readAsArrayBuffer(file);
  } else if (file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Uploaded image preview';
    img.style.maxWidth = '100%';
    imagePreview.appendChild(img);

    const result = await Tesseract.recognize(url, 'eng', {
      logger: m => console.log(m),
    });
    extractedText = result.data.text;
    extractedTextElem.textContent = result.data.text.trim();
  } else {
    alert('Unsupported file type. Please upload a PDF or image.');
  }
}
