import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


export async function askGemini(userInputToken: string) {
    const stream = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: userInputToken,
        stream: true,
         generation_config: {
            max_output_tokens : 1024
        },
    });

    let message = ""
    for await (const event of stream) {
        if (event.event_type === "step.delta") {
            if (event.delta.type === "text") {
                message += event.delta.text
            }
        }
    }


    return message
}   