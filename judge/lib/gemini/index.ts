import { GoogleGenAI } from "@google/genai";
import { systemPrompts } from "../systemPrompt";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function askGemini(userInputToken: string) {
    const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: userInputToken,
        config: {
            systemInstruction: systemPrompts,
            maxOutputTokens: 1024,
        },
    });

    let message = "";

    for await (const chunk of stream) {
        message += chunk.text ?? "";
    }

    return message;
}