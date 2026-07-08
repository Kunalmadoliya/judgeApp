import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { systemPrompts } from "../systemPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EvaluationSchema = z.object({
  winner: z.enum(["cerebras", "gemini", "groq"]),

  scores: z.object({
    cerebras: z.object({
      accuracy: z.number().int().min(1).max(10),
      clarity: z.number().int().min(1).max(10),
      completeness: z.number().int().min(1).max(10),
    }),

    gemini: z.object({
      accuracy: z.number().int().min(1).max(10),
      clarity: z.number().int().min(1).max(10),
      completeness: z.number().int().min(1).max(10),
    }),

    groq: z.object({
      accuracy: z.number().int().min(1).max(10),
      clarity: z.number().int().min(1).max(10),
      completeness: z.number().int().min(1).max(10),
    }),
  }),

  reason: z
    .string()
    .max(200)
    .describe("Maximum two short sentences explaining why the winner is best."),

  finalAnswer: z
    .string()
    .max(3000)
    .describe("The best possible answer by combining the strengths of all responses."),
});

export async function evalOpenai(
  originalPrompt: string,
  cerebrasRes: string,
  geminiRes: string,
  groqRes: string
) {
  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    temperature: 0,

    input: [
      {
        role: "system",
        content: `
You are an expert AI evaluator.

Your only job is to objectively compare three AI responses.

Evaluation Criteria:
1. Accuracy
   - Factual correctness
   - No hallucinations
   - Follows the user's request

2. Clarity
   - Easy to read
   - Well organized
   - Concise without losing meaning

3. Completeness
   - Covers all important points
   - Doesn't miss required information
   - Answers the user's prompt fully

Scoring Rules:
- Give ONLY integer scores from 1 to 10.
- Judge only the response quality.
- Never favor a model because of its name.
- Penalize hallucinations and incorrect facts.
- Penalize unnecessary verbosity.
- Reward correctness over length.
- Choose exactly ONE winner.

Reason Rules:
- Maximum two short sentences.
- Explain only why the winner performed best.

Final Answer Rules:
- Create one final answer for the user.
- Combine only the strongest parts of the responses.
- Remove duplicate information.
- Remove incorrect or unsupported claims.
- Keep it concise, accurate, and complete.
- Do not mention any model names.
- Answer the original prompt directly.

Return ONLY the structured output matching the schema.
        `,
      },
      {
        role: "assistant",
        content: systemPrompts,
      },
      {
        role: "user",
        content: `
Original Prompt:
${originalPrompt}

----------------------------------------

Cerebras Response:
${cerebrasRes}

----------------------------------------

Gemini Response:
${geminiRes}

----------------------------------------

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