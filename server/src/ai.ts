import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getAIResponse(
    prompt: string,
    onToken: (token: string) => void,
    signal?: AbortSignal
) {
    const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: [{ parts: [{ text: prompt }], role: "user" }],
    });

    for await (const chunk of response) {
        if (signal?.aborted) break;
        const text = chunk.text;
        if (text) {
            onToken(text);
        }
    }
}
