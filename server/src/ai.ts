import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getAIResponse(
    prompt: string,
    onToken: (token: string) => void,
    signal?: AbortSignal
) {
    const stream = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        stream: true,
    });

    for await (const chunk of stream) {
        if (signal?.aborted) break;
        const text = chunk.choices[0]?.delta?.content;
        if (text) {
            onToken(text);
        }
    }
}
