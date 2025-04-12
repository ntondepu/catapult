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

