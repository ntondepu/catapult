import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Summarizes medical text using AI
 * @param {string} text - Medical text to summarize
 * @returns {Promise<string>} - Plain English summary
 */
export async function summarizeText(text) {
  try {
    // Truncate very long texts
    const truncatedText = text.length > 12000
      ? text.substring(0, 12000) + "... [truncated]"
      : text;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical translator. Explain lab results in simple terms without diagnosis. Highlight abnormal values. Never mention patient names or IDs."
        },
        {
          role: "user",
          content: truncatedText
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    return response.choices[0]?.message?.content || "No summary available";
  } catch (error) {
    console.error("AI Summarization Error:", error);
    throw new Error("Failed to generate summary");
  }
}