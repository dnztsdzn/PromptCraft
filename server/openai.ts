import OpenAI from "openai";
import { performSearch } from "./search";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function processPrompt(template: string, userInput: string): Promise<string> {
  try {
    // Check if the template contains a search placeholder
    const needsSearch = template.includes("{{search}}");
    let finalPrompt = template;

    if (needsSearch) {
      // Perform search based on user input
      const searchResults = await performSearch(userInput);
      // Replace search placeholder with actual search results
      finalPrompt = template.replace("{{search}}", searchResults);
    }

    // Replace user input placeholder
    finalPrompt = finalPrompt.replace("{{input}}", userInput);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: finalPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "No response generated";
  } catch (error: any) {
    throw new Error(`Error processing prompt: ${error.message}`);
  }
}