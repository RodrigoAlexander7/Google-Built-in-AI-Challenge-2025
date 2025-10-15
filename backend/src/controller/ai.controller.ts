import { Request, Response, NextFunction } from "express";
import { AIService } from "@/services/ai.service";

export class AIController {
   private aiService = new AIService();

   async summarizeText(req: Request, res: Response, next?: NextFunction) {
      try {
         const { text } = req.body;
         if (!text) return res.status(400).json({ error: 'No text to summarize' })
         const summary = this.aiService.summarizeText(text)
         res.json({ summary })
      } catch (error) {
         //next(error)
      }
   }
}