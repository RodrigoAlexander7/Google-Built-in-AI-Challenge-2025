import { GoogleGenAI } from "@google/genai";
import { ENV } from "@/configs/env";

export const geminiApi = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
