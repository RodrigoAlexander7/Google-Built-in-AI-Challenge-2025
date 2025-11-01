'use client'

import { NanoClient } from "@/nano/AIClient"
import { FlashcardOptions } from "@/nano/gobal";
import { getFlashcardTemplate } from "./Templates";
import { parseJSONResponse, validateResponseStructure } from "@/nano/utils/ResponseParser";
import { FlashcardResponse } from "@/nano/gobal";

export async function generateFlashcards(flashcardOptions: FlashcardOptions) {
   const client = await NanoClient();
   if (!client) {
      throw new Error("Failed to create NanoClient");
   }

   // Get raw response from AI
   const rawResponse = await client.prompt(getFlashcardTemplate(flashcardOptions));

   // Parse the response (removes markdown formatting if present)
   const parsedResponse = parseJSONResponse<FlashcardResponse>(rawResponse);

   // Validate the response structure
   if (!validateResponseStructure<FlashcardResponse>(parsedResponse, ['flashcards'])) {
      throw new Error('Invalid flashcard response structure');
   }

   return parsedResponse;
}