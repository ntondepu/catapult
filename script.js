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
   
   
   async function displayResults(text) {
    document.getElementById("extractedText").textContent = text;
   
   
    // Summarize using Hugging Face
    document.getElementById("summary").textContent = "Summarizing...";
    const summary = await generateSummary_HF(text);
    document.getElementById("summary").textContent = summary;
   
   
    // Generate follow-up questions
    document.getElementById("questionsList").innerHTML = "<li>Generating questions...</li>";
    const questions = await generateFollowUpQuestions_HF(text);
    const list = document.getElementById("questionsList");
    list.innerHTML = "";
    questions.forEach(q => {
      const li = document.createElement("li");
      li.textContent = q;
      list.appendChild(li);
    });
   }
   
   
   // ============================
   // AI: Summarization via Hugging Face
   // ============================
   async function generateSummary_HF(text) {
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optional: use a token to avoid rate limits
           "Authorization": "Bearer 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"
        },
        body: JSON.stringify({ inputs: text })
      });
   
   
      const result = await response.json();
      return result?.[0]?.summary_text || "No summary generated.";
    } catch (error) {
      console.error("Summary generation error:", error);
      return "Error generating summary.";
    }
   }
   
   
   // ============================
   // AI: Question Generation via Hugging Face
   // ============================
   async function generateFollowUpQuestions_HF(text) {
    const sentences = getHighlightedSentences(text);
    const questions = [];
   
   
    for (const sentence of sentences) {
      const prompt = `generate question: <hl> ${sentence} <hl>`;
      try {
        const response = await fetch("https://api-inference.huggingface.co/models/valhalla/t5-base-qg-hl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Optional: use a token here as well
             "Authorization": "Bearer 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"
          },
          body: JSON.stringify({ inputs: prompt })
        });
   
   
        const data = await response.json();
        const question = data?.[0]?.generated_text;
        if (question) questions.push(question);
      } catch (error) {
        console.error("Question generation error:", error);
      }
    }
   
   
    return questions.length ? questions : ["No questions generated."];
   }
   
   
   function getHighlightedSentences(text) {
    const sentences = text.match(/[^.!?\n]+[.!?]/g) || [];
    return sentences.slice(0, 2); // First 2 sentences
   }
   