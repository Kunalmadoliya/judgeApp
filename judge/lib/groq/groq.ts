import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});



export async function askGroq(prompt: string) {
    const stream = await groq.chat.completions.create({

        messages: [

            {
                role: "system",
                content: "You are a helpful assistant.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],

        model: "openai/gpt-oss-20b",
        temperature: 0.5,
        max_completion_tokens: 1024,
        top_p: 1,
        stop: null,

        // If set, partial message deltas will be sent.
        stream: true,
    });

    let message = ""
    for await (const chunk of stream) {

        message += chunk.choices[0]?.delta?.content || ""
    }

    return message
}

