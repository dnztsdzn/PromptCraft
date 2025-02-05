import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function processPrompt(template: string, userInput: string): Promise<string> {
  try {
    const finalPrompt = template.replace("{{input}}", userInput);

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
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}
