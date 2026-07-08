import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const EvaluationSchema = z.object({
    winner: z.enum(["cerebras", "gemini", "groq"]),

    scores: z.object({
        cerebras: z.object({
            accuracy: z.number().min(1).max(10),
            clarity: z.number().min(1).max(10),
            completeness: z.number().min(1).max(10),
        }),

        gemini: z.object({
            accuracy: z.number().min(1).max(10),
            clarity: z.number().min(1).max(10),
            completeness: z.number().min(1).max(10),
        }),

        groq: z.object({
            accuracy: z.number().min(1).max(10),
            clarity: z.number().min(1).max(10),
            completeness: z.number().min(1).max(10),
        }),
    }),

    reason: z.string(),

    finalAnswer: z.string(),
});

export async function evalOpenai(
    originalPrompt: string,
    cerebrasRes: string,
    geminiRes: string,
    groqRes: string
) {
    const response = await openai.responses.parse({
        model: "gpt-4o-mini",

        input: [
            {
                role: "system",
                content: `
You are an unbiased AI judge.

Compare the responses from three different AI models.

Evaluate each response on:
1. Accuracy
2. Clarity
3. Completeness

Rules:
- Score each category from 1 to 10.
- Choose exactly one winner.
- Explain why it won.
- Create the best possible final answer by combining the strengths of all responses.
- Return ONLY the structured output.
        `,
            },

            {
                role: "user",
                content: `
Original Prompt:
${originalPrompt}

------------------------

Cerebras Response:
${cerebrasRes}

------------------------

Gemini Response:
${geminiRes}

------------------------

Groq Response:
${groqRes}
        `,
            },
        ],

        text: {
            format: zodTextFormat(EvaluationSchema, "evaluation"),
        },
    });

    return response.output_parsed;
}