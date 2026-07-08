import { askCerebras } from "@/lib/cerebras/index"
import { askGemini } from "@/lib/gemini/index"
import { askGroq } from "@/lib/groq/groq"
import { evalOpenai } from "@/lib/openai/openai";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const cerebrasPromise = askCerebras(message);
        const geminiPromise = askGemini(message);
        const groqPromise = askGroq(message);

        const [cerebrasRes, geminiRes, groqRes] = await Promise.all([
            cerebrasPromise,
            geminiPromise,
            groqPromise,
        ]);


        const reply = await evalOpenai(message, cerebrasRes, geminiRes, groqRes)

        return Response.json({
            success: true,
            response: {
                reply
            },
        });
    } catch (error) {
        console.log(error);
        return Response.json({
            message: "Something went wrong",
            status: 500,
        })
    }
}