<<<<<<< HEAD
// src/summarizeText.js

const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config(); // Make sure you have .env file for API key

// Initialize OpenAI with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Secure your API key!
});
const openai = new OpenAIApi(configuration);

/**
 * Summarizes medical text into plain language and suggests questions.
 * @param {string} rawText - Raw text from PDF/OCR.
 * @returns {Promise<string>} - Summary and follow-up questions.
 */
async function summarizeText(rawText) {
  const prompt = `
You are a helpful medical assistant for patients. 
1. Read the following lab results or medical report. 
2. Summarize the findings in simple, non-technical language. 
3. Suggest 3–5 relevant questions the patient should ask their doctor.

Medical Text:
"""
${rawText}
"""

Plain-English Summary:
`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 700,
    });

    const summary = response.data.choices[0].message.content;
    return summary;
  } catch (err) {
    console.error("Error summarizing text:", err);
    return "Sorry, we couldn't summarize the text. Please try again later.";
  }
}

module.exports = summarizeText;

=======
const { Configuration, OpenAIApi } = require("openai");

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Set securely!
});
const openai = new OpenAIApi(configuration);

async function summarizeText(rawText) {
  const prompt = `
You're a helpful medical assistant for patients.
1. Read the following lab results or medical report.
2. Summarize the findings in simple terms.
3. Suggest 3-5 questions the patient might ask their doctor.

Input:
"""${rawText}"""

Output:
`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return response.data.choices[0].message.content;
}

>>>>>>> 2fce1056c1289a155fbecec5949ca37f99552afa
