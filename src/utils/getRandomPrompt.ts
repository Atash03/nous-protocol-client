import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PROMPT = "Generate an interesting and thought-provoking prompt to give to human-centric language models and simulators, but keep it simple and easy to understand. Just give the prompt itself, don't give additional instructions, and don't give the previous prompt."

export async function getRandomPrompt(): Promise<string> {
    if (!GEMINI_API_KEY) {
        process.exit(0)
    }
    const ai = new GoogleGenAI({vertexai: false, apiKey: GEMINI_API_KEY});

    const chat = ai.chats.create({model: 'gemini-2.0-flash'});

    const response = await chat.sendMessage({message: PROMPT});

    console.log(response.text);

    return response.text ?? "";
}