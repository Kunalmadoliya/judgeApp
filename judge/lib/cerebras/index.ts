import Cerebras from '@cerebras/cerebras_cloud_sdk';
import  {systemPrompts}  from '../systemPrompt';

const client = new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY
});

export async function askCerebras(userInputToken: string ) {
    const stream = await client.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompts,
            },
            {
                role: "user",
                content: userInputToken,
            },
        ],
        model: "zai-glm-4.7",
        stream: true,
        max_tokens : 1024
    });

    let message = ""
    for await (const chunk of stream) {
        message += chunk.choices[0]?.delta?.content || ''
    }

    return message
}
