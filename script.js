document.getElementById("processButton").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Please select a file.");
      return;
    }
  
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      extractTextFromImage(file);
    } else if (file.name.endsWith(".pdf")) {
      extractTextFromPDF(file);
    } else {
      alert("Unsupported file type.");
    }
  });
  
  function extractTextFromImage(file) {
    const reader = new FileReader();
    reader.onload = function () {
      const imageDataUrl = reader.result;
      document.getElementById("imagePreview").innerHTML = `<img src="${imageDataUrl}" width="300"/>`;
  
      Tesseract.recognize(imageDataUrl, 'eng', { logger: m => console.log(m) })
        .then(({ data: { text } }) => {
          displayResults(text);
        })
        .catch(err => {
          console.error(err);
          alert("Error during text extraction.");
        });
    };
    reader.readAsDataURL(file);
  }
  
  function extractTextFromPDF(file) {
    const reader = new FileReader();
    reader.onload = function () {
      const typedarray = new Uint8Array(reader.result);
  
      pdfjsLib.getDocument({ data: typedarray }).promise.then(async (pdf) => {
        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str);
          extractedText += strings.join(" ") + "\n";
        }
        displayResults(extractedText);
      });
    };
    reader.readAsArrayBuffer(file);
  }
  
  function displayResults(text) {
    document.getElementById("extractedText").textContent = text;
    const summary = summarizeText(text);
    document.getElementById("summary").textContent = summary;
  
    const questions = generateFollowUpQuestions(text);
    const list = document.getElementById("questionsList");
    list.innerHTML = "";
    questions.forEach(q => {
      const li = document.createElement("li");
      li.textContent = q;
      list.appendChild(li);
    });
  }
  
  function summarizeText(text) {
    const sentences = text.split(/[.?!]\s+/).filter(s => s.length > 20);
    return sentences.slice(0, 2).join(". ") + ".";
  }
  
  function generateFollowUpQuestions(text) {
    const q = [];
    if (/MRI|scan/i.test(text)) {
      q.push("What does the MRI scan imply?");
      q.push("Should I consult a specialist?");
    }
    if (/disc bulge|spinal/i.test(text)) {
      q.push("What are the treatment options?");
      q.push("Is surgery necessary?");
    }
    if (q.length === 0) {
      q.push("What is the main takeaway from this report?");
      q.push("What should I ask my doctor?");
    }
    return q;
  }
  