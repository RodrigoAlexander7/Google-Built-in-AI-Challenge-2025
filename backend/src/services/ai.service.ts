import { geminiApi } from "@/configs/gemini.configs";

export class AIService {
   async summarizeText(prompt: string) {
      const response = await geminiApi.models.generateContent({
         model: "gemini-2.5-flash",
         contents: `Sumarize this text ${prompt}`,
      });
      return response.text
   }
   async explainText(prompt: string) {
      const response = await geminiApi.models.generateContent({
         model: "gemini-2.5-flash",
         contents: `Explain this: ${prompt}`,
      });
      return response.text
   }
}