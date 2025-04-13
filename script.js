let latestSummary = "";
let latestQuestions = [];
let latestSymptomInput = "";
let latestSymptomResponse = [];
let latestSummaryTranslated = {};

const apiKey = "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";

// File processing
const fileInput = document.getElementById("fileInput");
const processButton = document.getElementById("processButton");

processButton.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Please select a file.");

  const fileType = file.type;
  if (fileType.startsWith("image/")) {
    processImage(file);
  } else if (file.name.endsWith(".pdf")) {
    processPDF(file);
  } else {
    alert("Unsupported file type.");
  }
});

async function processImage(file) {
  const reader = new FileReader();
  reader.onload = async function () {
    const imageUrl = reader.result;
    document.getElementById("imagePreview").innerHTML = `<img src="${imageUrl}" width="300"/>`;

    const result = await Tesseract.recognize(imageUrl, 'eng', { logger: m => console.log(m) });
    displayResults(result.data.text);
  };
  reader.readAsDataURL(file);
}

async function processPDF(file) {
  const reader = new FileReader();
  reader.onload = async function () {
    const typedarray = new Uint8Array(reader.result);
    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }
    displayResults(text);
  };
  reader.readAsArrayBuffer(file);
}

async function displayResults(text) {
  document.getElementById("extractedText").textContent = text;
  document.getElementById("summary").textContent = "Summarizing...";
  document.getElementById("questionsList").innerHTML = "<li>Generating questions...</li>";

  latestSummary = await summarizeText(text);
  latestQuestions = await generateFollowUpQuestions(text);

  document.getElementById("summary").textContent = latestSummary;
  const list = document.getElementById("questionsList");
  list.innerHTML = "";
  latestQuestions.forEach(q => {
    const li = document.createElement("li");
    li.textContent = q;
    list.appendChild(li);
  });

  latestSummaryTranslated["es"] = await translateSummary(latestSummary, "es");
}

async function summarizeText(text) {
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ inputs: text })
    });
    const data = await res.json();
    return data?.[0]?.summary_text || "No summary generated.";
  } catch (err) {
    console.error("Summary error:", err);
    return "Error generating summary.";
  }
}

async function generateFollowUpQuestions(text) {
  const sentences = text.match(/[^.!?\n]+[.!?]/g) || [];
  const targets = sentences.slice(0, 2);
  const questions = [];

  for (const sentence of targets) {
    const prompt = `generate question: <hl> ${sentence} <hl>`;
    try {
      const res = await fetch("https://api-inference.huggingface.co/models/valhalla/t5-base-qg-hl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({ inputs: prompt })
      });
      const data = await res.json();
      const question = data?.[0]?.generated_text;
      if (question) questions.push(question);
    } catch (err) {
      console.error("QG error:", err);
    }
  }
  return questions.length ? questions : ["No questions generated."];
}

async function translateSummary(text, targetLang) {
  try {
    const model = targetLang === "es" ? "Helsinki-NLP/opus-mt-en-es" : "";
    if (!model) return "Language not supported.";

    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ inputs: text })
    });

    const data = await res.json();
    return data?.[0]?.translation_text || "Translation failed.";
  } catch (err) {
    console.error("Translation error:", err);
    return "Translation error.";
  }
}

// Translate button
const translateBtn = document.getElementById("translateToSpanishButton");
translateBtn.addEventListener("click", () => {
  const translated = latestSummaryTranslated["es"];
  if (translated) {
    alert("Traducción al español:\n\n" + translated);
  } else {
    alert("No Spanish translation available.");
  }
});

// Read summary aloud
const readBtn = document.getElementById("readSummaryButton");
readBtn.addEventListener("click", () => {
  const summaryText = document.getElementById("summary").textContent;
  if (!summaryText || summaryText === "No summary yet.") {
    alert("No summary to read.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(summaryText);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  speechSynthesis.speak(utterance);
});

// Symptom Checker
const symptomInput = document.getElementById("symptomInput");
const symptomSelect = document.getElementById("symptomExamples");
const checkSymptomsBtn = document.getElementById("checkSymptomsButton");
const symptomResults = document.getElementById("symptomResults");

symptomSelect.addEventListener("change", function () {
  if (this.value) symptomInput.value = this.value;
});

checkSymptomsBtn.addEventListener("click", async () => {
  const input = symptomInput.value.trim();
  if (!input) return alert("Enter your symptoms.");

  symptomResults.style.display = "block";
  symptomResults.innerHTML = "<li>Analyzing symptoms...</li>";
  latestSymptomInput = input;

  try {
    const res = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: `Return only one follow-up question a doctor might ask based on these symptoms: ${input}`
      })
    });

    const data = await res.json();
    const raw = data?.[0]?.generated_text || "No suggestion available.";
    const cleaned = raw
      .replace(/.*symptoms?:/i, '')
      .replace(/^\["'\-\d•\s]*/, '')
      .trim();

    latestSymptomResponse = [cleaned];
    symptomResults.innerHTML = "";
    latestSymptomResponse.forEach(q => {
      const li = document.createElement("li");
      li.textContent = q;
      symptomResults.appendChild(li);
    });
  } catch (err) {
    console.error("Symptom checker error:", err);
    symptomResults.textContent = "Error analyzing symptoms.";
  }
});

// Download PDF
const downloadBtn = document.getElementById("downloadDoctorPdf");
downloadBtn.addEventListener("click", generateDoctorPdf);

async function generateDoctorPdf() {
  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  let y = height - 40;

  page.drawText("MedLens Report", { x: 50, y: y, size: 20, color: PDFLib.rgb(0.2, 0.2, 0.6) });
  y -= 30;

  page.drawText("Summary:", { x: 50, y: y, size: 14 });
  y -= 20;
  const summaryLines = splitTextToLines(latestSummary, 80);
  summaryLines.forEach(line => {
    page.drawText(line, { x: 50, y: y, size: 12 });
    y -= 18;
  });

  y -= 20;
  page.drawText("Follow-Up Questions:", { x: 50, y: y, size: 14 });
  y -= 20;
  latestQuestions.forEach((q, i) => {
    if (y < 60) return;
    page.drawText(`${i + 1}. ${q}`, { x: 60, y: y, size: 12 });
    y -= 18;
  });

  if (latestSymptomInput && latestSymptomResponse.length) {
    y -= 30;
    page.drawText("Symptom Checker:", { x: 50, y: y, size: 14 });
    y -= 20;
    page.drawText(`Input: ${latestSymptomInput}`, { x: 60, y: y, size: 12 });
    y -= 20;
    latestSymptomResponse.forEach((q, i) => {
      if (y < 40) return;
      page.drawText(`• ${q}`, { x: 70, y: y, size: 12 });
      y -= 16;
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "medlens-report.pdf";
  link.click();
}

function splitTextToLines(text, maxLength) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (let word of words) {
    if ((line + word).length > maxLength) {
      lines.push(line);
      line = word + " ";
    } else {
      line += word + " ";
    }
  }
  if (line) lines.push(line);
  return lines;
}
