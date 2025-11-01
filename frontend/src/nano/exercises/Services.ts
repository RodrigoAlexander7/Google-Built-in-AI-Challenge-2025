'use client'

import { NanoClient } from "@/nano/AIClient"
import { ExerciseOptions } from "@/nano/gobal";
import { getExerciseTemplate } from "./Templates";
import { parseJSONResponse, validateResponseStructure } from "@/nano/utils/ResponseParser";
import { ExerciseResponse } from "@/nano/gobal";

// Type for the expected exercise response structure

export async function generateExercises(exerciseOptions: ExerciseOptions) {
   const client = await NanoClient();
   if (!client) {
      throw new Error("Failed to create NanoClient");
   }

   // Get raw response from AI
   const rawResponse = await client.prompt(getExerciseTemplate(exerciseOptions));

   // Parse the response (removes markdown formatting if present)
   const parsedResponse = parseJSONResponse<ExerciseResponse>(rawResponse);

   // Validate the response structure
   if (!validateResponseStructure<ExerciseResponse>(parsedResponse, ['exercises'])) {
      throw new Error('Invalid exercise response structure');
   }

   return parsedResponse;
}