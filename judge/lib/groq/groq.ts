import Groq from "groq-sdk";
import { systemPrompts } from '../systemPrompt';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});



export async function askGroq(prompt: string) {
    const stream = await groq.chat.completions.create({

        messages: [

            {
                role: "system",
                content: systemPrompts,
            },
            {
                role: "user",
                content: prompt,
            },
        ],

        model: "llama-3.3-70b-versatile",

        max_completion_tokens: 1024,


        // If set, partial message deltas will be sent.
        stream: true,
    });

    let message = ""
    for await (const chunk of stream) {

        message += chunk.choices[0]?.delta?.content || ""
    }

    return message
}

