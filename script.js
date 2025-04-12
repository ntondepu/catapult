// script.js

// Wait for the document to be ready
document.getElementById("processButton").addEventListener("click", function () {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const fileType = file.type;
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const fileContent = event.target.result;
        
        if (fileType.includes("image")) {
            // Image processing (OCR)
            Tesseract.recognize(fileContent, 'eng', { logger: m => console.log(m) })
                .then(({ data: { text } }) => {
                    document.getElementById("extractedText").textContent = text;
                    generateSummary(text);
                });
        } else if (fileType.includes("pdf")) {
            // PDF processing
            const loadingTask = pdfjsLib.getDocument({data: fileContent});
            loadingTask.promise.then(function(pdf) {
                let text = '';
                const numPages = pdf.numPages;

                const extractTextFromPage = function(pageNum) {
                    pdf.getPage(pageNum).then(function(page) {
                        page.getTextContent().then(function(textContent) {
                            text += textContent.items.map(item => item.str).join(' ') + '\n';
                            if (pageNum < numPages) {
                                extractTextFromPage(pageNum + 1);
                            } else {
                                document.getElementById("extractedText").textContent = text;
                                generateSummary(text);
                            }
                        });
                    });
                };
                extractTextFromPage(1);
            });
        } else {
            alert("Unsupported file type.");
        }
    };
    
    reader.readAsDataURL(file);  // Read file as Data URL (works for local files)
});

// Generate Summary based on extracted text
function generateSummary(text) {
    const summary = text.slice(0, 500) + '...'; // Simple summary by truncating text
    document.getElementById("summary").textContent = summary;
    
    // Generate simple follow-up questions
    const questions = [
        "Can you clarify certain terms from this text?",
        "What are the next steps based on this information?",
        "Are there any side effects mentioned?"
    ];
    
    const questionsList = document.getElementById("questionsList");
    questionsList.innerHTML = '';
    questions.forEach(q => {
        const li = document.createElement("li");
        li.textContent = q;
        questionsList.appendChild(li);
    });
}
