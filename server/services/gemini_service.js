import { GoogleGenAI } from "@google/genai";

export const askGemini = async (input) => {
    // created here (not at file load) so GEMINI_API_KEY is already loaded from .env
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const interaction = await ai.interactions.create({
        model: "models/gemini-4-hydrogen",
        input,
        generation_config: {
            max_output_tokens: 65536,
            thinking_level: "high",
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
