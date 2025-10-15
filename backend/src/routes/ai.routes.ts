import { Router } from "express";
import { AIController } from "@/controller/ai.controller";


const aiRouter = Router();
const aiController = new AIController();

aiRouter.post('/summarize', aiController.summarizeText)
aiRouter.post('/explain', aiController.explainText)

export default aiRouter;