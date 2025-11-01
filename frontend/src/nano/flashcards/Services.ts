'use client'

import { NanoClient } from "@/nano/AIClient"
import { FlashcardOptions } from "@/nano/gobal";
import { getFlashcardTemplate } from "./Templates";
import { parseJSONResponse, validateResponseStructure } from "@/nano/utils/ResponseParser";
import { FlashcardResponse } from "@/nano/gobal";

export async function generateFlashcards(flashcardOptions: FlashcardOptions) {
   console.groupCollapsed('[nano][flashcards] generateFlashcards')
   console.log('options:', flashcardOptions)
   const t0 = performance.now()
   try {
      const client = await NanoClient();
      console.log('Nano client ready:', Boolean(client))
      if (!client) {
         console.groupEnd()
         throw new Error("Failed to create NanoClient");
      }

      // Build prompt from template
      const prompt = getFlashcardTemplate(flashcardOptions)
      console.log('prompt length:', prompt?.length ?? 0)
      console.log('prompt preview:', typeof prompt === 'string' ? prompt.slice(0, 160) + (prompt.length > 160 ? '…' : '') : '(non-string)')

      // Get raw response from AI
      console.time('[nano][flashcards] client.prompt')
      const rawResponse = await client.prompt(prompt);
      console.timeEnd('[nano][flashcards] client.prompt')
      console.log('raw response type:', typeof rawResponse)
      if (typeof rawResponse === 'string') {
         console.log('raw response length:', rawResponse.length)
         console.log('raw response preview:', rawResponse.slice(0, 160) + (rawResponse.length > 160 ? '…' : ''))
      }

      // Parse the response (removes markdown formatting if present)
      const parsedResponse = parseJSONResponse<FlashcardResponse>(rawResponse);
      console.log('parsed flashcards count:', Array.isArray(parsedResponse?.flashcards) ? parsedResponse.flashcards.length : 0)

      // Validate the response structure
      const valid = validateResponseStructure<FlashcardResponse>(parsedResponse, ['flashcards'])
      console.log('structure valid:', valid)
      if (!valid) {
         console.groupEnd()
         throw new Error('Invalid flashcard response structure');
      }

      console.log('total time (ms):', Math.round(performance.now() - t0))
      console.groupEnd()
      return parsedResponse;
   } catch (err) {
      console.error('[nano][flashcards] generation failed:', err)
      try { console.groupEnd() } catch {}
      throw err
   }
}