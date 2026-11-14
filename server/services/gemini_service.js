import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const askGemini = async (input) => {
    const interaction = await ai.interactions.create({
        model: "models/gemini-4-hydrogen",
        input,
        generation_config: {
            max_output_tokens: 65536,
            thinkingLevel: "high",
        },
    });

    // Collect the text from the model's output steps
    return (interaction.steps ?? [])
        .filter((step) => step.type === "model_output")
        .flatMap((step) => step.content ?? [])
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("")
        .trim();
};
