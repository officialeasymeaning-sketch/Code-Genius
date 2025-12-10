import { GoogleGenAI } from "@google/genai";
import { ProgrammingLanguage } from "../types";

// Initialize the Gemini client
// Note: In a real deployment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCode = async (
  language: ProgrammingLanguage,
  prompt: string
): Promise<string> => {
  try {
    const modelId = 'gemini-3-pro-preview'; // Using the recommended model for coding tasks

    const fullPrompt = `
      You are an expert senior software engineer and code generator.
      
      Task: Write high-quality, efficient, and well-commented code in ${language}.
      Requirement: ${prompt}
      
      Guidelines:
      1. ONLY return the code. Do not wrap it in markdown code blocks (e.g., \`\`\`python ... \`\`\`) if possible, but if you do, ensure it is clean.
      2. If the language is HTML, include necessary CSS within <style> tags and JS within <script> tags if appropriate for a standalone example, unless requested otherwise.
      3. For CSS/JS/TS/etc., provide the raw file content.
      4. Ensure the code is runnable or syntactically correct.
      5. Do not include conversational text before or after the code.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: fullPrompt,
      config: {
        temperature: 0.2, // Lower temperature for more deterministic code
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
    });

    let text = response.text || '';

    // Robust extraction: Check for markdown code blocks and extract content inside
    // Matches ```language? [content] ```
    const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/;
    const match = codeBlockRegex.exec(text);
    if (match && match[1]) {
      text = match[1];
    } else {
      // If no code blocks, assume the whole text is code but trim whitespace
      text = text.trim();
    }

    return text;
  } catch (error) {
    console.error("Error generating code:", error);
    throw new Error("Failed to generate code. Please try again.");
  }
};