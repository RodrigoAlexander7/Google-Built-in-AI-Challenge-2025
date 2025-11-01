'use client'

import { NanoClient } from "@/nano/AIClient"
import { FlashcardOptions } from "@/nano/gobal";
import { getFlashcardTemplate } from "./Templates";

export async function generateFlashcards(flashcardOptions: FlashcardOptions) {
   const client = await NanoClient();
   if (!client) {
      throw new Error("Failed to create NanoClient");
   }
   // Create flashcard client with the specified output language
   const response = await client.prompt(getFlashcardTemplate(flashcardOptions))
   return response;
}
