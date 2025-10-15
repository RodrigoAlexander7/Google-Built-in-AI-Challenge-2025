import express, { Request, Response } from "express";
import dotenv from "dotenv"
import authRouter from '@/auth/auth.route'
import { verifyToken } from "@/middleware/auth";
import aiRouter from "@/routes/ai.routes";
import { errorHandler } from "@/middleware/error.middleware";

dotenv.config()   // load environment var
const port = 3000;
const app = express();

app.use(express.json())   // middleware to acept json responses
app.use(authRouter)

app.get("/", verifyToken, (req: Request, res: Response) => {
   res.send("Hello word xd");
});

app.use('/ai', aiRouter)  // AI routes

app.use(errorHandler)

app.listen(port, () => {
   console.log(`Servidor corriendo en http://localhost:${port}`);
});

