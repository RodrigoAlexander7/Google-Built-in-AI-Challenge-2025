'use client'

import { NanoClient } from "@/nano/AIClient"
import { ExerciseOptions } from "@/nano/gobal";
import { getExerciseTemplate } from "./Templates";
import { parseJSONResponse, validateResponseStructure } from "@/nano/utils/ResponseParser";
import { ExerciseResponse } from "@/nano/gobal";

// Type for the expected exercise response structure

export async function generateExercises(exerciseOptions: ExerciseOptions) {
   console.groupCollapsed('[nano][exercises] generateExercises')
   console.log('options:', exerciseOptions)
   const t0 = performance.now()
   try {
      const client = await NanoClient();
      console.log('Nano client ready:', Boolean(client))
      if (!client) {
         console.groupEnd()
         throw new Error("Failed to create NanoClient");
      }

      // Build prompt from template
      const prompt = getExerciseTemplate(exerciseOptions)
      console.log('prompt length:', prompt?.length ?? 0)
      console.log('prompt preview:', typeof prompt === 'string' ? prompt.slice(0, 160) + (prompt.length > 160 ? '…' : '') : '(non-string)')

      // Get raw response from AI
      console.time('[nano][exercises] client.prompt')
      const rawResponse = await client.prompt(prompt);
      console.timeEnd('[nano][exercises] client.prompt')
      console.log('raw response type:', typeof rawResponse)
      if (typeof rawResponse === 'string') {
         console.log('raw response length:', rawResponse.length)
         console.log('raw response preview:', rawResponse.slice(0, 160) + (rawResponse.length > 160 ? '…' : ''))
      }

      // Parse the response (removes markdown formatting if present)
      const parsedResponse = parseJSONResponse<ExerciseResponse>(rawResponse);
      console.log('parsed exercises count:', Array.isArray(parsedResponse?.exercises) ? parsedResponse.exercises.length : 0)

      // Validate the response structure
      const valid = validateResponseStructure<ExerciseResponse>(parsedResponse, ['exercises'])
      console.log('structure valid:', valid)
      if (!valid) {
         console.groupEnd()
         throw new Error('Invalid exercise response structure');
      }

      console.log('total time (ms):', Math.round(performance.now() - t0))
      console.groupEnd()
      return parsedResponse;
   } catch (err) {
      console.error('[nano][exercises] generation failed:', err)
      try { console.groupEnd() } catch {}
      throw err
   }
}