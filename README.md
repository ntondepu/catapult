# MedLens

MedLens is a privacy-first AI-powered tool that helps users understand medical reports by converting complex terminology into simple language, highlighting potential health concerns, and suggesting smart follow-up questions for doctors. Designed to be entirely client-side, it ensures that sensitive medical data never leaves the user's browser.

## Inspiration

Understanding medical reports can be difficult for non-experts. The complex jargon and lab results often leave people feeling anxious and confused. We were inspired to create a tool that helps people make sense of their health data in a way that is simple, private, and empowering. Our goal was to bridge the gap between raw medical data and actionable understanding, without replacing doctors—just making their patients more informed.

## What it does

- Accepts uploads of medical reports in PDF, JPG, or PNG format
- Extracts text using OCR (Tesseract.js) or PDF parsing (PDF.js)
- Converts extracted medical terms into plain English summaries using an LLM
- Flags any health risks with color codes (Green, Yellow, Red)
- Suggests relevant follow-up questions to ask a healthcare provider
- Allows users to download a full summary report as a PDF

## How we built it

- **Frontend**: Built with HTML, CSS, and vanilla JavaScript for simplicity and accessibility
- **OCR**: Implemented with Tesseract.js to support image-based reports
- **PDF Parsing**: Handled using Mozilla's PDF.js library
- **Summarization & Q&A**: LLM prompts designed for clarity, optionally using GPT-4
- **Risk Flagging**: Logic to flag abnormal values using Mayo Clinic ranges
- **PDF Export**: Client-side generation of downloadable summary reports
- **Security-first**: No backend, no data collection, no PHI storage

## Challenges we ran into

- Maintaining user privacy while dealing with medical data
- Ensuring accurate OCR from poorly scanned or handwritten reports
- Handling variations in medical terminology and formatting across documents
- Creating useful but safe LLM prompts that avoid medical misinterpretation
- Designing a user-friendly interface that works well across devices

## Accomplishments that we're proud of

- A fully functioning tool that runs 100% in-browser with no backend dependency
- Clean and intuitive user experience, especially for non-technical users
- A system that complies with basic HIPAA-safe design principles
- Successfully integrated multiple technologies (OCR, LLMs, PDF parsing) into one seamless flow

## What we learned

- How to use browser-based OCR and PDF libraries
- How to design safe and effective LLM prompts for medical text
- Strategies for ensuring privacy without a backend
- Frontend best practices for building responsive, modular apps
- How to handle medical data ethically and legally

## What's next for MedLens

- Build a downloadable desktop version for fully offline use
- Add multi-language support for global accessibility
- Explore partnerships with HIPAA-compliant cloud services for optional expansion
- Integrate accessibility features such as voice summaries and screen reader support
- Offer personalized risk assessment tools based on age, gender, and history

## Tech Stack

- JavaScript, HTML, CSS
- Tesseract.js (OCR)
- PDF.js (PDF parsing)
- OpenAI GPT-4 API (optional for summarization)
- Node.js and npm (development environment)
- Netlify or Vercel (optional for deployment)

## Setup Instructions

1. Clone the repo  
   `git clone https://github.com/yourusername/medlens.git`

2. Navigate into the directory  
   `cd medlens`

3. Install dependencies (if using local development with Node.js)  
   `npm install`

4. Run the app locally (or open `index.html` directly in your browser)  
   `npm start` or just double-click `index.html`

> **Note**: All processing is done in the browser. No data is uploaded or stored.

## License

This project is open-source and available under the MIT License.
