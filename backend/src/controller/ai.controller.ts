import { Request, Response, NextFunction } from "express";
import { AIService } from "@/services/ai.service";

export class AIController {
   private aiService = new AIService();

   summarizeText = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { text } = req.body;
         if (!text) return res.status(400).json({ error: 'No text to summarize' })
         // IMPORTANT: await
         const summary = await this.aiService.summarizeText(text)

         res.json({ summary })
      } catch (error) {
         next(error)
      }
   }


   explainText = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { text } = req.body;
         if (!text) return res.status(400).json({ error: 'No text to summarize' })

         const explanation = await this.aiService.explainText(text)

         res.json({ explanation })
      } catch (error) {
         next(error)
      }
   }
}